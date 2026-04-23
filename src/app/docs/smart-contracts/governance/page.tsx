export default function GovernanceContractPage() {
  return (
    <div className="prose">
      <h1>Governance Contract</h1>
      <p className="lead">
        Token-weighted voting system for protocol upgrades and parameter changes. SADS holders can create and vote on proposals.
      </p>

      <h2>Overview</h2>
      <p>
        The Governance contract enables decentralized decision-making for the StackAds platform. Token holders can 
        propose changes and vote on them, with voting power proportional to token holdings.
      </p>

      <h2>Key Features</h2>
      <ul>
        <li>Token-weighted voting - 1 SADS = 1 vote</li>
        <li>Proposal threshold - Minimum tokens required to create proposals</li>
        <li>Quorum requirement - Minimum votes needed for proposal to pass</li>
        <li>Voting delay - Time before voting starts</li>
        <li>Voting period - Duration of voting</li>
      </ul>

      <h2>Proposal States</h2>
      <ul>
        <li>Pending (1): Proposal created, voting hasn't started</li>
        <li>Active (2): Voting is open</li>
        <li>Defeated (3): Proposal failed (didn't meet quorum or more against votes)</li>
        <li>Succeeded (4): Proposal passed (met quorum and more for votes)</li>
        <li>Executed (5): Proposal has been executed</li>
        <li>Cancelled (6): Proposal cancelled by proposer</li>
      </ul>

      <h2>Default Parameters</h2>
      <ul>
        <li>Voting Period: 1,440 blocks (~10 days)</li>
        <li>Voting Delay: 144 blocks (~1 day)</li>
        <li>Proposal Threshold: 1,000 SADS</li>
        <li>Quorum: 10,000 SADS</li>
      </ul>

      <h2>Public Functions</h2>

      <h3>propose</h3>
      <pre><code>{`(propose (description (string-utf8 256)) (metadata-uri (string-utf8 256)))`}</code></pre>
      <p>Create a new proposal. Requires holding at least the proposal threshold amount of SADS.</p>
      <ul>
        <li>description: Short description of the proposal</li>
        <li>metadata-uri: IPFS/HTTP URI with full proposal details</li>
      </ul>

      <h3>cast-vote</h3>
      <pre><code>{`(cast-vote (proposal-id uint) (support uint))`}</code></pre>
      <p>Vote on an active proposal. Voting power equals token balance.</p>
      <ul>
        <li>proposal-id: ID of the proposal to vote on</li>
        <li>support: 0 = against, 1 = for, 2 = abstain</li>
      </ul>

      <h3>execute-proposal</h3>
      <pre><code>{`(execute-proposal (proposal-id uint))`}</code></pre>
      <p>Execute a succeeded proposal. Can be called by anyone once proposal has passed.</p>

      <h3>cancel-proposal</h3>
      <pre><code>{`(cancel-proposal (proposal-id uint))`}</code></pre>
      <p>Cancel a proposal. Only callable by the proposer before voting ends.</p>

      <h2>Admin Functions</h2>

      <h3>set-voting-period</h3>
      <pre><code>{`(set-voting-period (new-period uint))`}</code></pre>
      <p>Update the voting period duration in blocks.</p>

      <h3>set-voting-delay</h3>
      <pre><code>{`(set-voting-delay (new-delay uint))`}</code></pre>
      <p>Update the delay before voting starts.</p>

      <h3>set-proposal-threshold</h3>
      <pre><code>{`(set-proposal-threshold (new-threshold uint))`}</code></pre>
      <p>Update minimum tokens required to create proposals.</p>

      <h3>set-quorum-votes</h3>
      <pre><code>{`(set-quorum-votes (new-quorum uint))`}</code></pre>
      <p>Update minimum votes required for proposal to pass.</p>

      <h2>Read-Only Functions</h2>

      <h3>get-proposal</h3>
      <pre><code>{`(get-proposal (proposal-id uint))`}</code></pre>
      <p>Returns full proposal details including vote counts and status.</p>

      <h3>get-proposal-state</h3>
      <pre><code>{`(get-proposal-state (proposal-id uint))`}</code></pre>
      <p>Returns current state of a proposal (pending, active, defeated, etc.).</p>

      <h3>get-vote</h3>
      <pre><code>{`(get-vote (proposal-id uint) (voter principal))`}</code></pre>
      <p>Returns how a specific address voted on a proposal.</p>

      <h3>has-voted</h3>
      <pre><code>{`(has-voted (proposal-id uint) (voter principal))`}</code></pre>
      <p>Returns true if address has voted on the proposal.</p>

      <h3>get-voting-power</h3>
      <pre><code>{`(get-voting-power (voter principal))`}</code></pre>
      <p>Returns voting power (token balance) for an address.</p>

      <h3>get-proposal-votes</h3>
      <pre><code>{`(get-proposal-votes (proposal-id uint))`}</code></pre>
      <p>Returns vote counts (for, against, abstain) for a proposal.</p>

      <h2>Proposal Data Structure</h2>
      <pre><code>{`{
  proposer: principal,           // Address that created proposal
  description: string-utf8,       // Short description
  for-votes: uint,                // Total votes in favor
  against-votes: uint,            // Total votes against
  abstain-votes: uint,            // Total abstain votes
  start-block: uint,              // When voting starts
  end-block: uint,                // When voting ends
  state: uint,                    // Current state (1-6)
  executed: bool,                 // Whether executed
  metadata-uri: string-utf8       // Full proposal details
}`}</code></pre>

      <h2>Error Codes</h2>
      <ul>
        <li>u500: Owner only</li>
        <li>u501: Proposal not found</li>
        <li>u502: Already voted</li>
        <li>u503: Voting closed</li>
        <li>u504: Voting still active</li>
        <li>u505: Insufficient votes (below proposal threshold)</li>
        <li>u506: Already executed</li>
        <li>u507: Execution failed</li>
        <li>u508: Invalid parameters</li>
      </ul>

      <h2>Usage Examples</h2>

      <h3>Create Proposal</h3>
      <pre><code>{`// Create a proposal to change platform fee
(contract-call? .governance propose
  "Reduce platform fee to 2%"
  "ipfs://QmX...proposal-details"
)`}</code></pre>

      <h3>Vote on Proposal</h3>
      <pre><code>{`// Vote in favor of proposal #1
(contract-call? .governance cast-vote u1 u1)

// Vote against proposal #1
(contract-call? .governance cast-vote u1 u0)

// Abstain from proposal #1
(contract-call? .governance cast-vote u1 u2)`}</code></pre>

      <h3>Check Proposal Status</h3>
      <pre><code>{`// Get proposal state
(contract-call? .governance get-proposal-state u1)

// Get vote counts
(contract-call? .governance get-proposal-votes u1)`}</code></pre>

      <h3>Execute Passed Proposal</h3>
      <pre><code>{`// Execute proposal #1 after it passes
(contract-call? .governance execute-proposal u1)`}</code></pre>

      <h2>Proposal Lifecycle</h2>
      <ol>
        <li>User with sufficient tokens creates proposal</li>
        <li>Proposal enters pending state (voting delay)</li>
        <li>After delay, proposal becomes active</li>
        <li>Token holders vote during voting period</li>
        <li>After voting period ends:
          <ul>
            <li>If quorum met and more for votes: Succeeded</li>
            <li>Otherwise: Defeated</li>
          </ul>
        </li>
        <li>Succeeded proposals can be executed</li>
        <li>Execution implements the proposed changes</li>
      </ol>

      <h2>Voting Power</h2>
      <p>
        Voting power is determined by SADS token balance at the time of voting. Each token equals one vote.
        Users can vote once per proposal with their full balance.
      </p>

      <h2>Quorum Calculation</h2>
      <p>For a proposal to pass, it must:</p>
      <ul>
        <li>Receive at least the quorum amount of for votes</li>
        <li>Have more for votes than against votes</li>
      </ul>

      <h2>Security Considerations</h2>
      <ul>
        <li>Proposal threshold prevents spam proposals</li>
        <li>Voting delay allows time for community review</li>
        <li>Quorum requirement ensures sufficient participation</li>
        <li>One vote per address prevents double voting</li>
        <li>Proposers can cancel before voting ends</li>
      </ul>

      <h2>Best Practices</h2>
      <ul>
        <li>Include detailed information in metadata URI</li>
        <li>Discuss proposals in community forums before creating</li>
        <li>Vote during the voting period</li>
        <li>Review proposal details before voting</li>
        <li>Execute passed proposals promptly</li>
      </ul>
    </div>
  );
}
