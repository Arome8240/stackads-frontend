// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title AdTreasury
 * @notice Escrow contract for StackAds on-chain ad campaigns.
 *
 * Flow:
 *  1. Advertiser deposits ER2o and creates a campaign with a budget
 *  2. StackAds protocol (owner/oracle) calls recordImpression() as ads are served
 *  3. Publisher calls claimRevenue() to withdraw their earned share
 *  4. Advertiser can pause/cancel and reclaim unspent budget
 *
 * Fee: protocol takes a configurable % of each payout (default 5%)
 */
contract AdTreasury is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public immutable token;

    uint256 public constant FEE_DENOMINATOR = 10_000;
    uint256 public protocolFeeBps = 500; // 5%
    address public feeRecipient;

    enum CampaignStatus { Active, Paused, Cancelled, Completed }

    struct Campaign {
        address advertiser;
        uint256 budget;          // total deposited
        uint256 spent;           // total paid out to publishers
        uint256 costPerImpression; // ER2o wei per impression
        CampaignStatus status;
        uint256 createdAt;
    }

    mapping(uint256 => Campaign) public campaigns;
    mapping(uint256 => mapping(address => uint256)) public publisherEarnings; // campaignId => publisher => earned
    mapping(address => uint256) public claimable; // publisher => total claimable across all campaigns

    uint256 public nextCampaignId = 1;

    event CampaignCreated(uint256 indexed id, address indexed advertiser, uint256 budget, uint256 cpi);
    event ImpressionRecorded(uint256 indexed campaignId, address indexed publisher, uint256 payout);
    event RevenueClaimed(address indexed publisher, uint256 amount);
    event CampaignPaused(uint256 indexed id);
    event CampaignResumed(uint256 indexed id);
    event CampaignCancelled(uint256 indexed id, uint256 refund);
    event ProtocolFeeUpdated(uint256 newFeeBps);
    event FeeRecipientUpdated(address newRecipient);

    modifier onlyAdvertiser(uint256 campaignId) {
        require(campaigns[campaignId].advertiser == msg.sender, "AdTreasury: not advertiser");
        _;
    }

    modifier campaignActive(uint256 campaignId) {
        require(campaigns[campaignId].status == CampaignStatus.Active, "AdTreasury: not active");
        _;
    }

    constructor(address _token, address _owner, address _feeRecipient) Ownable(_owner) {
        require(_token != address(0), "AdTreasury: zero token");
        require(_feeRecipient != address(0), "AdTreasury: zero fee recipient");
        token = IERC20(_token);
        feeRecipient = _feeRecipient;
    }

    // ─── Advertiser ───────────────────────────────────────────────────────────

    /**
     * @notice Create a new ad campaign by depositing ER2o budget.
     * @param budget            Total ER2o to allocate (in wei)
     * @param costPerImpression ER2o paid per impression (in wei)
     */
    function createCampaign(
        uint256 budget,
        uint256 costPerImpression
    ) external nonReentrant returns (uint256 id) {
        require(budget > 0, "AdTreasury: zero budget");
        require(costPerImpression > 0, "AdTreasury: zero CPI");
        require(budget >= costPerImpression, "AdTreasury: budget < CPI");

        id = nextCampaignId++;
        campaigns[id] = Campaign({
            advertiser: msg.sender,
            budget: budget,
            spent: 0,
            costPerImpression: costPerImpression,
            status: CampaignStatus.Active,
            createdAt: block.timestamp
        });

        token.safeTransferFrom(msg.sender, address(this), budget);
        emit CampaignCreated(id, msg.sender, budget, costPerImpression);
    }

    /**
     * @notice Pause a campaign (no new impressions will be recorded).
     */
    function pauseCampaign(uint256 id) external onlyAdvertiser(id) campaignActive(id) {
        campaigns[id].status = CampaignStatus.Paused;
        emit CampaignPaused(id);
    }

    /**
     * @notice Resume a paused campaign.
     */
    function resumeCampaign(uint256 id) external onlyAdvertiser(id) {
        require(campaigns[id].status == CampaignStatus.Paused, "AdTreasury: not paused");
        campaigns[id].status = CampaignStatus.Active;
        emit CampaignResumed(id);
    }

    /**
     * @notice Cancel a campaign and reclaim unspent budget.
     */
    function cancelCampaign(uint256 id) external onlyAdvertiser(id) nonReentrant {
        Campaign storage c = campaigns[id];
        require(
            c.status == CampaignStatus.Active || c.status == CampaignStatus.Paused,
            "AdTreasury: cannot cancel"
        );

        uint256 refund = c.budget - c.spent;
        c.status = CampaignStatus.Cancelled;

        if (refund > 0) {
            token.safeTransfer(c.advertiser, refund);
        }

        emit CampaignCancelled(id, refund);
    }

    // ─── Protocol Oracle ──────────────────────────────────────────────────────

    /**
     * @notice Record a verified impression and allocate payout to publisher.
     *         Called by the StackAds protocol oracle (owner).
     * @param campaignId  Campaign that served the ad
     * @param publisher   Publisher address to credit
     * @param count       Number of impressions to record
     */
    function recordImpression(
        uint256 campaignId,
        address publisher,
        uint256 count
    ) external onlyOwner campaignActive(campaignId) {
        require(publisher != address(0), "AdTreasury: zero publisher");
        require(count > 0, "AdTreasury: zero count");

        Campaign storage c = campaigns[campaignId];
        uint256 gross = c.costPerImpression * count;
        uint256 remaining = c.budget - c.spent;

        // Cap at remaining budget
        if (gross > remaining) gross = remaining;

        uint256 fee = (gross * protocolFeeBps) / FEE_DENOMINATOR;
        uint256 net = gross - fee;

        c.spent += gross;
        publisherEarnings[campaignId][publisher] += net;
        claimable[publisher] += net;

        // Send fee immediately to fee recipient
        if (fee > 0) {
            token.safeTransfer(feeRecipient, fee);
        }

        // Auto-complete if budget exhausted
        if (c.spent >= c.budget) {
            c.status = CampaignStatus.Completed;
        }

        emit ImpressionRecorded(campaignId, publisher, net);
    }

    // ─── Publisher ────────────────────────────────────────────────────────────

    /**
     * @notice Claim all accumulated revenue.
     */
    function claimRevenue() external nonReentrant {
        uint256 amount = claimable[msg.sender];
        require(amount > 0, "AdTreasury: nothing to claim");
        claimable[msg.sender] = 0;
        token.safeTransfer(msg.sender, amount);
        emit RevenueClaimed(msg.sender, amount);
    }

    // ─── Owner ────────────────────────────────────────────────────────────────

    function setProtocolFee(uint256 feeBps) external onlyOwner {
        require(feeBps <= 2000, "AdTreasury: fee too high"); // max 20%
        protocolFeeBps = feeBps;
        emit ProtocolFeeUpdated(feeBps);
    }

    function setFeeRecipient(address recipient) external onlyOwner {
        require(recipient != address(0), "AdTreasury: zero address");
        feeRecipient = recipient;
        emit FeeRecipientUpdated(recipient);
    }

    // ─── View ─────────────────────────────────────────────────────────────────

    function remainingBudget(uint256 campaignId) external view returns (uint256) {
        Campaign storage c = campaigns[campaignId];
        return c.budget - c.spent;
    }

    function maxImpressions(uint256 campaignId) external view returns (uint256) {
        Campaign storage c = campaigns[campaignId];
        if (c.costPerImpression == 0) return 0;
        return (c.budget - c.spent) / c.costPerImpression;
    }
}
