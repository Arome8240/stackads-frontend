export default function PublisherGuidePage() {
  return (
    <div className="prose">
      <h1>Publisher Guide</h1>
      <p className="lead">
        Complete guide for publishers to integrate StackAds and start earning from their traffic.
      </p>

      <h2>Overview</h2>
      <p>
        As a publisher, you can monetize your website or app by displaying ads from the StackAds network. 
        This guide walks you through registration, integration, and optimization.
      </p>

      <h2>Getting Started</h2>

      <h3>Step 1: Register as Publisher</h3>
      <p>Before you can display ads, you need to register and stake SADS tokens.</p>

      <h4>Requirements</h4>
      <ul>
        <li>Stacks wallet with STX for gas fees</li>
        <li>Minimum 100 SADS tokens for staking</li>
        <li>Website or app with traffic</li>
      </ul>

      <h4>Registration Process</h4>
      <pre><code>{`// Using React SDK
import { useRegisterPublisher } from '@stackads/react';

function RegisterButton() {
  const { register, loading } = useRegisterPublisher();

  const handleRegister = async () => {
    await register(
      'My Website',
      'https://example.com',
      100000000n // 100 SADS
    );
  };

  return (
    <button onClick={handleRegister} disabled={loading}>
      Register as Publisher
    </button>
  );
}`}</code></pre>

      <h3>Step 2: Create Ad Placements</h3>
      <p>Decide where ads will appear on your site.</p>

      <h4>Common Placements</h4>
      <ul>
        <li>Header banner (728x90 or 970x90)</li>
        <li>Sidebar (300x250 or 300x600)</li>
        <li>In-content (native ads)</li>
        <li>Footer banner (728x90)</li>
      </ul>

      <h3>Step 3: Integrate SDK</h3>

      <h4>React/Next.js Integration</h4>
      <pre><code>{`// Install SDK
npm install @stackads/react

// Wrap your app with provider
import { StackAdsProvider } from '@stackads/react';

function App() {
  return (
    <StackAdsProvider config={{
      network: 'testnet',
      contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
    }}>
      <YourApp />
    </StackAdsProvider>
  );
}`}</code></pre>

      <h4>Display Ads</h4>
      <pre><code>{`import { AdPlacement } from '@stackads/react';

function Sidebar() {
  return (
    <aside>
      <AdPlacement
        placementId="sidebar-1"
        width={300}
        height={250}
        onImpression={(data) => console.log('Impression:', data)}
        onClick={(data) => console.log('Click:', data)}
      />
    </aside>
  );
}`}</code></pre>

      <h3>Step 4: Verify Integration</h3>
      <p>Test your integration before going live:</p>
      <ul>
        <li>Check ads are displaying correctly</li>
        <li>Verify impression tracking</li>
        <li>Test click tracking</li>
        <li>Confirm responsive behavior</li>
      </ul>

      <h2>Earning Revenue</h2>

      <h3>How You Get Paid</h3>
      <p>Publishers earn based on:</p>
      <ul>
        <li>Impressions: Each time an ad is displayed</li>
        <li>Clicks: Each time a user clicks an ad</li>
        <li>Conversions: When clicks lead to actions</li>
      </ul>

      <h3>Payment Formula</h3>
      <pre><code>{`earnings = (impressions × CPM) + (clicks × CPC) + (conversions × CPA)`}</code></pre>

      <h3>Claiming Earnings</h3>
      <pre><code>{`import { useClaimEarnings } from '@stackads/react';

function ClaimButton({ campaignId }) {
  const { claim, loading } = useClaimEarnings();

  return (
    <button onClick={() => claim(campaignId)} disabled={loading}>
      Claim Earnings
    </button>
  );
}`}</code></pre>

      <h2>Optimization Tips</h2>

      <h3>Ad Placement Best Practices</h3>
      <ul>
        <li>Above the fold: Place at least one ad in visible area</li>
        <li>Natural flow: Integrate ads into content naturally</li>
        <li>Mobile-first: Ensure ads work well on mobile</li>
        <li>Don't overdo it: Too many ads hurt user experience</li>
      </ul>

      <h3>Improving CTR</h3>
      <ul>
        <li>Use relevant ad sizes (300x250, 728x90 perform well)</li>
        <li>Place ads near engaging content</li>
        <li>Test different positions</li>
        <li>Ensure fast loading times</li>
      </ul>

      <h3>Building Reputation</h3>
      <p>Your reputation score affects campaign eligibility:</p>
      <ul>
        <li>Maintain high-quality traffic</li>
        <li>Avoid click fraud</li>
        <li>Keep site content appropriate</li>
        <li>Respond to disputes promptly</li>
      </ul>

      <h2>Analytics & Reporting</h2>

      <h3>Track Performance</h3>
      <pre><code>{`import { usePublisherStats } from '@stackads/react';

function Analytics() {
  const { stats, loading } = usePublisherStats();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h3>Performance</h3>
      <p>Impressions: {stats.totalImpressions}</p>
      <p>Clicks: {stats.totalClicks}</p>
      <p>CTR: {stats.ctr}%</p>
      <p>Earnings: {stats.totalEarnings} SADS</p>
    </div>
  );
}`}</code></pre>

      <h3>Key Metrics to Monitor</h3>
      <ul>
        <li>CTR (Click-Through Rate): Target 1-5%</li>
        <li>Viewability: Percentage of ads actually seen</li>
        <li>RPM (Revenue Per Mille): Earnings per 1000 impressions</li>
        <li>Fill Rate: Percentage of ad requests filled</li>
      </ul>

      <h2>Advanced Features</h2>

      <h3>Ad Filtering</h3>
      <pre><code>{`<AdPlacement
  placementId="sidebar-1"
  filters={{
    categories: ['technology', 'business'],
    excludeCategories: ['gambling', 'adult'],
    minBudget: 1000000n
  }}
/>`}</code></pre>

      <h3>Custom Styling</h3>
      <pre><code>{`<AdPlacement
  placementId="native-1"
  className="custom-ad"
  style={{
    borderRadius: '8px',
    padding: '16px',
    backgroundColor: '#f5f5f5'
  }}
/>`}</code></pre>

      <h3>A/B Testing</h3>
      <pre><code>{`// Test different placements
<AdPlacement
  placementId="test-a"
  variant="A"
  onPerformance={(data) => trackVariant('A', data)}
/>

<AdPlacement
  placementId="test-b"
  variant="B"
  onPerformance={(data) => trackVariant('B', data)}
/>`}</code></pre>

      <h2>Compliance & Policies</h2>

      <h3>Content Guidelines</h3>
      <p>Your site must not contain:</p>
      <ul>
        <li>Illegal content</li>
        <li>Hate speech or discrimination</li>
        <li>Malware or phishing</li>
        <li>Copyright violations</li>
        <li>Misleading information</li>
      </ul>

      <h3>Traffic Quality</h3>
      <ul>
        <li>No bot traffic or click farms</li>
        <li>No incentivized clicks</li>
        <li>No misleading ad placements</li>
        <li>No auto-refreshing pages</li>
      </ul>

      <h3>Privacy & GDPR</h3>
      <pre><code>{`// Implement consent management
<AdPlacement
  placementId="sidebar-1"
  gdprConsent={userConsent}
  onConsentRequired={() => showConsentDialog()}
/>`}</code></pre>

      <h2>Troubleshooting</h2>

      <h3>Ads Not Showing</h3>
      <ul>
        <li>Check registration status</li>
        <li>Verify stake amount (min 100 SADS)</li>
        <li>Ensure SDK is properly configured</li>
        <li>Check browser console for errors</li>
      </ul>

      <h3>Low Earnings</h3>
      <ul>
        <li>Improve ad placement visibility</li>
        <li>Increase traffic quality</li>
        <li>Test different ad sizes</li>
        <li>Build reputation score</li>
      </ul>

      <h3>Reputation Issues</h3>
      <ul>
        <li>Review traffic sources</li>
        <li>Check for bot activity</li>
        <li>Ensure content quality</li>
        <li>Contact support if unfairly penalized</li>
      </ul>

      <h2>Support & Resources</h2>

      <h3>Getting Help</h3>
      <ul>
        <li>Documentation: docs.stackads.io</li>
        <li>Discord: discord.gg/stackads</li>
        <li>Email: publishers@stackads.io</li>
        <li>GitHub: github.com/stackads</li>
      </ul>

      <h3>Community</h3>
      <ul>
        <li>Join publisher Discord channel</li>
        <li>Share optimization tips</li>
        <li>Report bugs and issues</li>
        <li>Request new features</li>
      </ul>

      <h2>Next Steps</h2>
      <ol>
        <li>Register as publisher</li>
        <li>Integrate SDK on your site</li>
        <li>Test ad placements</li>
        <li>Monitor performance</li>
        <li>Optimize for better earnings</li>
        <li>Claim your earnings regularly</li>
      </ol>
    </div>
  );
}
