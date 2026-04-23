export default function ReferralContractPage() {
  return (
    <div className="prose">
      <h1>Referral System Contract</h1>
      <p className="lead">
        Incentivize user acquisition through a tiered referral program. Earn rewards for bringing new users to the platform.
      </p>

      <h2>Overview</h2>
      <p>
        The Referral System rewards users for inviting others to StackAds. Referrers earn bonuses based on their tier 
        and referee activity, while referees also receive welcome bonuses.
      </p>

      <h2>Key Features</h2>
      <ul>
        <li>Custom referral codes</li>
        <li>Four-tier reward system</li>
        <li>Activity-based rewards</li>
        <li>Bonuses for both referrer and referee</li>
        <li>Automatic tier upgrades</li>
      </ul>

      <h2>Referral Tiers</h2>

      <h3>Bronze (1)</h3>
      <ul>
        <li>Requirements: 0+ referrals</li>
        <li>Referrer Bonus: 5% of referee activity</li>
        <li>Referee Bonus: 2.5% of their activity</li>
      </ul>

      <h3>Silver (2)</h3>
      <ul>
        <li>Requirements: 10+ referrals</li>
        <li>Referrer Bonus: 7.5% of referee activity</li>
        <li>Referee Bonus: 3.75% of their activity</li>
      </ul>

      <h3>Gold (3)</h3>
      <ul>
        <li>Requirements: 50+ referrals</li>
        <li>Referrer Bonus: 10% of referee activity</li>
        <li>Referee Bonus: 5% of their activity</li>
      </ul>

      <h3>Platinum (4)</h3>
      <ul>
        <li>Requirements: 100+ referrals</li>
        <li>Referrer Bonus: 15% of referee activity</li>
        <li>Referee Bonus: 7.5% of their activity</li>
      </ul>

      <h2>Default Settings</h2>
      <ul>
        <li>Base Referral Bonus: 5 SADS</li>
        <li>Minimum Activity Threshold: 10 SADS spent</li>
      </ul>

      <h2>Public Functions</h2>

      <h3>create-referral-code</h3>
      <pre><code>{`(create-referral-code (code (string-ascii 20)))`}</code></pre>
      <p>Create a custom referral code. Code must be unique and at least 4 characters.</p>

      <h3>use-referral-code</h3>
      <pre><code>{`(use-referral-code (code (string-ascii 20)))`}</code></pre>
      <p>Use a referral code when joining the platform. Can only be used once per address.</p>

      <h3>record-referral-activity</h3>
      <pre><code>{`(record-referral-activity (user principal) (activity-amount uint))`}</code></pre>
      <p>Record user activity to trigger referral rewards. Only callable by contract owner (oracle).</p>
      <ul>
        <li>activity-amount: Amount spent/staked by user</li>
        <li>Must meet minimum threshold (10 SADS default)</li>
      </ul>

      <h3>claim-referral-rewards</h3>
      <pre><code>{`(claim-referral-rewards (referee principal))`}</code></pre>
      <p>Claim rewards earned from a specific referee's activity.</p>

      <h3>claim-referee-bonus</h3>
      <pre><code>{`(claim-referee-bonus (referrer principal))`}</code></pre>
      <p>Claim welcome bonus as a referee.</p>

      <h2>Admin Functions</h2>

      <h3>set-referral-bonus</h3>
      <pre><code>{`(set-referral-bonus (new-bonus uint))`}</code></pre>
      <p>Update the base referral bonus amount.</p>

      <h3>set-activity-threshold</h3>
      <pre><code>{`(set-activity-threshold (new-threshold uint))`}</code></pre>
      <p>Update minimum activity required to trigger rewards.</p>

      <h3>update-tier-config</h3>
      <pre><code>{`(update-tier-config
  (tier uint)
  (min-referrals uint)
  (referrer-bonus-bps uint)
  (referee-bonus-bps uint)
)`}</code></pre>
      <p>Update tier requirements and bonus percentages.</p>

      <h3>deactivate-referral-code</h3>
      <pre><code>{`(deactivate-referral-code (code (string-ascii 20)))`}</code></pre>
      <p>Deactivate a referral code (for policy violations).</p>

      <h2>Read-Only Functions</h2>

      <h3>get-referral-code-info</h3>
      <pre><code>{`(get-referral-code-info (code (string-ascii 20)))`}</code></pre>
      <p>Returns referral code details including owner and tier.</p>

      <h3>get-user-referral-info</h3>
      <pre><code>{`(get-user-referral-info (user principal))`}</code></pre>
      <p>Returns user's referral information including referrer and stats.</p>

      <h3>get-referral-reward</h3>
      <pre><code>{`(get-referral-reward (referrer principal) (referee principal))`}</code></pre>
      <p>Returns reward details for a specific referrer-referee pair.</p>

      <h3>get-tier-config</h3>
      <pre><code>{`(get-tier-config (tier uint))`}</code></pre>
      <p>Returns configuration for a specific tier.</p>

      <h3>calculate-tier</h3>
      <pre><code>{`(calculate-tier (total-referrals uint))`}</code></pre>
      <p>Calculate tier based on total referrals.</p>

      <h3>calculate-referral-rewards</h3>
      <pre><code>{`(calculate-referral-rewards (referrer-tier uint) (activity-amount uint))`}</code></pre>
      <p>Calculate rewards for both referrer and referee based on tier and activity.</p>

      <h3>get-referral-stats</h3>
      <pre><code>{`(get-referral-stats (user principal))`}</code></pre>
      <p>Returns comprehensive referral statistics including tier name.</p>

      <h2>Data Structures</h2>

      <h3>Referral Code</h3>
      <pre><code>{`{
  owner: principal,               // Code owner
  created-at: uint,               // Block when created
  active: bool,                   // Is active
  tier: uint                      // Current tier (1-4)
}`}</code></pre>

      <h3>User Referrals</h3>
      <pre><code>{`{
  referrer: optional,             // Who referred this user
  referral-code: string-ascii,    // User's own code
  referred-at: uint,              // When referred
  total-referrals: uint,          // Total users referred
  active-referrals: uint,         // Active referrals
  total-earned: uint,             // Total rewards earned
  tier: uint                      // Current tier (1-4)
}`}</code></pre>

      <h3>Referral Rewards</h3>
      <pre><code>{`{
  referrer-reward: uint,          // Reward for referrer
  referee-reward: uint,           // Reward for referee
  claimed-by-referrer: bool,      // Has referrer claimed
  claimed-by-referee: bool,       // Has referee claimed
  created-at: uint                // Block when created
}`}</code></pre>

      <h2>Error Codes</h2>
      <ul>
        <li>u1000: Owner only</li>
        <li>u1001: Not found</li>
        <li>u1002: Already referred (can't use code twice)</li>
        <li>u1003: Self-referral not allowed</li>
        <li>u1004: Invalid code (too short or inactive)</li>
        <li>u1005: Code already exists</li>
        <li>u1006: Insufficient activity (below threshold)</li>
      </ul>

      <h2>Usage Examples</h2>

      <h3>Create Referral Code</h3>
      <pre><code>{`// Create a custom referral code
(contract-call? .referral-system create-referral-code "ALICE2024")`}</code></pre>

      <h3>Use Referral Code</h3>
      <pre><code>{`// New user uses referral code
(contract-call? .referral-system use-referral-code "ALICE2024")`}</code></pre>

      <h3>Check Referral Stats</h3>
      <pre><code>{`// Check your referral statistics
(contract-call? .referral-system get-referral-stats tx-sender)`}</code></pre>

      <h3>Claim Rewards</h3>
      <pre><code>{`// Claim rewards from a referee
(contract-call? .referral-system claim-referral-rewards
  'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG
)`}</code></pre>

      <h2>Reward Calculation</h2>

      <h3>Formula</h3>
      <pre><code>{`referrer-reward = base-bonus + (activity-amount * tier-bonus-bps / 10000)
referee-reward = base-bonus + (activity-amount * tier-bonus-bps / 10000)`}</code></pre>

      <h3>Example (Gold Tier)</h3>
      <p>Referee spends 100 SADS:</p>
      <ul>
        <li>Base bonus: 5 SADS</li>
        <li>Activity bonus: 100 * 10% = 10 SADS</li>
        <li>Referrer gets: 5 + 10 = 15 SADS</li>
        <li>Referee gets: 5 + 5 = 10 SADS (5% of activity)</li>
      </ul>

      <h2>Tier Progression</h2>

      <h3>Path to Platinum</h3>
      <ol>
        <li>Start: Bronze tier (0 referrals)</li>
        <li>Refer 10 users: Upgrade to Silver</li>
        <li>Refer 50 users: Upgrade to Gold</li>
        <li>Refer 100 users: Upgrade to Platinum</li>
      </ol>

      <h3>Benefits of Higher Tiers</h3>
      <ul>
        <li>Higher percentage bonuses</li>
        <li>More rewards per referee</li>
        <li>Increased platform reputation</li>
        <li>Potential for exclusive features</li>
      </ul>

      <h2>Activity Tracking</h2>
      <p>Referral rewards are triggered when referees:</p>
      <ul>
        <li>Create campaigns (advertiser activity)</li>
        <li>Stake tokens</li>
        <li>Register as publisher/advertiser</li>
        <li>Spend on platform services</li>
      </ul>
      <p>Minimum threshold: 10 SADS per activity</p>

      <h2>Referral Code Best Practices</h2>

      <h3>Good Codes</h3>
      <ul>
        <li>Short and memorable: "ALICE2024"</li>
        <li>Personal brand: "CRYPTOBOB"</li>
        <li>Descriptive: "ADPRO"</li>
      </ul>

      <h3>Avoid</h3>
      <ul>
        <li>Too short: "ABC" (min 4 chars)</li>
        <li>Confusing: "l1I1O0" (hard to read)</li>
        <li>Generic: "CODE123"</li>
      </ul>

      <h2>Marketing Your Referral Code</h2>
      <ul>
        <li>Share on social media</li>
        <li>Include in email signatures</li>
        <li>Add to blog posts and videos</li>
        <li>Create tutorial content</li>
        <li>Offer additional incentives</li>
      </ul>

      <h2>Security Considerations</h2>
      <ul>
        <li>One referral code per address</li>
        <li>Can't refer yourself</li>
        <li>Can only be referred once</li>
        <li>Activity threshold prevents spam</li>
        <li>Codes can be deactivated for abuse</li>
      </ul>

      <h2>Best Practices</h2>
      <ul>
        <li>Create your code early</li>
        <li>Share code with relevant audiences</li>
        <li>Track your referral performance</li>
        <li>Claim rewards regularly</li>
        <li>Help referees succeed on the platform</li>
        <li>Aim for quality over quantity</li>
      </ul>

      <h2>Referral Program Benefits</h2>

      <h3>For Referrers</h3>
      <ul>
        <li>Passive income from referee activity</li>
        <li>Tier upgrades with more referrals</li>
        <li>Build network on platform</li>
      </ul>

      <h3>For Referees</h3>
      <ul>
        <li>Welcome bonus when joining</li>
        <li>Activity bonuses on spending</li>
        <li>Guided onboarding from referrer</li>
      </ul>

      <h3>For Platform</h3>
      <ul>
        <li>Organic user growth</li>
        <li>Higher quality users (referred)</li>
        <li>Community building</li>
        <li>Reduced marketing costs</li>
      </ul>
    </div>
  );
}
