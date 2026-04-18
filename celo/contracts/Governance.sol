// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Governance
 * @notice On-chain governance for StackAds protocol parameters.
 *
 * Flow:
 *  1. Any ER2o holder with >= PROPOSAL_THRESHOLD tokens can create a proposal
 *  2. Voting is open for VOTING_PERIOD blocks
 *  3. A proposal passes if FOR votes > AGAINST votes and quorum is met
 *  4. After TIMELOCK_DELAY blocks, anyone can execute a passed proposal
 *  5. Execution calls an arbitrary target with calldata (e.g. update protocol fee)
 *
 * Voting power = ER2o balance at proposal creation block (snapshot).
 */
contract Governance is Ownable, ReentrancyGuard {
    IERC20 public immutable token;

    uint256 public votingPeriod = 50400;      // ~7 days at 12s/block
    uint256 public timelockDelay = 14400;     // ~2 days
    uint256 public proposalThreshold = 10_000 * 1e18; // 10k ER2o to propose
    uint256 public quorumVotes = 100_000 * 1e18;      // 100k ER2o quorum

    enum ProposalState { Pending, Active, Defeated, Succeeded, Queued, Executed, Cancelled }

    struct Proposal {
        uint256 id;
        address proposer;
        address target;
        bytes callData;
        string description;
        uint256 startBlock;
        uint256 endBlock;
        uint256 forVotes;
        uint256 againstVotes;
        uint256 abstainVotes;
        uint256 eta;          // earliest execution timestamp (0 = not queued)
        bool executed;
        bool cancelled;
    }

    mapping(uint256 => Proposal) public proposals;
    // proposalId => voter => hasVoted
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    // proposalId => voter => support (0=against, 1=for, 2=abstain)
    mapping(uint256 => mapping(address => uint8)) public voteChoice;

    uint256 public proposalCount;

    event ProposalCreated(
        uint256 indexed id,
        address indexed proposer,
        address target,
        string description,
        uint256 startBlock,
        uint256 endBlock
    );
    event VoteCast(uint256 indexed proposalId, address indexed voter, uint8 support, uint256 weight);
    event ProposalQueued(uint256 indexed id, uint256 eta);
    event ProposalExecuted(uint256 indexed id);
    event ProposalCancelled(uint256 indexed id);
    event ParameterUpdated(string param, uint256 value);

    constructor(address _token, address _owner) Ownable(_owner) {
        require(_token != address(0), "Governance: zero token");
        token = IERC20(_token);
    }

    // ─── Propose ──────────────────────────────────────────────────────────────

    /**
     * @notice Create a new governance proposal.
     * @param target      Contract to call on execution
     * @param callData    Encoded function call
     * @param description Human-readable description
     */
    function propose(
        address target,
        bytes calldata callData,
        string calldata description
    ) external returns (uint256 id) {
        require(target != address(0), "Governance: zero target");
        require(bytes(description).length > 0, "Governance: empty description");
        require(
            token.balanceOf(msg.sender) >= proposalThreshold,
            "Governance: below proposal threshold"
        );

        id = ++proposalCount;
        uint256 start = block.number + 1;
        uint256 end = start + votingPeriod;

        proposals[id] = Proposal({
            id: id,
            proposer: msg.sender,
            target: target,
            callData: callData,
            description: description,
            startBlock: start,
            endBlock: end,
            forVotes: 0,
            againstVotes: 0,
            abstainVotes: 0,
            eta: 0,
            executed: false,
            cancelled: false
        });

        emit ProposalCreated(id, msg.sender, target, description, start, end);
    }

    // ─── Vote ─────────────────────────────────────────────────────────────────

    /**
     * @notice Cast a vote on a proposal.
     * @param proposalId Proposal to vote on
     * @param support    0 = Against, 1 = For, 2 = Abstain
     */
    function castVote(uint256 proposalId, uint8 support) external {
        require(support <= 2, "Governance: invalid support value");
        Proposal storage p = proposals[proposalId];
        require(p.id != 0, "Governance: unknown proposal");
        require(state(proposalId) == ProposalState.Active, "Governance: not active");
        require(!hasVoted[proposalId][msg.sender], "Governance: already voted");

        uint256 weight = token.balanceOf(msg.sender);
        require(weight > 0, "Governance: no voting power");

        hasVoted[proposalId][msg.sender] = true;
        voteChoice[proposalId][msg.sender] = support;

        if (support == 0) p.againstVotes += weight;
        else if (support == 1) p.forVotes += weight;
        else p.abstainVotes += weight;

        emit VoteCast(proposalId, msg.sender, support, weight);
    }

    // ─── Queue & Execute ──────────────────────────────────────────────────────

    /**
     * @notice Queue a succeeded proposal for execution after timelock.
     */
    function queue(uint256 proposalId) external {
        require(state(proposalId) == ProposalState.Succeeded, "Governance: not succeeded");
        Proposal storage p = proposals[proposalId];
        p.eta = block.timestamp + timelockDelay;
        emit ProposalQueued(proposalId, p.eta);
    }

    /**
     * @notice Execute a queued proposal after timelock has elapsed.
     */
    function execute(uint256 proposalId) external nonReentrant {
        require(state(proposalId) == ProposalState.Queued, "Governance: not queued");
        Proposal storage p = proposals[proposalId];
        require(block.timestamp >= p.eta, "Governance: timelock not elapsed");

        p.executed = true;

        (bool success, bytes memory returnData) = p.target.call(p.callData);
        require(success, _getRevertMsg(returnData));

        emit ProposalExecuted(proposalId);
    }

    /**
     * @notice Cancel a proposal. Only proposer or owner can cancel.
     */
    function cancel(uint256 proposalId) external {
        Proposal storage p = proposals[proposalId];
        require(p.id != 0, "Governance: unknown proposal");
        require(!p.executed, "Governance: already executed");
        require(
            msg.sender == p.proposer || msg.sender == owner(),
            "Governance: not authorized"
        );

        p.cancelled = true;
        emit ProposalCancelled(proposalId);
    }

    // ─── View ─────────────────────────────────────────────────────────────────

    function state(uint256 proposalId) public view returns (ProposalState) {
        Proposal storage p = proposals[proposalId];
        require(p.id != 0, "Governance: unknown proposal");

        if (p.cancelled) return ProposalState.Cancelled;
        if (p.executed) return ProposalState.Executed;
        if (block.number <= p.startBlock) return ProposalState.Pending;
        if (block.number <= p.endBlock) return ProposalState.Active;

        bool quorumReached = (p.forVotes + p.againstVotes + p.abstainVotes) >= quorumVotes;
        bool passed = p.forVotes > p.againstVotes;

        if (!quorumReached || !passed) return ProposalState.Defeated;
        if (p.eta == 0) return ProposalState.Succeeded;
        return ProposalState.Queued;
    }

    function getProposal(uint256 id) external view returns (Proposal memory) {
        return proposals[id];
    }

    // ─── Owner params ─────────────────────────────────────────────────────────

    function setVotingPeriod(uint256 blocks) external onlyOwner {
        require(blocks >= 100, "Governance: period too short");
        votingPeriod = blocks;
        emit ParameterUpdated("votingPeriod", blocks);
    }

    function setTimelockDelay(uint256 blocks) external onlyOwner {
        timelockDelay = blocks;
        emit ParameterUpdated("timelockDelay", blocks);
    }

    function setProposalThreshold(uint256 amount) external onlyOwner {
        proposalThreshold = amount;
        emit ParameterUpdated("proposalThreshold", amount);
    }

    function setQuorumVotes(uint256 amount) external onlyOwner {
        quorumVotes = amount;
        emit ParameterUpdated("quorumVotes", amount);
    }

    // ─── Internal ─────────────────────────────────────────────────────────────

    function _getRevertMsg(bytes memory returnData) internal pure returns (string memory) {
        if (returnData.length < 68) return "Governance: execution failed";
        assembly { returnData := add(returnData, 0x04) }
        return abi.decode(returnData, (string));
    }
}
