// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title Staking
 * @notice Stake ER2o tokens to earn ER2o rewards.
 *
 * Reward model: owner deposits reward tokens and sets a rewardRate
 * (tokens per second distributed across all stakers, proportional to stake).
 *
 * Based on the Synthetix StakingRewards pattern.
 */
contract Staking is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public immutable stakingToken;
    IERC20 public immutable rewardToken;

    uint256 public rewardRate;          // reward tokens per second (total)
    uint256 public rewardsDuration;     // current reward period length in seconds
    uint256 public periodFinish;        // timestamp when current period ends
    uint256 public lastUpdateTime;
    uint256 public rewardPerTokenStored;

    mapping(address => uint256) public userRewardPerTokenPaid;
    mapping(address => uint256) public rewards;
    mapping(address => uint256) public balances;

    uint256 public totalSupply;

    uint256 public constant MIN_STAKE = 1e18; // 1 token minimum

    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardClaimed(address indexed user, uint256 reward);
    event RewardAdded(uint256 reward, uint256 duration);
    event RewardRateUpdated(uint256 newRate);

    modifier updateReward(address account) {
        rewardPerTokenStored = rewardPerToken();
        lastUpdateTime = lastTimeRewardApplicable();
        if (account != address(0)) {
            rewards[account] = earned(account);
            userRewardPerTokenPaid[account] = rewardPerTokenStored;
        }
        _;
    }

    constructor(
        address _stakingToken,
        address _rewardToken,
        address _owner
    ) Ownable(_owner) {
        require(_stakingToken != address(0), "Staking: zero staking token");
        require(_rewardToken != address(0), "Staking: zero reward token");
        stakingToken = IERC20(_stakingToken);
        rewardToken = IERC20(_rewardToken);
    }

    // ─── View ─────────────────────────────────────────────────────────────────

    function lastTimeRewardApplicable() public view returns (uint256) {
        return block.timestamp < periodFinish ? block.timestamp : periodFinish;
    }

    function rewardPerToken() public view returns (uint256) {
        if (totalSupply == 0) return rewardPerTokenStored;
        return rewardPerTokenStored + (
            (lastTimeRewardApplicable() - lastUpdateTime) * rewardRate * 1e18 / totalSupply
        );
    }

    function earned(address account) public view returns (uint256) {
        return (
            balances[account] * (rewardPerToken() - userRewardPerTokenPaid[account]) / 1e18
        ) + rewards[account];
    }

    function getRewardForDuration() external view returns (uint256) {
        return rewardRate * rewardsDuration;
    }

    // ─── Mutative ─────────────────────────────────────────────────────────────

    /**
     * @notice Stake tokens to start earning rewards.
     */
    function stake(uint256 amount) external nonReentrant updateReward(msg.sender) {
        require(amount >= MIN_STAKE, "Staking: below minimum");
        totalSupply += amount;
        balances[msg.sender] += amount;
        stakingToken.safeTransferFrom(msg.sender, address(this), amount);
        emit Staked(msg.sender, amount);
    }

    /**
     * @notice Withdraw staked tokens.
     */
    function withdraw(uint256 amount) external nonReentrant updateReward(msg.sender) {
        require(amount > 0, "Staking: zero amount");
        require(balances[msg.sender] >= amount, "Staking: insufficient balance");
    totalSupply -= amount;
        balances[msg.sender] -= amount;
        stakingToken.safeTransfer(msg.sender, amount);
        emit Withdrawn(msg.sender, amount);
    }

    /**
     * @notice Claim accumulated rewards.
     */
    function claimReward() external nonReentrant updateReward(msg.sender) {
        uint256 reward = rewards[msg.sender];
        require(reward > 0, "Staking: no rewards");
        rewards[msg.sender] = 0;
        rewardToken.safeTransfer(msg.sender, reward);
        emit RewardClaimed(msg.sender, reward);
    }

    /**
     * @notice Withdraw all staked tokens and claim rewards in one tx.
     */
    function exit() external nonReentrant updateReward(msg.sender) {
        uint256 staked = balances[msg.sender];
        uint256 reward = rewards[msg.sender];

        if (staked > 0) {
            totalSupply -= staked;
            balances[msg.sender] = 0;
            stakingToken.safeTransfer(msg.sender, staked);
            emit Withdrawn(msg.sender, staked);
        }

        if (reward > 0) {
            rewards[msg.sender] = 0;
            rewardToken.safeTransfer(msg.sender, reward);
            emit RewardClaimed(msg.sender, reward);
        }
    }

    // ─── Owner ────────────────────────────────────────────────────────────────

    /**
     * @notice Fund the contract with rewards and set the reward period.
     * @param reward   Total reward tokens to distribute
     * @param duration Period length in seconds
     */
    function notifyRewardAmount(
        uint256 reward,
        uint256 duration
    ) external onlyOwner updateReward(address(0)) {
        require(duration > 0, "Staking: zero duration");
        require(reward > 0, "Staking: zero reward");

        rewardsDuration = duration;

        if (block.timestamp >= periodFinish) {
            rewardRate = reward / duration;
        } else {
            uint256 remaining = periodFinish - block.timestamp;
            uint256 leftover = remaining * rewardRate;
            rewardRate = (reward + leftover) / duration;
        }

        require(rewardRate > 0, "Staking: zero rate");

        lastUpdateTime = block.timestamp;
        periodFinish = block.timestamp + duration;

        // Transfer first, then validate rate against actual balance
        rewardToken.safeTransferFrom(msg.sender, address(this), reward);

        uint256 balance = rewardToken.balanceOf(address(this));
        require(
            rewardRate <= balance / duration,
            "Staking: reward too high for balance"
        );

        emit RewardAdded(reward, duration);
    }

    /**
     * @notice Recover accidentally sent ERC20 tokens (not staking/reward token).
     */
    function recoverERC20(address tokenAddress, uint256 amount) external onlyOwner {
        require(tokenAddress != address(stakingToken), "Staking: cannot recover staking token");
        require(tokenAddress != address(rewardToken), "Staking: cannot recover reward token");
        IERC20(tokenAddress).safeTransfer(owner(), amount);
    }
}
