export default function VestingContractPage() {
  return (
    <div className="prose">
      <h1>Vesting Contract</h1>
      <p className="lead">
        Token vesting schedules for team members, advisors, and investors. Supports cliff periods, linear vesting, and revocable schedules.
      </p>

      <h2>Overview</h2>
      <p>
        The Vesting contract manages time-locked token distributions. Tokens are released gradually over a specified 
        period, with optional cliff periods and revocation capabilities for certain schedules.
      </p>

      <h2>Key Features</h2>
      <ul>
        <li>Linear vesting - Tokens unlock proportionally over time</li>
        <li>Cliff period - Initial waiting period before any tokens vest</li>
        <li>Revocable schedules - Can be cancelled by contract owner</li>
        <li>Flexible release - Beneficiaries can claim vested tokens anytime</li>
      </ul>

      <h2>Public Functions</h2>

      <h3>create-vesting-schedule</h3>
      <pre><code>{`(create-vesting-schedule
  (beneficiary principal)
  (total-amount uint)
  (cliff-duration uint)
  (vesting-duration uint)
  (revocable bool)
)`}</code></pre>
      <p>Create a new vesting schedule. Only callable by contract owner.</p>
      <ul>
        <li>beneficiary: Address that will receive vested tokens</li>
        <li>total-amount: Total tokens to vest</li>
        <li>cliff-duration: Blocks until cliff (no tokens vest before this)</li>
        <li>vesting-duration: Total vesting period in blocks</li>
        <li>revocable: Whether schedule can be revoked</li>
      </ul>

      <h3>release</h3>
      <pre><code>{`(release)`}</code></pre>
      <p>Claim vested tokens. Callable by beneficiary to release their vested tokens.</p>

      <h3>release-for</h3>
      <pre><code>{`(release-for (beneficiary principal))`}</code></pre>
      <p>Release vested tokens on behalf of a beneficiary. Can be called by anyone.</p>

      <h3>revoke</h3>
      <pre><code>{`(revoke (beneficiary principal))`}</code></pre>
      <p>Revoke a vesting schedule. Only callable by contract owner for revocable schedules.</p>
      <ul>
        <li>Releases any already vested tokens to beneficiary</li>
        <li>Returns unvested tokens to contract owner</li>
        <li>Marks schedule as revoked</li>
      </ul>

      <h2>Admin Functions</h2>

      <h3>update-beneficiary</h3>
      <pre><code>{`(update-beneficiary (old-beneficiary principal) (new-beneficiary principal))`}</code></pre>
      <p>Transfer a vesting schedule to a new beneficiary. Only callable by contract owner.</p>

      <h2>Read-Only Functions</h2>

      <h3>get-vesting-schedule</h3>
      <pre><code>{`(get-vesting-schedule (beneficiary principal))`}</code></pre>
      <p>Returns full vesting schedule details for a beneficiary.</p>

      <h3>has-schedule</h3>
      <pre><code>{`(has-schedule (beneficiary principal))`}</code></pre>
      <p>Returns true if address has a vesting schedule.</p>

      <h3>compute-releasable-amount</h3>
      <pre><code>{`(compute-releasable-amount (beneficiary principal))`}</code></pre>
      <p>Returns amount of tokens that can be released now.</p>

      <h3>get-vested-amount</h3>
      <pre><code>{`(get-vested-amount (beneficiary principal))`}</code></pre>
      <p>Returns total amount vested so far (including already released).</p>

      <h3>get-withdrawable-amount</h3>
      <pre><code>{`(get-withdrawable-amount (beneficiary principal))`}</code></pre>
      <p>Returns amount available to withdraw (vested but not yet released).</p>

      <h3>get-schedule-info</h3>
      <pre><code>{`(get-schedule-info (beneficiary principal))`}</code></pre>
      <p>Returns comprehensive schedule information including all amounts and parameters.</p>

      <h2>Vesting Schedule Structure</h2>
      <pre><code>{`{
  total-amount: uint,             // Total tokens to vest
  released-amount: uint,          // Tokens already released
  start-block: uint,              // When vesting started
  cliff-duration: uint,           // Blocks until cliff
  vesting-duration: uint,         // Total vesting period
  revocable: bool,                // Can be revoked
  revoked: bool,                  // Has been revoked
  revoked-at: uint                // Block when revoked
}`}</code></pre>

      <h2>Error Codes</h2>
      <ul>
        <li>u600: Owner only</li>
        <li>u601: Schedule not found</li>
        <li>u602: Schedule already exists for beneficiary</li>
        <li>u603: No tokens due (nothing to release)</li>
        <li>u604: Invalid parameters</li>
        <li>u605: Schedule not revocable</li>
        <li>u606: Already revoked</li>
      </ul>

      <h2>Usage Examples</h2>

      <h3>Create Team Member Vesting</h3>
      <pre><code>{`// 1M SADS vesting over 4 years with 1 year cliff
(contract-call? .vesting create-vesting-schedule
  'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM  // Team member
  u1000000000000                                 // 1M SADS
  u52560                                         // 1 year cliff (~365 days)
  u210240                                        // 4 years total (~1460 days)
  true                                           // Revocable
)`}</code></pre>

      <h3>Create Investor Vesting</h3>
      <pre><code>{`// 500K SADS vesting over 2 years, no cliff
(contract-call? .vesting create-vesting-schedule
  'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG  // Investor
  u500000000000                                 // 500K SADS
  u0                                            // No cliff
  u105120                                       // 2 years (~730 days)
  false                                         // Not revocable
)`}</code></pre>

      <h3>Check Vested Amount</h3>
      <pre><code>{`// Check how much has vested
(contract-call? .vesting get-vested-amount
  'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
)

// Check how much can be released
(contract-call? .vesting compute-releasable-amount
  'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
)`}</code></pre>

      <h3>Release Vested Tokens</h3>
      <pre><code>{`// Beneficiary claims their vested tokens
(contract-call? .vesting release)`}</code></pre>

      <h3>Revoke Schedule</h3>
      <pre><code>{`// Owner revokes a team member's vesting
(contract-call? .vesting revoke
  'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
)`}</code></pre>

      <h2>Vesting Calculation</h2>
      <p>Tokens vest linearly over the vesting duration:</p>
      <pre><code>{`vested = (total-amount * blocks-since-start) / vesting-duration`}</code></pre>

      <h3>Example Timeline</h3>
      <p>For 1,000 SADS vesting over 1,000 blocks with 100 block cliff:</p>
      <ul>
        <li>Block 0-99: 0 SADS vested (cliff period)</li>
        <li>Block 100: 100 SADS vested</li>
        <li>Block 500: 500 SADS vested</li>
        <li>Block 1000+: 1,000 SADS fully vested</li>
      </ul>

      <h2>Cliff Period</h2>
      <p>
        The cliff is a waiting period before any tokens vest. This is common for team members to ensure commitment.
        After the cliff, tokens vest linearly from the start date (not from the cliff date).
      </p>

      <h3>Example</h3>
      <ul>
        <li>Total: 1,000 SADS</li>
        <li>Cliff: 365 days</li>
        <li>Duration: 1,460 days (4 years)</li>
      </ul>
      <p>After 1 year (cliff), 250 SADS are immediately available (1 year / 4 years * 1,000).</p>

      <h2>Revocation</h2>
      <p>When a revocable schedule is revoked:</p>
      <ol>
        <li>Calculate vested amount up to revocation time</li>
        <li>Release vested tokens to beneficiary</li>
        <li>Return unvested tokens to contract owner</li>
        <li>Mark schedule as revoked</li>
        <li>No further vesting occurs</li>
      </ol>

      <h2>Security Considerations</h2>
      <ul>
        <li>Only contract owner can create schedules</li>
        <li>Only contract owner can revoke (if revocable)</li>
        <li>Beneficiaries can release anytime after vesting</li>
        <li>One schedule per beneficiary</li>
        <li>Revocation releases vested tokens to beneficiary</li>
      </ul>

      <h2>Best Practices</h2>
      <ul>
        <li>Use cliff periods for team members (typically 1 year)</li>
        <li>Make team schedules revocable, investor schedules non-revocable</li>
        <li>Standard vesting: 4 years with 1 year cliff</li>
        <li>Release tokens regularly to avoid large gas costs</li>
        <li>Document vesting terms in employment/investment agreements</li>
      </ul>

      <h2>Common Vesting Schedules</h2>

      <h3>Team Members</h3>
      <ul>
        <li>Duration: 4 years</li>
        <li>Cliff: 1 year</li>
        <li>Revocable: Yes</li>
      </ul>

      <h3>Advisors</h3>
      <ul>
        <li>Duration: 2 years</li>
        <li>Cliff: 6 months</li>
        <li>Revocable: Yes</li>
      </ul>

      <h3>Investors</h3>
      <ul>
        <li>Duration: 1-2 years</li>
        <li>Cliff: 0-6 months</li>
        <li>Revocable: No</li>
      </ul>
    </div>
  );
}
