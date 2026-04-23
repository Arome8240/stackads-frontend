export default function CampaignManagerContractPage() {
  return (
    <div className="prose">
      <h1>Campaign Manager Contract</h1>
      <p className="lead">
        Advanced campaign management with targeting, A/B testing, creative management, and performance tracking.
      </p>

      <h2>Overview</h2>
      <p>
        The Campaign Manager extends basic campaign functionality with advanced features like geo-targeting, 
        device targeting, multiple creatives, A/B testing, and detailed performance analytics.
      </p>

      <h2>Key Features</h2>
      <ul>
        <li>Geo-targeting - Target specific countries</li>
        <li>Device targeting - Mobile, desktop, tablet</li>
        <li>Multiple creatives - Different ad formats per campaign</li>
        <li>A/B testing - Test creative variants</li>
        <li>Performance tracking - Daily metrics and analytics</li>
        <li>Reputation filtering - Target high-quality publishers</li>
      </ul>

      <h2>Campaign Types</h2>
      <ul>
        <li>CPC (1): Cost per click</li>
        <li>CPM (2): Cost per mille (1000 impressions)</li>
        <li>CPA (3): Cost per action/conversion</li>
      </ul>

      <h2>Public Functions</h2>

      <h3>set-campaign-targeting</h3>
      <pre><code>{`(set-campaign-targeting
  (campaign-id uint)
  (geo-locations (list 10 (string-ascii 2)))
  (device-types (list 5 uint))
  (min-reputation uint)
  (max-daily-budget uint)
  (time-restrictions (list 7 uint))
)`}</code></pre>
      <p>Configure targeting options for a campaign. Only callable by campaign owner.</p>
      <ul>
        <li>geo-locations: List of country codes (e.g., "US", "UK")</li>
        <li>device-types: 1=mobile, 2=desktop, 3=tablet</li>
        <li>min-reputation: Minimum publisher reputation (0-1000)</li>
        <li>max-daily-budget: Daily spending cap</li>
        <li>time-restrictions: Days of week to run (0-6)</li>
      </ul>

      <h3>add-campaign-creative</h3>
      <pre><code>{`(add-campaign-creative
  (campaign-id uint)
  (creative-uri (string-utf8 256))
  (creative-type (string-ascii 20))
  (width uint)
  (height uint)
)`}</code></pre>
      <p>Add a creative (ad asset) to a campaign.</p>
      <ul>
        <li>creative-uri: IPFS/HTTP URI to creative asset</li>
        <li>creative-type: "banner", "video", "native"</li>
        <li>width: Creative width in pixels</li>
        <li>height: Creative height in pixels</li>
      </ul>

      <h3>toggle-creative</h3>
      <pre><code>{`(toggle-creative (campaign-id uint) (creative-id uint) (active bool))`}</code></pre>
      <p>Enable or disable a creative.</p>

      <h3>setup-ab-test</h3>
      <pre><code>{`(setup-ab-test
  (campaign-id uint)
  (variant-a-id uint)
  (variant-b-id uint)
  (variant-a-weight uint)
  (variant-b-weight uint)
)`}</code></pre>
      <p>Set up A/B testing between two creatives.</p>
      <ul>
        <li>variant-a-id: First creative ID</li>
        <li>variant-b-id: Second creative ID</li>
        <li>variant-a-weight: Traffic percentage (0-100)</li>
        <li>variant-b-weight: Traffic percentage (0-100)</li>
        <li>Weights must sum to 100</li>
      </ul>

      <h3>record-creative-impression</h3>
      <pre><code>{`(record-creative-impression (campaign-id uint) (creative-id uint))`}</code></pre>
      <p>Record an impression for a specific creative. Only callable by contract owner (oracle).</p>

      <h3>record-creative-click</h3>
      <pre><code>{`(record-creative-click (campaign-id uint) (creative-id uint))`}</code></pre>
      <p>Record a click for a specific creative. Only callable by contract owner (oracle).</p>

      <h3>record-conversion</h3>
      <pre><code>{`(record-conversion (campaign-id uint) (variant-id uint))`}</code></pre>
      <p>Record a conversion for an A/B test variant. Only callable by contract owner (oracle).</p>

      <h3>record-daily-performance</h3>
      <pre><code>{`(record-daily-performance
  (campaign-id uint)
  (date uint)
  (impressions uint)
  (clicks uint)
  (conversions uint)
  (spend uint)
  (revenue uint)
)`}</code></pre>
      <p>Record daily performance metrics. Only callable by contract owner (oracle).</p>

      <h2>Read-Only Functions</h2>

      <h3>get-campaign-targeting</h3>
      <pre><code>{`(get-campaign-targeting (campaign-id uint))`}</code></pre>
      <p>Returns targeting configuration for a campaign.</p>

      <h3>get-campaign-creative</h3>
      <pre><code>{`(get-campaign-creative (campaign-id uint) (creative-id uint))`}</code></pre>
      <p>Returns creative details including performance metrics.</p>

      <h3>get-creative-count</h3>
      <pre><code>{`(get-creative-count (campaign-id uint))`}</code></pre>
      <p>Returns number of creatives for a campaign.</p>

      <h3>get-ab-test</h3>
      <pre><code>{`(get-ab-test (campaign-id uint))`}</code></pre>
      <p>Returns A/B test configuration and results.</p>

      <h3>get-campaign-performance</h3>
      <pre><code>{`(get-campaign-performance (campaign-id uint) (date uint))`}</code></pre>
      <p>Returns performance metrics for a specific date.</p>

      <h3>calculate-ctr</h3>
      <pre><code>{`(calculate-ctr (impressions uint) (clicks uint))`}</code></pre>
      <p>Calculate click-through rate in basis points.</p>

      <h3>calculate-conversion-rate</h3>
      <pre><code>{`(calculate-conversion-rate (clicks uint) (conversions uint))`}</code></pre>
      <p>Calculate conversion rate in basis points.</p>

      <h3>get-creative-performance</h3>
      <pre><code>{`(get-creative-performance (campaign-id uint) (creative-id uint))`}</code></pre>
      <p>Returns impressions, clicks, and CTR for a creative.</p>

      <h3>get-ab-test-results</h3>
      <pre><code>{`(get-ab-test-results (campaign-id uint))`}</code></pre>
      <p>Returns conversion data and rates for both A/B test variants.</p>

      <h2>Data Structures</h2>

      <h3>Campaign Targeting</h3>
      <pre><code>{`{
  geo-locations: list,            // Country codes
  device-types: list,             // Device type IDs
  min-reputation: uint,           // Min publisher reputation
  max-daily-budget: uint,         // Daily spending cap
  time-restrictions: list         // Days of week
}`}</code></pre>

      <h3>Campaign Creative</h3>
      <pre><code>{`{
  creative-uri: string-utf8,      // Asset URI
  creative-type: string-ascii,    // banner/video/native
  width: uint,                    // Width in pixels
  height: uint,                   // Height in pixels
  active: bool,                   // Is active
  impressions: uint,              // Total impressions
  clicks: uint                    // Total clicks
}`}</code></pre>

      <h3>A/B Test</h3>
      <pre><code>{`{
  enabled: bool,                  // Test is active
  variant-a-id: uint,             // First creative
  variant-b-id: uint,             // Second creative
  variant-a-weight: uint,         // Traffic % (0-100)
  variant-b-weight: uint,         // Traffic % (0-100)
  variant-a-conversions: uint,    // Conversions for A
  variant-b-conversions: uint     // Conversions for B
}`}</code></pre>

      <h2>Error Codes</h2>
      <ul>
        <li>u700: Owner only</li>
        <li>u701: Not found</li>
        <li>u702: Unauthorized (not campaign owner)</li>
        <li>u703: Invalid parameters</li>
        <li>u704: Campaign ended</li>
      </ul>

      <h2>Usage Examples</h2>

      <h3>Set Up Geo-Targeting</h3>
      <pre><code>{`// Target US and UK users on mobile devices
(contract-call? .campaign-manager set-campaign-targeting
  u1                              // Campaign ID
  (list "US" "UK")                // Countries
  (list u1)                       // Mobile only
  u700                            // Min reputation 70%
  u50000000                       // 50 SADS daily max
  (list u1 u2 u3 u4 u5)          // Weekdays only
)`}</code></pre>

      <h3>Add Multiple Creatives</h3>
      <pre><code>{`// Add banner creative
(contract-call? .campaign-manager add-campaign-creative
  u1
  "ipfs://QmX...banner"
  "banner"
  u728
  u90
)

// Add video creative
(contract-call? .campaign-manager add-campaign-creative
  u1
  "ipfs://QmY...video"
  "video"
  u1920
  u1080
)`}</code></pre>

      <h3>Set Up A/B Test</h3>
      <pre><code>{`// Test creative 1 vs creative 2 with 50/50 split
(contract-call? .campaign-manager setup-ab-test
  u1    // Campaign ID
  u1    // Creative 1
  u2    // Creative 2
  u50   // 50% traffic to creative 1
  u50   // 50% traffic to creative 2
)`}</code></pre>

      <h3>Check Creative Performance</h3>
      <pre><code>{`// Get performance for creative 1
(contract-call? .campaign-manager get-creative-performance u1 u1)

// Get A/B test results
(contract-call? .campaign-manager get-ab-test-results u1)`}</code></pre>

      <h2>Targeting Best Practices</h2>

      <h3>Geo-Targeting</h3>
      <ul>
        <li>Start broad, narrow based on performance</li>
        <li>Use 2-letter ISO country codes</li>
        <li>Consider time zones for time restrictions</li>
      </ul>

      <h3>Device Targeting</h3>
      <ul>
        <li>Mobile (1): Best for app installs, quick actions</li>
        <li>Desktop (2): Best for complex products, B2B</li>
        <li>Tablet (3): Hybrid use cases</li>
      </ul>

      <h3>Reputation Filtering</h3>
      <ul>
        <li>500+: Standard quality</li>
        <li>700+: High quality</li>
        <li>900+: Premium publishers only</li>
      </ul>

      <h2>A/B Testing Guide</h2>

      <h3>What to Test</h3>
      <ul>
        <li>Headlines and copy</li>
        <li>Images and videos</li>
        <li>Call-to-action buttons</li>
        <li>Colors and layouts</li>
      </ul>

      <h3>Best Practices</h3>
      <ul>
        <li>Test one variable at a time</li>
        <li>Run tests for at least 1000 impressions per variant</li>
        <li>Use 50/50 split initially</li>
        <li>Wait for statistical significance</li>
        <li>Implement winning variant</li>
      </ul>

      <h3>Statistical Significance</h3>
      <p>A variant is significantly better when:</p>
      <ul>
        <li>Conversion rate difference is &gt;20%</li>
        <li>Sample size is &gt;1000 per variant</li>
        <li>Results are consistent over multiple days</li>
      </ul>

      <h2>Performance Tracking</h2>

      <h3>Key Metrics</h3>
      <ul>
        <li>CTR: Click-through rate (clicks / impressions)</li>
        <li>CVR: Conversion rate (conversions / clicks)</li>
        <li>CPC: Cost per click (spend / clicks)</li>
        <li>CPA: Cost per action (spend / conversions)</li>
        <li>ROI: Return on investment ((revenue - spend) / spend)</li>
      </ul>

      <h3>Optimization Tips</h3>
      <ul>
        <li>Pause low-performing creatives</li>
        <li>Increase budget for high-performing campaigns</li>
        <li>Adjust targeting based on performance data</li>
        <li>Test new creatives regularly</li>
        <li>Monitor daily performance trends</li>
      </ul>

      <h2>Security Considerations</h2>
      <ul>
        <li>Only campaign owners can modify targeting and creatives</li>
        <li>Only oracle can record impressions and clicks</li>
        <li>Creative URIs should be validated off-chain</li>
        <li>A/B test weights must sum to 100</li>
      </ul>
    </div>
  );
}
