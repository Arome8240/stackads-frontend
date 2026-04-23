export default function VerificationContractPage() {
  return (
    <div className="prose">
      <h1>Ad Verification Contract</h1>
      <p className="lead">
        Fraud detection and ad quality verification system. Automatically scores ad events and flags suspicious activity.
      </p>

      <h2>Overview</h2>
      <p>
        The Ad Verification contract protects the platform from fraud by analyzing ad events, calculating fraud scores, 
        and enabling trusted verifiers to review flagged activity.
      </p>

      <h2>Key Features</h2>
      <ul>
        <li>Automated fraud scoring</li>
        <li>Trusted verifier system</li>
        <li>Fraud reporting mechanism</li>
        <li>Configurable thresholds</li>
        <li>Proof-of-delivery verification</li>
      </ul>

      <h2>Verification Status</h2>
      <ul>
        <li>Pending (1): Awaiting verification</li>
        <li>Verified (2): Approved by verifier</li>
        <li>Rejected (3): Rejected due to fraud</li>
        <li>Flagged (4): Requires manual review</li>
      </ul>

      <h2>Fraud Types</h2>
      <ul>
        <li>Click Fraud (1): Invalid or bot clicks</li>
        <li>Impression Fraud (2): Fake impressions</li>
        <li>Conversion Fraud (3): Fake conversions</li>
        <li>Bot Traffic (4): Automated bot activity</li>
      </ul>

      <h2>Default Thresholds</h2>
      <ul>
        <li>Fraud Threshold: 700 (triggers manual review)</li>
        <li>Auto-Reject Threshold: 900 (automatic rejection)</li>
      </ul>

      <h2>Public Functions</h2>

      <h3>submit-verification</h3>
      <pre><code>{`(submit-verification
  (campaign-id uint)
  (publisher principal)
  (impressions uint)
  (clicks uint)
  (conversions uint)
  (proof-hash (buff 32))
)`}</code></pre>
      <p>Submit ad data for verification. Only callable by contract owner (oracle).</p>
      <ul>
        <li>Calculates fraud score automatically</li>
        <li>Auto-rejects if score &gt; 900</li>
        <li>Flags for review if score &gt; 700</li>
        <li>proof-hash: Hash of delivery proof</li>
      </ul>

      <h3>verify-ad-data</h3>
      <pre><code>{`(verify-ad-data
  (campaign-id uint)
  (publisher principal)
  (timestamp uint)
  (approved bool)
)`}</code></pre>
      <p>Approve or reject flagged ad data. Only callable by trusted verifiers.</p>

      <h3>report-fraud</h3>
      <pre><code>{`(report-fraud
  (campaign-id uint)
  (publisher principal)
  (fraud-type uint)
  (severity uint)
  (description (string-utf8 256))
)`}</code></pre>
      <p>Report suspected fraud. Can be called by anyone.</p>
      <ul>
        <li>fraud-type: 1-4 (see fraud types)</li>
        <li>severity: 1-10 (10 = most severe)</li>
      </ul>

      <h3>resolve-fraud-report</h3>
      <pre><code>{`(resolve-fraud-report (report-id uint) (action-taken (string-utf8 256)))`}</code></pre>
      <p>Mark a fraud report as resolved. Only callable by contract owner.</p>

      <h2>Admin Functions</h2>

      <h3>add-trusted-verifier</h3>
      <pre><code>{`(add-trusted-verifier (verifier principal))`}</code></pre>
      <p>Add a trusted verifier who can approve/reject ad data.</p>

      <h3>remove-trusted-verifier</h3>
      <pre><code>{`(remove-trusted-verifier (verifier principal))`}</code></pre>
      <p>Remove a trusted verifier.</p>

      <h3>set-fraud-threshold</h3>
      <pre><code>{`(set-fraud-threshold (new-threshold uint))`}</code></pre>
      <p>Update the fraud score threshold for manual review (max 1000).</p>

      <h3>set-auto-reject-threshold</h3>
      <pre><code>{`(set-auto-reject-threshold (new-threshold uint))`}</code></pre>
      <p>Update the fraud score threshold for automatic rejection (max 1000).</p>

      <h2>Read-Only Functions</h2>

      <h3>get-verification</h3>
      <pre><code>{`(get-verification (campaign-id uint) (publisher principal) (timestamp uint))`}</code></pre>
      <p>Returns verification details for specific ad data.</p>

      <h3>get-fraud-report</h3>
      <pre><code>{`(get-fraud-report (report-id uint))`}</code></pre>
      <p>Returns fraud report details.</p>

      <h3>is-trusted-verifier</h3>
      <pre><code>{`(is-trusted-verifier (verifier principal))`}</code></pre>
      <p>Returns true if address is a trusted verifier.</p>

      <h3>calculate-fraud-score</h3>
      <pre><code>{`(calculate-fraud-score
  (impressions uint)
  (clicks uint)
  (conversions uint)
  (publisher-reputation uint)
)`}</code></pre>
      <p>Calculate fraud score for given metrics (0-1000+).</p>

      <h3>is-verification-approved</h3>
      <pre><code>{`(is-verification-approved (campaign-id uint) (publisher principal) (timestamp uint))`}</code></pre>
      <p>Returns true if verification was approved.</p>

      <h3>get-verification-status</h3>
      <pre><code>{`(get-verification-status (campaign-id uint) (publisher principal) (timestamp uint))`}</code></pre>
      <p>Returns current verification status (1-4).</p>

      <h2>Fraud Score Calculation</h2>
      <p>The fraud score is calculated based on multiple factors:</p>

      <h3>Suspicious CTR</h3>
      <ul>
        <li>CTR &gt; 10%: +200 points (very suspicious)</li>
        <li>Normal CTR: 0.5-5%</li>
      </ul>

      <h3>Suspicious Conversion Rate</h3>
      <ul>
        <li>CVR &gt; 50%: +200 points (very suspicious)</li>
        <li>Normal CVR: 1-10%</li>
      </ul>

      <h3>Low Publisher Reputation</h3>
      <ul>
        <li>Reputation &lt; 300: +300 points</li>
        <li>New publishers are higher risk</li>
      </ul>

      <h3>Perfect Ratios</h3>
      <ul>
        <li>Clicks divisible by 10: +100 points</li>
        <li>Suggests automated/bot traffic</li>
      </ul>

      <h3>Total Score</h3>
      <pre><code>{`fraud-score = suspicious-ctr + suspicious-cvr + low-reputation + perfect-ratio`}</code></pre>

      <h2>Data Structures</h2>

      <h3>Ad Verification</h3>
      <pre><code>{`{
  impressions: uint,              // Impressions reported
  clicks: uint,                   // Clicks reported
  conversions: uint,              // Conversions reported
  status: uint,                   // 1-4 (see status types)
  fraud-score: uint,              // 0-1000+ fraud score
  verified-by: optional,          // Verifier address
  verified-at: uint,              // Block when verified
  proof-hash: buff                // Delivery proof hash
}`}</code></pre>

      <h3>Fraud Report</h3>
      <pre><code>{`{
  campaign-id: uint,              // Campaign ID
  publisher: principal,           // Reported publisher
  fraud-type: uint,               // 1-4 (see fraud types)
  severity: uint,                 // 1-10
  description: string-utf8,       // Report details
  reported-by: principal,         // Reporter address
  reported-at: uint,              // Block when reported
  resolved: bool                  // Is resolved
}`}</code></pre>

      <h2>Error Codes</h2>
      <ul>
        <li>u800: Owner only</li>
        <li>u801: Verification not found</li>
        <li>u802: Already verified</li>
        <li>u803: Verification failed</li>
        <li>u804: Invalid proof</li>
      </ul>

      <h2>Usage Examples</h2>

      <h3>Submit for Verification</h3>
      <pre><code>{`// Oracle submits ad data for verification
(contract-call? .ad-verification submit-verification
  u1                              // Campaign ID
  'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
  u10000                          // 10,000 impressions
  u500                            // 500 clicks (5% CTR)
  u25                             // 25 conversions (5% CVR)
  0x1234...                       // Proof hash
)`}</code></pre>

      <h3>Verify Flagged Data</h3>
      <pre><code>{`// Trusted verifier approves ad data
(contract-call? .ad-verification verify-ad-data
  u1
  'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
  u12345                          // Timestamp
  true                            // Approved
)`}</code></pre>

      <h3>Report Fraud</h3>
      <pre><code>{`// Report suspected click fraud
(contract-call? .ad-verification report-fraud
  u1                              // Campaign ID
  'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
  u1                              // Click fraud
  u8                              // Severity 8/10
  "Suspicious click patterns detected"
)`}</code></pre>

      <h2>Fraud Detection Patterns</h2>

      <h3>Click Fraud Indicators</h3>
      <ul>
        <li>Abnormally high CTR (&gt;10%)</li>
        <li>Clicks from same IP addresses</li>
        <li>Clicks at regular intervals</li>
        <li>Clicks with no conversions</li>
      </ul>

      <h3>Impression Fraud Indicators</h3>
      <ul>
        <li>Impressions without page views</li>
        <li>Hidden or 1x1 pixel ads</li>
        <li>Auto-refreshing pages</li>
        <li>Bot user agents</li>
      </ul>

      <h3>Conversion Fraud Indicators</h3>
      <ul>
        <li>Abnormally high conversion rate (&gt;50%)</li>
        <li>Conversions without clicks</li>
        <li>Duplicate conversions</li>
        <li>Conversions from suspicious sources</li>
      </ul>

      <h2>Verification Workflow</h2>
      <ol>
        <li>Oracle submits ad data with proof hash</li>
        <li>Contract calculates fraud score</li>
        <li>If score &lt; 700: Auto-approve (pending)</li>
        <li>If score 700-900: Flag for manual review</li>
        <li>If score &gt; 900: Auto-reject</li>
        <li>Trusted verifier reviews flagged data</li>
        <li>Verifier approves or rejects</li>
        <li>Approved data is paid out to publisher</li>
      </ol>

      <h2>Security Considerations</h2>
      <ul>
        <li>Only oracle can submit verifications</li>
        <li>Only trusted verifiers can approve/reject</li>
        <li>Anyone can report fraud</li>
        <li>Proof hashes prevent data tampering</li>
        <li>Multiple fraud indicators increase accuracy</li>
      </ul>

      <h2>Best Practices</h2>
      <ul>
        <li>Monitor fraud scores regularly</li>
        <li>Investigate scores &gt; 500</li>
        <li>Add multiple trusted verifiers</li>
        <li>Review fraud reports promptly</li>
        <li>Adjust thresholds based on platform data</li>
        <li>Combine on-chain and off-chain verification</li>
      </ul>
    </div>
  );
}
