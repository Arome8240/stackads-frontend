export default function DisputeResolutionContractPage() {
  return (
    <div className="prose">
      <h1>Dispute Resolution Contract</h1>
      <p className="lead">
        Decentralized dispute resolution system for handling conflicts between advertisers and publishers with arbitrator voting.
      </p>

      <h2>Overview</h2>
      <p>
        The Dispute Resolution contract provides a fair mechanism for resolving conflicts. Disputes can be filed by 
        either party, evidence can be submitted, and trusted arbitrators vote on the outcome.
      </p>

      <h2>Key Features</h2>
      <ul>
        <li>Open dispute filing</li>
        <li>Evidence submission system</li>
        <li>Arbitrator voting mechanism</li>
        <li>Multiple resolution outcomes</li>
        <li>Appeal process</li>
      </ul>

      <h2>Dispute Status</h2>
      <ul>
        <li>Open (1): Dispute filed, awaiting arbitrator</li>
        <li>Under Review (2): Arbitrator assigned, reviewing evidence</li>
        <li>Resolved - Advertiser (3): Ruled in favor of advertiser</li>
        <li>Resolved - Publisher (4): Ruled in favor of publisher</li>
        <li>Resolved - Split (5): 50/50 split resolution</li>
        <li>Dismissed (6): Dispute dismissed</li>
      </ul>

      <h2>Dispute Types</h2>
      <ul>
        <li>Payment (1): Payment-related disputes</li>
        <li>Fraud (2): Fraud allegations</li>
        <li>Quality (3): Ad quality issues</li>
        <li>Contract (4): Contract violations</li>
      </ul>

      <h2>Public Functions</h2>

      <h3>create-dispute</h3>
      <pre><code>{`(create-dispute
  (campaign-id uint)
  (respondent principal)
  (dispute-type uint)
  (amount-disputed uint)
  (description (string-utf8 512))
)`}</code></pre>
      <p>File a new dispute. Can be called by campaign advertiser or registered publisher.</p>
      <ul>
        <li>respondent: The other party in the dispute</li>
        <li>dispute-type: 1-4 (see dispute types)</li>
        <li>amount-disputed: Amount in SADS being disputed</li>
        <li>description: Detailed explanation of the dispute</li>
      </ul>

      <h3>submit-evidence</h3>
      <pre><code>{`(submit-evidence
  (dispute-id uint)
  (evidence-uri (string-utf8 256))
  (evidence-hash (buff 32))
  (description (string-utf8 256))
)`}</code></pre>
      <p>Submit evidence for a dispute. Only callable by complainant or respondent.</p>
      <ul>
        <li>evidence-uri: IPFS/HTTP URI to evidence files</li>
        <li>evidence-hash: Hash of evidence for verification</li>
        <li>description: Brief description of evidence</li>
      </ul>

      <h3>assign-arbitrator</h3>
      <pre><code>{`(assign-arbitrator (dispute-id uint) (arbitrator principal))`}</code></pre>
      <p>Assign an arbitrator to a dispute. Only callable by contract owner.</p>

      <h3>vote-on-dispute</h3>
      <pre><code>{`(vote-on-dispute (dispute-id uint) (vote uint) (reasoning (string-utf8 256)))`}</code></pre>
      <p>Vote on a dispute resolution. Only callable by arbitrators.</p>
      <ul>
        <li>vote: 3=advertiser, 4=publisher, 5=split</li>
        <li>reasoning: Explanation for the vote</li>
      </ul>

      <h3>resolve-dispute</h3>
      <pre><code>{`(resolve-dispute
  (dispute-id uint)
  (resolution-status uint)
  (resolution-text (string-utf8 512))
)`}</code></pre>
      <p>Finalize dispute resolution. Only callable by contract owner.</p>
      <ul>
        <li>resolution-status: 3-6 (see dispute status)</li>
        <li>resolution-text: Final resolution explanation</li>
      </ul>

      <h3>appeal-resolution</h3>
      <pre><code>{`(appeal-resolution (dispute-id uint) (appeal-reason (string-utf8 512)))`}</code></pre>
      <p>Appeal a resolved dispute. Only callable by complainant or respondent.</p>

      <h2>Admin Functions</h2>

      <h3>add-arbitrator</h3>
      <pre><code>{`(add-arbitrator (arbitrator principal))`}</code></pre>
      <p>Add a trusted arbitrator to the platform.</p>

      <h3>remove-arbitrator</h3>
      <pre><code>{`(remove-arbitrator (arbitrator principal))`}</code></pre>
      <p>Remove an arbitrator from the platform.</p>

      <h3>update-arbitrator-reputation</h3>
      <pre><code>{`(update-arbitrator-reputation (arbitrator principal) (new-reputation uint))`}</code></pre>
      <p>Update an arbitrator's reputation score (0-1000).</p>

      <h2>Read-Only Functions</h2>

      <h3>get-dispute</h3>
      <pre><code>{`(get-dispute (dispute-id uint))`}</code></pre>
      <p>Returns full dispute details.</p>

      <h3>get-evidence</h3>
      <pre><code>{`(get-evidence (dispute-id uint) (evidence-id uint))`}</code></pre>
      <p>Returns specific evidence details.</p>

      <h3>get-evidence-count</h3>
      <pre><code>{`(get-evidence-count (dispute-id uint))`}</code></pre>
      <p>Returns number of evidence submissions for a dispute.</p>

      <h3>get-arbitrator-vote</h3>
      <pre><code>{`(get-arbitrator-vote (dispute-id uint) (arbitrator principal))`}</code></pre>
      <p>Returns how an arbitrator voted on a dispute.</p>

      <h3>is-arbitrator</h3>
      <pre><code>{`(is-arbitrator (who principal))`}</code></pre>
      <p>Returns true if address is a trusted arbitrator.</p>

      <h3>get-arbitrator-stats</h3>
      <pre><code>{`(get-arbitrator-stats (arbitrator principal))`}</code></pre>
      <p>Returns arbitrator's case statistics and reputation.</p>

      <h3>get-dispute-summary</h3>
      <pre><code>{`(get-dispute-summary (dispute-id uint))`}</code></pre>
      <p>Returns summary including type, amount, status, evidence count, and age.</p>

      <h2>Data Structures</h2>

      <h3>Dispute</h3>
      <pre><code>{`{
  campaign-id: uint,              // Related campaign
  complainant: principal,         // Party filing dispute
  respondent: principal,          // Other party
  dispute-type: uint,             // 1-4 (see types)
  amount-disputed: uint,          // Amount in SADS
  description: string-utf8,       // Dispute details
  status: uint,                   // 1-6 (see status)
  created-at: uint,               // Block when created
  resolved-at: uint,              // Block when resolved
  resolution: optional,           // Resolution text
  arbitrator: optional            // Assigned arbitrator
}`}</code></pre>

      <h3>Evidence</h3>
      <pre><code>{`{
  submitted-by: principal,        // Who submitted
  evidence-uri: string-utf8,      // URI to evidence
  evidence-hash: buff,            // Hash for verification
  submitted-at: uint,             // Block when submitted
  description: string-utf8        // Evidence description
}`}</code></pre>

      <h3>Arbitrator Stats</h3>
      <pre><code>{`{
  cases-handled: uint,            // Total cases assigned
  cases-resolved: uint,           // Cases resolved
  reputation: uint                // Reputation (0-1000)
}`}</code></pre>

      <h2>Error Codes</h2>
      <ul>
        <li>u900: Owner only</li>
        <li>u901: Dispute not found</li>
        <li>u902: Unauthorized (not party to dispute)</li>
        <li>u903: Invalid status</li>
        <li>u904: Already resolved</li>
        <li>u905: Invalid evidence</li>
      </ul>

      <h2>Usage Examples</h2>

      <h3>File a Dispute</h3>
      <pre><code>{`// Publisher disputes unpaid earnings
(contract-call? .dispute-resolution create-dispute
  u1                              // Campaign ID
  'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG  // Advertiser
  u1                              // Payment dispute
  u50000000                       // 50 SADS disputed
  "Campaign ended but earnings not paid after 7 days"
)`}</code></pre>

      <h3>Submit Evidence</h3>
      <pre><code>{`// Submit proof of ad delivery
(contract-call? .dispute-resolution submit-evidence
  u1                              // Dispute ID
  "ipfs://QmX...proof"            // Evidence URI
  0x1234...                       // Evidence hash
  "Screenshots showing ad impressions and clicks"
)`}</code></pre>

      <h3>Arbitrator Votes</h3>
      <pre><code>{`// Arbitrator votes in favor of publisher
(contract-call? .dispute-resolution vote-on-dispute
  u1                              // Dispute ID
  u4                              // Vote for publisher
  "Evidence clearly shows ads were delivered as agreed"
)`}</code></pre>

      <h3>Resolve Dispute</h3>
      <pre><code>{`// Owner finalizes resolution
(contract-call? .dispute-resolution resolve-dispute
  u1                              // Dispute ID
  u4                              // Resolved - Publisher wins
  "Publisher provided sufficient evidence of ad delivery. Advertiser must pay disputed amount."
)`}</code></pre>

      <h2>Dispute Resolution Process</h2>
      <ol>
        <li>Party files dispute with description and amount</li>
        <li>Both parties submit evidence</li>
        <li>Contract owner assigns arbitrator</li>
        <li>Arbitrator reviews evidence and votes</li>
        <li>Contract owner finalizes resolution</li>
        <li>Funds are distributed based on outcome</li>
        <li>Parties can appeal if needed</li>
      </ol>

      <h2>Resolution Outcomes</h2>

      <h3>Advertiser Wins (3)</h3>
      <ul>
        <li>Disputed amount refunded to advertiser</li>
        <li>Publisher may face reputation penalty</li>
      </ul>

      <h3>Publisher Wins (4)</h3>
      <ul>
        <li>Disputed amount paid to publisher</li>
        <li>Advertiser may face reputation penalty</li>
      </ul>

      <h3>Split Resolution (5)</h3>
      <ul>
        <li>Amount split 50/50 between parties</li>
        <li>Used when both parties have valid points</li>
      </ul>

      <h3>Dismissed (6)</h3>
      <ul>
        <li>Dispute found to be invalid or frivolous</li>
        <li>No funds transferred</li>
      </ul>

      <h2>Arbitrator Selection</h2>
      <p>Arbitrators should be:</p>
      <ul>
        <li>Experienced in advertising industry</li>
        <li>Neutral and unbiased</li>
        <li>Available to review cases promptly</li>
        <li>Familiar with platform policies</li>
      </ul>

      <h2>Evidence Guidelines</h2>

      <h3>Strong Evidence</h3>
      <ul>
        <li>Screenshots with timestamps</li>
        <li>Server logs and analytics data</li>
        <li>Email/message correspondence</li>
        <li>Third-party verification reports</li>
      </ul>

      <h3>Weak Evidence</h3>
      <ul>
        <li>Unverified claims</li>
        <li>Easily manipulated data</li>
        <li>Hearsay or second-hand information</li>
      </ul>

      <h2>Appeal Process</h2>
      <p>Appeals are granted when:</p>
      <ul>
        <li>New evidence becomes available</li>
        <li>Procedural errors occurred</li>
        <li>Resolution appears unjust</li>
      </ul>
      <p>Appeals reset dispute to "Under Review" status for re-evaluation.</p>

      <h2>Security Considerations</h2>
      <ul>
        <li>Only parties involved can submit evidence</li>
        <li>Only arbitrators can vote</li>
        <li>Only owner can assign arbitrators and finalize</li>
        <li>Evidence hashes prevent tampering</li>
        <li>Appeals provide checks and balances</li>
      </ul>

      <h2>Best Practices</h2>
      <ul>
        <li>File disputes promptly (within 30 days)</li>
        <li>Provide clear, detailed descriptions</li>
        <li>Submit all relevant evidence</li>
        <li>Respond to arbitrator questions quickly</li>
        <li>Accept fair resolutions gracefully</li>
        <li>Use appeals sparingly and only when justified</li>
      </ul>
    </div>
  );
}
