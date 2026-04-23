export default function RegistryContractPage() {
  return (
    <div className="prose">
      <h1>Ad Registry Contract</h1>
      <p className="lead">
        Manages publisher and advertiser registrations with staking requirements, reputation tracking, and performance metrics.
      </p>

      <h2>Overview</h2>
      <p>
        The Ad Registry contract handles onboarding and management of platform participants. Publishers and advertisers 
        must stake SADS tokens to register, ensuring commitment and enabling slashing for bad behavior.
      </p>

      <h2>Participant Types</h2>
      <ul>
        <li>Publisher (type 1): Websites/apps that display ads</li>
        <li>Advertiser (type 2): Brands/companies that create campaigns</li>
      </ul>

      <h2>Status Types</h2>
      <ul>
        <li>Unregistered (0): Not registered or has unregistered</li>
        <li>Active (1): Registered and in good standing</li>
        <li>Suspended (2): Temporarily suspended by admin</li>
        <li>Slashed (3): Penalized for violations</li>
      </ul>

      <h2>Stake Requirements</h2>
      <ul>
        <li>Publisher: 100 SADS (default)</li>
        <li>Advertiser: 500 SADS (default)</li>
      </ul>
      <p>Stake requirements can be updated by contract owner.</p>

      <h2>Public Functions</h2>

      <h3>register-publisher</h3>
      <pre><code>{`(register-publisher (metadata-uri (string-utf8 256)))`}</code></pre>
      <p>Register as a publisher. Requires staking the minimum amount of SADS tokens.</p>
      <ul>
        <li>metadata-uri: IPFS or HTTP URI containing publisher metadata (name, website, etc.)</li>
      </ul>

      <h3>register-advertiser</h3>
      <pre><code>{`(register-advertiser (metadata-uri (string-utf8 256)))`}</code></pre>
      <p>Register as an advertiser. Requires staking the minimum amount of SADS tokens.</p>
      <ul>
        <li>metadata-uri: IPFS or HTTP URI containing advertiser metadata (company name, etc.)</li>
      </ul>

      <h3>unregister</h3>
      <pre><code>{`(unregister)`}</code></pre>
      <p>Unregister from the platform and receive staked tokens back. Only available for active participants.</p>

      <h3>update-metadata</h3>
      <pre><code>{`(update-metadata (new-uri (string-utf8 256)))`}</code></pre>
      <p>Update participant metadata URI. Only available for active participants.</p>

      <h2>Admin Functions</h2>

      <h3>update-reputation</h3>
      <pre><code>{`(update-reputation (participant principal) (new-score uint))`}</code></pre>
      <p>Update a participant's reputation score (0-1000). Only callable by contract owner.</p>

      <h3>record-stats</h3>
      <pre><code>{`(record-stats (publisher principal) (impressions uint) (clicks uint))`}</code></pre>
      <p>Record ad performance statistics for a publisher. Only callable by contract owner.</p>

      <h3>suspend</h3>
      <pre><code>{`(suspend (participant principal) (reason (string-utf8 256)))`}</code></pre>
      <p>Suspend a participant. Only callable by contract owner.</p>

      <h3>reinstate</h3>
      <pre><code>{`(reinstate (participant principal))`}</code></pre>
      <p>Reinstate a suspended participant. Only callable by contract owner.</p>

      <h3>slash</h3>
      <pre><code>{`(slash (participant principal) (bps uint) (reason (string-utf8 256)))`}</code></pre>
      <p>Slash a percentage of participant's stake for violations. Only callable by contract owner.</p>
      <ul>
        <li>bps: Basis points to slash (e.g., 1000 = 10%)</li>
        <li>reason: Explanation for slashing</li>
      </ul>

      <h3>set-publisher-stake-required</h3>
      <pre><code>{`(set-publisher-stake-required (amount uint))`}</code></pre>
      <p>Update minimum stake required for publishers.</p>

      <h3>set-advertiser-stake-required</h3>
      <pre><code>{`(set-advertiser-stake-required (amount uint))`}</code></pre>
      <p>Update minimum stake required for advertisers.</p>

      <h2>Read-Only Functions</h2>

      <h3>get-participant</h3>
      <pre><code>{`(get-participant (who principal))`}</code></pre>
      <p>Returns participant information including type, status, stake, reputation, and statistics.</p>

      <h3>is-active-publisher</h3>
      <pre><code>{`(is-active-publisher (who principal))`}</code></pre>
      <p>Returns true if address is an active publisher.</p>

      <h3>is-active-advertiser</h3>
      <pre><code>{`(is-active-advertiser (who principal))`}</code></pre>
      <p>Returns true if address is an active advertiser.</p>

      <h3>get-publisher-count</h3>
      <pre><code>{`(get-publisher-count)`}</code></pre>
      <p>Returns total number of registered publishers.</p>

      <h3>get-advertiser-count</h3>
      <pre><code>{`(get-advertiser-count)`}</code></pre>
      <p>Returns total number of registered advertisers.</p>

      <h3>get-click-through-rate</h3>
      <pre><code>{`(get-click-through-rate (publisher principal))`}</code></pre>
      <p>Returns publisher's CTR in basis points (e.g., 500 = 5%).</p>

      <h2>Participant Data Structure</h2>
      <pre><code>{`{
  participant-type: uint,        // 1 = publisher, 2 = advertiser
  status: uint,                   // 0-3 (see status types)
  staked-amount: uint,            // Amount of SADS staked
  reputation-score: uint,         // 0-1000 (starts at 500)
  metadata-uri: string-utf8,      // IPFS/HTTP URI
  registered-at: uint,            // Block height of registration
  total-impressions: uint,        // Total ad impressions
  total-clicks: uint              // Total ad clicks
}`}</code></pre>

      <h2>Error Codes</h2>
      <ul>
        <li>u200: Owner only</li>
        <li>u201: Already registered</li>
        <li>u202: Not registered</li>
        <li>u203: Not active</li>
        <li>u204: Insufficient stake</li>
        <li>u205: Invalid reputation (must be 0-1000)</li>
      </ul>

      <h2>Usage Examples</h2>

      <h3>Register as Publisher</h3>
      <pre><code>{`// Register with metadata URI
(contract-call? .ad-registry register-publisher 
  "ipfs://QmX...abc"
)`}</code></pre>

      <h3>Check Publisher Status</h3>
      <pre><code>{`// Check if address is active publisher
(contract-call? .ad-registry is-active-publisher 
  'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
)`}</code></pre>

      <h3>Get Publisher Stats</h3>
      <pre><code>{`// Get full participant data
(contract-call? .ad-registry get-participant 
  'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
)`}</code></pre>

      <h2>Reputation System</h2>
      <p>
        Participants start with a reputation score of 500 (out of 1000). Reputation affects:
      </p>
      <ul>
        <li>Campaign eligibility</li>
        <li>Ad placement priority</li>
        <li>Reward multipliers</li>
      </ul>
      <p>
        Reputation increases with good performance (high CTR, no violations) and decreases with 
        poor performance or policy violations.
      </p>

      <h2>Security Considerations</h2>
      <ul>
        <li>Stake requirement prevents spam registrations</li>
        <li>Slashing mechanism deters bad behavior</li>
        <li>Admin functions restricted to contract owner</li>
        <li>Participants can only update their own metadata</li>
      </ul>
    </div>
  );
}
