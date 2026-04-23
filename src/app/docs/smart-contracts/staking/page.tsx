export default function StakingContractPage() {
  return (
    <div className="prose">
      <h1>Staking Contract</h1>
      <p className="lead">
        Stake SADS tokens to earn rewards. Implements a time-weighted reward distribution mechanism with flexible staking periods.
      </p>

      <h2>Overview</h2>
      <p>
        The Staking contract allows users to stake SADS tokens and earn rewards over time. Rewards are distributed 
        proportionally based on stake amount and duration. The contract uses a reward-per-token mechanism to ensure 
        fair distribution.
      </p>

      <h2>Key Features</h2>
      <ul>
        <li>Flexible staking - No lock-up period</li>
        <li>Proportional rewards - Based on stake amount and time</li>
        <li>Compound rewards - Claim and restake anytime</li>
        <li>Emergency exit - Withdraw stake and claim rewards in one transaction</li>
      </ul>

      <h2>Minimum Stake</h2>
      <p>Minimum stake amount: 1 SADS (1,000,000 micro-tokens)</p>

      <h2>Public Functions</h2>

      <h3>stake</h3>
      <pre><code>{`(stake (amount uint))`}</code></pre>
      <p>Stake SADS tokens to start earning rewards.</p>
      <ul>
        <li>amount: Amount of tokens to stake (must be ≥ 1 SADS)</li>
      </ul>

      <h3>withdraw</h3>
      <pre><code>{`(withdraw (amount uint))`}</code></pre>
      <p>Withdraw staked tokens. Does not claim rewards.</p>
      <ul>
        <li>amount: Amount of tokens to withdraw</li>
      </ul>

      <h3>claim-reward</h3>
      <pre><code>{`(claim-reward)`}</code></pre>
      <p>Claim accumulated rewards without withdrawing stake.</p>

      <h3>exit</h3>
      <pre><code>{`(exit)`}</code></pre>
      <p>Withdraw all staked tokens and claim all rewards in one transaction.</p>

      <h2>Owner Functions</h2>

      <h3>notify-reward-amount</h3>
      <pre><code>{`(notify-reward-amount (reward uint) (duration uint))`}</code></pre>
      <p>Add rewards to the contract and set distribution period. Only callable by contract owner.</p>
      <ul>
        <li>reward: Total amount of reward tokens to distribute</li>
        <li>duration: Distribution period in blocks</li>
      </ul>

      <h3>recover-erc20</h3>
      <pre><code>{`(recover-erc20 (token-contract <ft-trait>) (amount uint))`}</code></pre>
      <p>Recover accidentally sent tokens. Only callable by contract owner.</p>

      <h2>Read-Only Functions</h2>

      <h3>get-balance</h3>
      <pre><code>{`(get-balance (account principal))`}</code></pre>
      <p>Returns the staked balance for an account.</p>

      <h3>get-total-supply</h3>
      <pre><code>{`(get-total-supply)`}</code></pre>
      <p>Returns the total amount of tokens staked in the contract.</p>

      <h3>get-reward-rate</h3>
      <pre><code>{`(get-reward-rate)`}</code></pre>
      <p>Returns the current reward rate (tokens per block).</p>

      <h3>get-period-finish</h3>
      <pre><code>{`(get-period-finish)`}</code></pre>
      <p>Returns the block height when the current reward period ends.</p>

      <h3>earned</h3>
      <pre><code>{`(earned (account principal))`}</code></pre>
      <p>Returns the amount of rewards earned by an account.</p>

      <h3>get-reward-for-duration</h3>
      <pre><code>{`(get-reward-for-duration)`}</code></pre>
      <p>Returns the total rewards for the current period.</p>

      <h3>last-time-reward-applicable</h3>
      <pre><code>{`(last-time-reward-applicable)`}</code></pre>
      <p>Returns the last block height where rewards are applicable.</p>

      <h3>reward-per-token</h3>
      <pre><code>{`(reward-per-token)`}</code></pre>
      <p>Returns the accumulated reward per token staked.</p>

      <h2>Error Codes</h2>
      <ul>
        <li>u300: Owner only</li>
        <li>u301: Insufficient balance</li>
        <li>u302: Below minimum stake (1 SADS)</li>
        <li>u303: No rewards to claim</li>
        <li>u304: Zero amount</li>
        <li>u305: Zero duration</li>
        <li>u306: Zero rate</li>
      </ul>

      <h2>Usage Examples</h2>

      <h3>Stake Tokens</h3>
      <pre><code>{`// Stake 100 SADS
(contract-call? .staking stake u100000000)`}</code></pre>

      <h3>Check Earned Rewards</h3>
      <pre><code>{`// Check rewards for an address
(contract-call? .staking earned 
  'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
)`}</code></pre>

      <h3>Claim Rewards</h3>
      <pre><code>{`// Claim accumulated rewards
(contract-call? .staking claim-reward)`}</code></pre>

      <h3>Exit (Withdraw All + Claim)</h3>
      <pre><code>{`// Withdraw all stake and claim rewards
(contract-call? .staking exit)`}</code></pre>

      <h2>Reward Calculation</h2>
      <p>Rewards are calculated using the formula:</p>
      <pre><code>{`earned = (staked-balance * (reward-per-token - user-paid)) / 1,000,000 + user-rewards`}</code></pre>
      <p>Where:</p>
      <ul>
        <li>staked-balance: User's staked token amount</li>
        <li>reward-per-token: Accumulated reward per token</li>
        <li>user-paid: Last reward-per-token value when user interacted</li>
        <li>user-rewards: Previously accumulated but unclaimed rewards</li>
      </ul>

      <h2>APY Calculation</h2>
      <p>Annual Percentage Yield (APY) can be estimated as:</p>
      <pre><code>{`APY = (reward-rate * blocks-per-year * 100) / total-staked`}</code></pre>
      <p>Where blocks-per-year ≈ 52,560 (assuming 10-minute blocks)</p>

      <h2>Reward Distribution</h2>
      <p>
        The contract owner periodically adds rewards using notify-reward-amount. Rewards are distributed 
        linearly over the specified duration. Users earn rewards proportional to their stake and time staked.
      </p>

      <h3>Example Reward Period</h3>
      <pre><code>{`// Add 10,000 SADS rewards over 1,440 blocks (~10 days)
(contract-call? .staking notify-reward-amount 
  u10000000000 ;; 10,000 SADS
  u1440        ;; 1,440 blocks
)`}</code></pre>

      <h2>Security Considerations</h2>
      <ul>
        <li>Rewards update on every stake/withdraw/claim to prevent manipulation</li>
        <li>Minimum stake prevents dust attacks</li>
        <li>Owner functions restricted to contract owner</li>
        <li>Exit function allows emergency withdrawal</li>
      </ul>

      <h2>Best Practices</h2>
      <ul>
        <li>Stake for longer periods to maximize rewards</li>
        <li>Claim rewards regularly to compound earnings</li>
        <li>Monitor reward rate and APY before staking</li>
        <li>Use exit function for quick withdrawal + claim</li>
      </ul>
    </div>
  );
}
