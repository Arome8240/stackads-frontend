export default function TreasuryContractPage() {
  return (
    <div className="prose">
      <h1>Ad Treasury Contract</h1>
      <p className="lead">
        Manages campaign funding, ad event tracking, and publisher payouts. The financial engine of the StackAds platform.
      </p>

      <h2>Overview</h2>
      <p>
        The Ad Treasury contract handles all financial operations for advertising campaigns. Advertisers fund campaigns, 
        the contract tracks ad events (impressions and clicks), and publishers claim their earnings.
      </p>

      <h2>Key Features</h2>
      <ul>
        <li>Campaign creation and funding</li>
        <li>Real-time ad event tracking</li>
        <li>Automated publisher payouts</li>
        <li>Platform fee collection (2.5% default)</li>
        <li>Campaign pause/resume functionality</li>
      </ul>

      <h2>Campaign Status</h2>
      <ul>
        <li>Active (1): Campaign is running and serving ads</li>
        <li>Paused (2): Campaign temporarily stopped by advertiser</li>
        <li>Ended (3): Campaign completed or manually ended</li>
      </ul>

      <h2>Platform Fee</h2>
      <p>Default platform fee: 2.5% (250 basis points)</p>
      <p>Fee is charged on campaign budget and additional funding.</p>

      <h2>Public Functions</h2>

      <h3>create-campaign</h3>
      <pre><code>{`(create-campaign 
  (budget uint) 
  (cost-per-impression uint) 
  (cost-per-click uint) 
  (duration uint) 
  (metadata-uri (string-utf8 256))
)`}</code></pre>
      <p>Create a new advertising campaign. Requires active advertiser registration.</p>
      <ul>
        <li>budget: Total campaign budget in SADS</li>
        <li>cost-per-impression: Cost per ad impression</li>
        <li>cost-per-click: Cost per ad click</li>
        <li>duration: Campaign duration in blocks</li>
        <li>metadata-uri: IPFS/HTTP URI with campaign details</li>
      </ul>

      <h3>fund-campaign</h3>
      <pre><code>{`(fund-campaign (campaign-id uint) (additional-budget uint))`}</code></pre>
      <p>Add additional budget to an existing campaign.</p>

      <h3>record-ad-event</h3>
      <pre><code>{`(record-ad-event 
  (campaign-id uint) 
  (publisher principal) 
  (impressions uint) 
  (clicks uint)
)`}</code></pre>
      <p>Record ad impressions and clicks. Only callable by contract owner (oracle).</p>

      <h3>claim-earnings</h3>
      <pre><code>{`(claim-earnings (campaign-id uint))`}</code></pre>
      <p>Claim earned revenue from a campaign as a publisher.</p>

      <h3>pause-campaign</h3>
      <pre><code>{`(pause-campaign (campaign-id uint))`}</code></pre>
      <p>Pause an active campaign. Only callable by campaign advertiser.</p>

      <h3>resume-campaign</h3>
      <pre><code>{`(resume-campaign (campaign-id uint))`}</code></pre>
      <p>Resume a paused campaign. Only callable by campaign advertiser.</p>

      <h3>end-campaign</h3>
      <pre><code>{`(end-campaign (campaign-id uint))`}</code></pre>
      <p>End a campaign and refund unspent budget. Only callable by campaign advertiser.</p>

      <h2>Admin Functions</h2>

      <h3>set-platform-fee</h3>
      <pre><code>{`(set-platform-fee (new-fee-bps uint))`}</code></pre>
      <p>Update platform fee (max 10%). Only callable by contract owner.</p>

      <h3>withdraw-platform-fees</h3>
      <pre><code>{`(withdraw-platform-fees (amount uint))`}</code></pre>
      <p>Withdraw collected platform fees. Only callable by contract owner.</p>

      <h3>emergency-pause-campaign</h3>
      <pre><code>{`(emergency-pause-campaign (campaign-id uint))`}</code></pre>
      <p>Emergency pause for policy violations. Only callable by contract owner.</p>

      <h2>Read-Only Functions</h2>

      <h3>get-campaign</h3>
      <pre><code>{`(get-campaign (campaign-id uint))`}</code></pre>
      <p>Returns full campaign details.</p>

      <h3>get-publisher-earnings</h3>
      <pre><code>{`(get-publisher-earnings (campaign-id uint) (publisher principal))`}</code></pre>
      <p>Returns earnings data for a publisher on a specific campaign.</p>

      <h3>get-platform-fee-bps</h3>
      <pre><code>{`(get-platform-fee-bps)`}</code></pre>
      <p>Returns current platform fee in basis points.</p>

      <h3>calculate-platform-fee</h3>
      <pre><code>{`(calculate-platform-fee (amount uint))`}</code></pre>
      <p>Calculate platform fee for a given amount.</p>

      <h3>get-campaign-remaining-budget</h3>
      <pre><code>{`(get-campaign-remaining-budget (campaign-id uint))`}</code></pre>
      <p>Returns unspent budget for a campaign.</p>

      <h3>is-campaign-active</h3>
      <pre><code>{`(is-campaign-active (campaign-id uint))`}</code></pre>
      <p>Returns true if campaign is active and within duration.</p>

      <h2>Campaign Data Structure</h2>
      <pre><code>{`{
  advertiser: principal,          // Campaign owner
  budget: uint,                    // Total budget
  spent: uint,                     // Amount spent so far
  cost-per-impression: uint,       // Cost per impression
  cost-per-click: uint,            // Cost per click
  total-impressions: uint,         // Total impressions served
  total-clicks: uint,              // Total clicks received
  status: uint,                    // 1=active, 2=paused, 3=ended
  start-block: uint,               // Campaign start block
  end-block: uint,                 // Campaign end block
  metadata-uri: string-utf8        // Campaign metadata
}`}</code></pre>

      <h2>Publisher Earnings Structure</h2>
      <pre><code>{`{
  impressions: uint,               // Impressions served
  clicks: uint,                    // Clicks received
  earned: uint,                    // Total earned
  claimed: uint                    // Amount claimed
}`}</code></pre>

      <h2>Error Codes</h2>
      <ul>
        <li>u400: Owner only</li>
        <li>u401: Campaign not found</li>
        <li>u402: Insufficient budget</li>
        <li>u403: Campaign ended</li>
        <li>u404: Campaign paused</li>
        <li>u405: Unauthorized (not registered or not campaign owner)</li>
        <li>u406: Invalid amount</li>
        <li>u407: Already exists</li>
      </ul>

      <h2>Usage Examples</h2>

      <h3>Create Campaign</h3>
      <pre><code>{`// Create a campaign with 1000 SADS budget
(contract-call? .ad-treasury create-campaign
  u1000000000      ;; 1000 SADS budget
  u100             ;; 0.0001 SADS per impression
  u1000            ;; 0.001 SADS per click
  u1440            ;; 1440 blocks (~10 days)
  "ipfs://QmX...abc"
)`}</code></pre>

      <h3>Check Campaign Status</h3>
      <pre><code>{`// Get campaign details
(contract-call? .ad-treasury get-campaign u1)`}</code></pre>

      <h3>Claim Publisher Earnings</h3>
      <pre><code>{`// Claim earnings from campaign #1
(contract-call? .ad-treasury claim-earnings u1)`}</code></pre>

      <h2>Cost Calculation</h2>
      <p>For each ad event, the cost is calculated as:</p>
      <pre><code>{`total-cost = (impressions * cost-per-impression) + (clicks * cost-per-click)`}</code></pre>

      <h3>Example</h3>
      <ul>
        <li>1000 impressions at 0.0001 SADS = 0.1 SADS</li>
        <li>50 clicks at 0.001 SADS = 0.05 SADS</li>
        <li>Total cost = 0.15 SADS</li>
      </ul>

      <h2>Campaign Lifecycle</h2>
      <ol>
        <li>Advertiser creates campaign with budget</li>
        <li>Platform fee (2.5%) is charged upfront</li>
        <li>Campaign becomes active and serves ads</li>
        <li>Oracle records impressions and clicks</li>
        <li>Publishers earn revenue based on performance</li>
        <li>Publishers claim earnings anytime</li>
        <li>Campaign ends when duration expires or manually ended</li>
        <li>Unspent budget refunded to advertiser</li>
      </ol>

      <h2>Security Considerations</h2>
      <ul>
        <li>Only registered advertisers can create campaigns</li>
        <li>Only registered publishers can earn from campaigns</li>
        <li>Oracle (contract owner) records ad events to prevent fraud</li>
        <li>Budget checks prevent overspending</li>
        <li>Advertisers can pause/end campaigns anytime</li>
      </ul>

      <h2>Best Practices</h2>
      <ul>
        <li>Set realistic cost-per-click and cost-per-impression rates</li>
        <li>Monitor campaign performance regularly</li>
        <li>Pause campaigns if performance is poor</li>
        <li>Claim earnings regularly to free up contract storage</li>
        <li>End campaigns early if goals are met to recover unspent budget</li>
      </ul>
    </div>
  );
}
