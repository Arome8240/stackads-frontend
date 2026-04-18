// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title AdRegistry
 * @notice On-chain registry for StackAds publishers and advertisers.
 *
 * Publishers register their app/site and stake ER2o as collateral.
 * Advertisers register and stake ER2o to access premium inventory.
 * The protocol can slash stake for bad actors (fraud, ToS violations).
 * Reputation scores are updated by the protocol oracle.
 */
contract AdRegistry is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public immutable token;

    uint256 public publisherStakeRequired = 100 * 1e18;   // 100 ER2o
    uint256 public advertiserStakeRequired = 500 * 1e18;  // 500 ER2o

    enum ParticipantType { Publisher, Advertiser }
    enum Status { Unregistered, Active, Suspended, Slashed }

    struct Participant {
        address addr;
        ParticipantType pType;
        Status status;
        uint256 stakedAmount;
        uint256 reputationScore;  // 0–1000
        string metadataURI;       // IPFS URI with app/site details
        uint256 registeredAt;
        uint256 totalImpressions;
        uint256 totalClicks;
    }

    mapping(address => Participant) public participants;
    address[] public publisherList;
    address[] public advertiserList;

    event Registered(address indexed participant, ParticipantType pType, uint256 staked);
    event Unregistered(address indexed participant, uint256 refunded);
    event ReputationUpdated(address indexed participant, uint256 oldScore, uint256 newScore);
    event ParticipantSuspended(address indexed participant, string reason);
    event ParticipantSlashed(address indexed participant, uint256 slashedAmount, string reason);
    event MetadataUpdated(address indexed participant, string newURI);
    event StakeRequirementUpdated(ParticipantType pType, uint256 newAmount);
    event StatsUpdated(address indexed participant, uint256 impressions, uint256 clicks);

    modifier onlyActive(address addr) {
        require(participants[addr].status == Status.Active, "AdRegistry: not active");
        _;
    }

    constructor(address _token, address _owner) Ownable(_owner) {
        require(_token != address(0), "AdRegistry: zero token");
        token = IERC20(_token);
    }

    // ─── Registration ─────────────────────────────────────────────────────────

    /**
     * @notice Register as a publisher. Stakes ER2o as collateral.
     * @param metadataURI IPFS URI pointing to app/site metadata JSON
     */
    function registerPublisher(string calldata metadataURI) external nonReentrant {
        _register(msg.sender, ParticipantType.Publisher, metadataURI, publisherStakeRequired);
        publisherList.push(msg.sender);
    }

    /**
     * @notice Register as an advertiser. Stakes ER2o as collateral.
     * @param metadataURI IPFS URI pointing to advertiser metadata JSON
     */
    function registerAdvertiser(string calldata metadataURI) external nonReentrant {
        _register(msg.sender, ParticipantType.Advertiser, metadataURI, advertiserStakeRequired);
        advertiserList.push(msg.sender);
    }

    /**
     * @notice Unregister and reclaim stake (only if Active).
     */
    function unregister() external nonReentrant onlyActive(msg.sender) {
        Participant storage p = participants[msg.sender];
        uint256 refund = p.stakedAmount;
        p.stakedAmount = 0;
        p.status = Status.Unregistered;

        if (refund > 0) {
            token.safeTransfer(msg.sender, refund);
        }

        emit Unregistered(msg.sender, refund);
    }

    /**
     * @notice Update metadata URI for your registration.
     */
    function updateMetadata(string calldata newURI) external onlyActive(msg.sender) {
        require(bytes(newURI).length > 0, "AdRegistry: empty URI");
        participants[msg.sender].metadataURI = newURI;
        emit MetadataUpdated(msg.sender, newURI);
    }

    // ─── Oracle / Protocol ────────────────────────────────────────────────────

    /**
     * @notice Update reputation score for a participant. Called by protocol oracle.
     * @param participant Address to update
     * @param newScore    Score between 0 and 1000
     */
    function updateReputation(
        address participant,
        uint256 newScore
    ) external onlyOwner {
        require(newScore <= 1000, "AdRegistry: score out of range");
        uint256 old = participants[participant].reputationScore;
        participants[participant].reputationScore = newScore;
        emit ReputationUpdated(participant, old, newScore);
    }

    /**
     * @notice Record impression and click stats for a publisher.
     */
    function recordStats(
        address publisher,
        uint256 impressions,
        uint256 clicks
    ) external onlyOwner {
        require(clicks <= impressions, "AdRegistry: clicks > impressions");
        Participant storage p = participants[publisher];
        p.totalImpressions += impressions;
        p.totalClicks += clicks;
        emit StatsUpdated(publisher, p.totalImpressions, p.totalClicks);
    }

    /**
     * @notice Suspend a participant (no stake loss, reversible).
     */
    function suspend(address participant, string calldata reason) external onlyOwner {
        require(
            participants[participant].status == Status.Active,
            "AdRegistry: not active"
        );
        participants[participant].status = Status.Suspended;
        emit ParticipantSuspended(participant, reason);
    }

    /**
     * @notice Reinstate a suspended participant.
     */
    function reinstate(address participant) external onlyOwner {
        require(
            participants[participant].status == Status.Suspended,
            "AdRegistry: not suspended"
        );
        participants[participant].status = Status.Active;
    }

    /**
     * @notice Slash a participant's stake (fraud/ToS violation).
     * @param participant  Address to slash
     * @param bps          Basis points to slash (e.g. 5000 = 50%)
     * @param reason       Reason for slashing
     */
    function slash(
        address participant,
        uint256 bps,
        string calldata reason
    ) external onlyOwner nonReentrant {
        require(bps <= 10_000, "AdRegistry: bps > 100%");
        Participant storage p = participants[participant];
        require(p.stakedAmount > 0, "AdRegistry: no stake");

        uint256 slashAmt = (p.stakedAmount * bps) / 10_000;
        p.stakedAmount -= slashAmt;
        p.status = Status.Slashed;
        p.reputationScore = 0;

        // Slashed tokens go to owner (protocol treasury)
        if (slashAmt > 0) {
            token.safeTransfer(owner(), slashAmt);
        }

        emit ParticipantSlashed(participant, slashAmt, reason);
    }

    // ─── Admin ────────────────────────────────────────────────────────────────

    function setPublisherStakeRequired(uint256 amount) external onlyOwner {
        publisherStakeRequired = amount;
        emit StakeRequirementUpdated(ParticipantType.Publisher, amount);
    }

    function setAdvertiserStakeRequired(uint256 amount) external onlyOwner {
        advertiserStakeRequired = amount;
        emit StakeRequirementUpdated(ParticipantType.Advertiser, amount);
    }

    // ─── View ─────────────────────────────────────────────────────────────────

    function isActivePublisher(address addr) external view returns (bool) {
        Participant storage p = participants[addr];
        return p.status == Status.Active && p.pType == ParticipantType.Publisher;
    }

    function isActiveAdvertiser(address addr) external view returns (bool) {
        Participant storage p = participants[addr];
        return p.status == Status.Active && p.pType == ParticipantType.Advertiser;
    }

    function publisherCount() external view returns (uint256) {
        return publisherList.length;
    }

    function advertiserCount() external view returns (uint256) {
        return advertiserList.length;
    }

    function getClickThroughRate(address publisher) external view returns (uint256) {
        Participant storage p = participants[publisher];
        if (p.totalImpressions == 0) return 0;
        return (p.totalClicks * 10_000) / p.totalImpressions; // bps
    }

    // ─── Internal ─────────────────────────────────────────────────────────────

    function _register(
        address addr,
        ParticipantType pType,
        string calldata metadataURI,
        uint256 stakeRequired
    ) internal {
        require(
            participants[addr].status == Status.Unregistered,
            "AdRegistry: already registered"
        );
        require(bytes(metadataURI).length > 0, "AdRegistry: empty metadata");

        token.safeTransferFrom(addr, address(this), stakeRequired);

        participants[addr] = Participant({
            addr: addr,
            pType: pType,
            status: Status.Active,
            stakedAmount: stakeRequired,
            reputationScore: 500, // start at neutral
            metadataURI: metadataURI,
            registeredAt: block.timestamp,
            totalImpressions: 0,
            totalClicks: 0
        });

        emit Registered(addr, pType, stakeRequired);
    }
}
