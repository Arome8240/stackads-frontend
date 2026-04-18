// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title Vesting
 * @notice Linear vesting with cliff for ER2o token allocations.
 *
 * Flow:
 *  1. Owner creates a vesting schedule for a beneficiary
 *  2. Tokens are locked in this contract
 *  3. After cliff, tokens vest linearly until end of duration
 *  4. Beneficiary calls release() to claim vested tokens
 *  5. Owner can revoke a revocable schedule (unvested tokens return to owner)
 */
contract Vesting is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    struct Schedule {
        address beneficiary;
        uint256 start;       // unix timestamp
        uint256 cliff;       // seconds after start before any tokens vest
        uint256 duration;    // total vesting duration in seconds
        uint256 total;       // total tokens allocated
        uint256 released;    // tokens already claimed
        bool revocable;
        bool revoked;
    }

    IERC20 public immutable token;

    mapping(bytes32 => Schedule) public schedules;
    bytes32[] public scheduleIds;

    event ScheduleCreated(
        bytes32 indexed id,
        address indexed beneficiary,
        uint256 total,
        uint256 start,
        uint256 cliff,
        uint256 duration,
        bool revocable
    );
    event TokensReleased(bytes32 indexed id, address indexed beneficiary, uint256 amount);
    event ScheduleRevoked(bytes32 indexed id, uint256 refunded);

    constructor(address _token, address _owner) Ownable(_owner) {
        require(_token != address(0), "Vesting: zero token");
        token = IERC20(_token);
    }

    /**
     * @notice Create a new vesting schedule.
     * @param beneficiary  Who receives the tokens
     * @param total        Total tokens to vest (in wei)
     * @param start        Unix timestamp for vesting start
     * @param cliffSeconds Seconds after start before first tokens vest
     * @param duration     Total vesting duration in seconds
     * @param revocable    Whether owner can revoke this schedule
     */
    function createSchedule(
        address beneficiary,
        uint256 total,
        uint256 start,
        uint256 cliffSeconds,
        uint256 duration,
        bool revocable
    ) external onlyOwner returns (bytes32 id) {
        require(beneficiary != address(0), "Vesting: zero beneficiary");
        require(total > 0, "Vesting: zero amount");
        require(duration > 0, "Vesting: zero duration");
        require(cliffSeconds <= duration, "Vesting: cliff > duration");
        require(start >= block.timestamp, "Vesting: start in past");

        id = keccak256(
            abi.encodePacked(beneficiary, start, duration, block.timestamp)
        );
        require(schedules[id].total == 0, "Vesting: schedule exists");

        token.safeTransferFrom(msg.sender, address(this), total);

        schedules[id] = Schedule({
            beneficiary: beneficiary,
            start: start,
            cliff: start + cliffSeconds,
            duration: duration,
            total: total,
            released: 0,
            revocable: revocable,
            revoked: false
        });
        scheduleIds.push(id);

        emit ScheduleCreated(id, beneficiary, total, start, start + cliffSeconds, duration, revocable);
    }

    /**
     * @notice Release vested tokens for a schedule.
     * @param id Schedule identifier
     */
    function release(bytes32 id) external nonReentrant {
        Schedule storage s = schedules[id];
        require(s.total > 0, "Vesting: unknown schedule");
        require(!s.revoked, "Vesting: revoked");
        require(msg.sender == s.beneficiary, "Vesting: not beneficiary");

        uint256 vestedAmt = _vestedAmount(s);
        uint256 claimable = vestedAmt - s.released;
        require(claimable > 0, "Vesting: nothing to release");

        s.released += claimable;
        token.safeTransfer(s.beneficiary, claimable);

        emit TokensReleased(id, s.beneficiary, claimable);
    }

    /**
     * @notice Revoke a revocable schedule. Unvested tokens return to owner.
     * @param id Schedule identifier
     */
    function revoke(bytes32 id) external onlyOwner nonReentrant {
        Schedule storage s = schedules[id];
        require(s.total > 0, "Vesting: unknown schedule");
        require(s.revocable, "Vesting: not revocable");
        require(!s.revoked, "Vesting: already revoked");

        uint256 vestedAmt = _vestedAmount(s);
        uint256 refund = s.total - vestedAmt;

        s.revoked = true;

        if (refund > 0) {
            token.safeTransfer(owner(), refund);
        }

        emit ScheduleRevoked(id, refund);
    }

    /**
     * @notice Returns how many tokens are currently releasable for a schedule.
     */
    function releasable(bytes32 id) external view returns (uint256) {
        Schedule storage s = schedules[id];
        if (s.revoked) return 0;
        return _vestedAmount(s) - s.released;
    }

    /**
     * @notice Returns total vested amount at current time (including already released).
     */
    function vested(bytes32 id) external view returns (uint256) {
        return _vestedAmount(schedules[id]);
    }

    function totalSchedules() external view returns (uint256) {
        return scheduleIds.length;
    }

    // ─── Internal ────────────────────────────────────────────────────────────

    function _vestedAmount(Schedule storage s) internal view returns (uint256) {
        if (block.timestamp < s.cliff) return 0;
        if (block.timestamp >= s.start + s.duration) return s.total;
        uint256 elapsed = block.timestamp - s.start;
        return (s.total * elapsed) / s.duration;
    }
}
