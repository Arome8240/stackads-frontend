export default function AdvertiserGuidePage() {
  return (
    <div className="prose">
      <h1>Advertiser Guide</h1>
      <p className="lead">
        Complete guide for advertisers to create effective campaigns and reach your target audience on StackAds.
      </p>

      <h2>Overview</h2>
      <p>
        As an advertiser, you can create campaigns to promote your products or services across the StackAds 
        publisher network. This guide covers everything from registration to campaign optimization.
      </p>

      <h2>Getting Started</h2>

      <h3>Step 1: Register as Advertiser</h3>

      <h4>Requirements</h4>
      <ul>
        <li>Stacks wallet with STX for gas fees</li>
        <li>Minimum 500 SADS tokens for staking</li>
        <li>Company/brand information</li>
        <li>Ad creatives ready</li>
      </ul>

      <h4>Registration</h4>
      <pre><code>{`import { useRegisterAdvertiser } from '@stackads/react';

function RegisterButton() {
  const { register, loading } = useRegisterAdvertiser();

  const handleRegister = async () => {
    await register(
      'Acme Corp',
      'https://acme.com',
      500000000n // 500 SADS
    );
  };

  return (
    <button onClick={handleRegister} disabled={loading}>
      Register as Advertiser
    </button>
  );
}`}</code></pre>

      <h3>Step 2: Prepare Your Campaign</h3>

      <h4>Define Your Goals</h4>
      <ul>
        <li>Brand awareness: Focus on impressions</li>
        <li>Traffic: Focus on clicks (CPC)</li>
        <li>Conversions: Focus on actions (CPA)</li>
      </ul>

      <h4>Create Ad Creatives</h4>
      <p>Prepare ads in standard sizes:</p>
      <ul>
        <li>Banner: 728x90, 970x90</li>
        <li>Medium Rectangle: 300x250</li>
        <li>Skyscraper: 160x600, 300x600</li>
        <li>Mobile: 320x50, 320x100</li>
      </ul>

      <h3>Step 3: Create Campaign</h3>

      <pre><code>{`import { useCreateCampaign } from '@stackads/react';

function CreateCampaign() {
  const { create, loading } = useCreateCampaign();

  const handleCreate = async () => {
    const campaignId = await create({
      name: 'Summer Sale 2024',
      budget: 100000000n,        // 100 SADS
      costPerImpression: 100n,   // 0.0001 SADS
      costPerClick: 1000n,       // 0.001 SADS
      duration: 1440,            // ~10 days in blocks
      metadataUri: 'ipfs://QmX...'
    });
    
    console.log('Campaign created:', campaignId);
  };

  return (
    <button onClick={handleCreate} disabled={loading}>
      Create Campaign
    </button>
  );
}`}</code></pre>

      <h3>Step 4: Set Up Targeting</h3>

      <pre><code>{`import { useCampaignTargeting } from '@stackads/react';

function SetTargeting({ campaignId }) {
  const { setTargeting } = useCampaignTargeting();

  const handleSetTargeting = async () => {
    await setTargeting(campaignId, {
      geoLocations: ['US', 'UK', 'CA'],
      deviceTypes: [1, 2], // Mobile and Desktop
      minReputation: 700,
      maxDailyBudget: 10000000n,
      timeRestrictions: [1, 2, 3, 4, 5] // Weekdays
    });
  };

  return (
    <button onClick={handleSetTargeting}>
      Set Targeting
    </button>
  );
}`}</code></pre>

      <h2>Campaign Types</h2>

      <h3>CPC (Cost Per Click)</h3>
      <p>Best for: Driving traffic to your website</p>
      <ul>
        <li>You pay only when users click</li>
        <li>Good for direct response campaigns</li>
        <li>Typical CPC: 0.001-0.01 SADS</li>
      </ul>

      <h3>CPM (Cost Per Mille)</h3>
      <p>Best for: Brand awareness</p>
      <ul>
        <li>You pay per 1000 impressions</li>
        <li>Good for reaching large audiences</li>
        <li>Typical CPM: 0.1-1 SADS</li>
      </ul>

      <h3>CPA (Cost Per Action)</h3>
      <p>Best for: Conversions and sales</p>
      <ul>
        <li>You pay only for completed actions</li>
        <li>Requires conversion tracking</li>
        <li>Typical CPA: 0.1-10 SADS</li>
      </ul>

      <h2>Budget Planning</h2>

      <h3>Calculate Your Budget</h3>
      <pre><code>{`// For CPC campaign
const estimatedClicks = 10000;
const costPerClick = 0.001; // SADS
const budget = estimatedClicks * costPerClick;
// Budget: 10 SADS

// For CPM campaign
const estimatedImpressions = 1000000;
const costPerMille = 0.5; // SADS per 1000
const budget = (estimatedImpressions / 1000) * costPerMille;
// Budget: 500 SADS`}</code></pre>

      <h3>Budget Recommendations</h3>
      <ul>
        <li>Start small: 10-50 SADS for testing</li>
        <li>Scale up: Increase budget for winning campaigns</li>
        <li>Daily caps: Set max daily spend to control costs</li>
        <li>Reserve 10%: Keep buffer for high-performing days</li>
      </ul>

      <h2>Targeting Options</h2>

      <h3>Geographic Targeting</h3>
      <pre><code>{`geoLocations: ['US', 'UK', 'CA', 'AU']`}</code></pre>
      <p>Target specific countries using ISO 2-letter codes.</p>

      <h3>Device Targeting</h3>
      <pre><code>{`deviceTypes: [1] // Mobile only
deviceTypes: [2] // Desktop only
deviceTypes: [1, 2, 3] // All devices`}</code></pre>

      <h3>Publisher Quality</h3>
      <pre><code>{`minReputation: 700 // Only high-quality publishers`}</code></pre>
      <ul>
        <li>500+: Standard quality</li>
        <li>700+: High quality</li>
        <li>900+: Premium publishers</li>
      </ul>

      <h3>Time-Based Targeting</h3>
      <pre><code>{`timeRestrictions: [1, 2, 3, 4, 5] // Weekdays only
timeRestrictions: [0, 6] // Weekends only`}</code></pre>

      <h2>Creative Best Practices</h2>

      <h3>Design Guidelines</h3>
      <ul>
        <li>Clear message: One main idea per ad</li>
        <li>Strong CTA: Use action words (Buy, Learn, Get)</li>
        <li>Brand visible: Include logo and brand colors</li>
        <li>High quality: Use professional images</li>
        <li>Mobile-friendly: Test on small screens</li>
      </ul>

      <h3>Copy Tips</h3>
      <ul>
        <li>Keep it short: 5-10 words for headlines</li>
        <li>Focus on benefits: What's in it for the user?</li>
        <li>Create urgency: Limited time offers work</li>
        <li>Be specific: Use numbers and facts</li>
      </ul>

      <h3>A/B Testing</h3>
      <pre><code>{`import { useABTest } from '@stackads/react';

function SetupABTest({ campaignId }) {
  const { setupTest } = useABTest();

  const handleSetup = async () => {
    await setupTest(campaignId, {
      variantA: 1, // Creative ID 1
      variantB: 2, // Creative ID 2
      weightA: 50,
      weightB: 50
    });
  };

  return <button onClick={handleSetup}>Start A/B Test</button>;
}`}</code></pre>

      <h2>Campaign Management</h2>

      <h3>Monitor Performance</h3>
      <pre><code>{`import { useCampaignStats } from '@stackads/react';

function CampaignDashboard({ campaignId }) {
  const { stats, loading } = useCampaignStats(campaignId);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h3>Campaign Performance</h3>
      <p>Impressions: {stats.impressions}</p>
      <p>Clicks: {stats.clicks}</p>
      <p>CTR: {stats.ctr}%</p>
      <p>Spent: {stats.spent} SADS</p>
      <p>Remaining: {stats.remaining} SADS</p>
    </div>
  );
}`}</code></pre>

      <h3>Pause/Resume Campaign</h3>
      <pre><code>{`import { usePauseCampaign, useResumeCampaign } from '@stackads/react';

function CampaignControls({ campaignId, isActive }) {
  const { pause } = usePauseCampaign();
  const { resume } = useResumeCampaign();

  return (
    <div>
      {isActive ? (
        <button onClick={() => pause(campaignId)}>Pause</button>
      ) : (
        <button onClick={() => resume(campaignId)}>Resume</button>
      )}
    </div>
  );
}`}</code></pre>

      <h3>Add More Budget</h3>
      <pre><code>{`import { useFundCampaign } from '@stackads/react';

function AddBudget({ campaignId }) {
  const { fund } = useFundCampaign();

  const handleFund = async () => {
    await fund(campaignId, 50000000n); // Add 50 SADS
  };

  return <button onClick={handleFund}>Add Budget</button>;
}`}</code></pre>

      <h2>Optimization Strategies</h2>

      <h3>Improve CTR</h3>
      <ul>
        <li>Test different headlines</li>
        <li>Use eye-catching images</li>
        <li>Add clear call-to-action</li>
        <li>Target relevant audiences</li>
      </ul>

      <h3>Reduce CPC</h3>
      <ul>
        <li>Improve ad relevance</li>
        <li>Target less competitive niches</li>
        <li>Optimize landing pages</li>
        <li>Build campaign history</li>
      </ul>

      <h3>Increase Conversions</h3>
      <ul>
        <li>Match ad to landing page</li>
        <li>Simplify conversion process</li>
        <li>Add trust signals</li>
        <li>Test different offers</li>
      </ul>

      <h2>Analytics & Reporting</h2>

      <h3>Key Metrics</h3>
      <ul>
        <li>CTR: Clicks / Impressions × 100</li>
        <li>CPC: Total Spend / Clicks</li>
        <li>CVR: Conversions / Clicks × 100</li>
        <li>CPA: Total Spend / Conversions</li>
        <li>ROI: (Revenue - Spend) / Spend × 100</li>
      </ul>

      <h3>Performance Benchmarks</h3>
      <ul>
        <li>Good CTR: 1-5%</li>
        <li>Good CVR: 2-10%</li>
        <li>Target ROI: 200%+</li>
      </ul>

      <h2>Compliance & Policies</h2>

      <h3>Ad Content Guidelines</h3>
      <p>Ads must not contain:</p>
      <ul>
        <li>Misleading claims</li>
        <li>Prohibited products (weapons, drugs)</li>
        <li>Adult content</li>
        <li>Malware or phishing</li>
        <li>Copyright violations</li>
      </ul>

      <h3>Landing Page Requirements</h3>
      <ul>
        <li>Match ad content</li>
        <li>Clear privacy policy</li>
        <li>Secure (HTTPS)</li>
        <li>Mobile-friendly</li>
        <li>Fast loading</li>
      </ul>

      <h2>Troubleshooting</h2>

      <h3>Low Impressions</h3>
      <ul>
        <li>Increase budget</li>
        <li>Broaden targeting</li>
        <li>Raise bid amounts</li>
        <li>Check campaign status</li>
      </ul>

      <h3>High CPC</h3>
      <ul>
        <li>Improve ad quality</li>
        <li>Refine targeting</li>
        <li>Test different creatives</li>
        <li>Optimize landing page</li>
      </ul>

      <h3>Low Conversions</h3>
      <ul>
        <li>Review landing page</li>
        <li>Check targeting relevance</li>
        <li>Test different offers</li>
        <li>Simplify conversion flow</li>
      </ul>

      <h2>Support & Resources</h2>

      <h3>Getting Help</h3>
      <ul>
        <li>Documentation: docs.stackads.io</li>
        <li>Discord: discord.gg/stackads</li>
        <li>Email: advertisers@stackads.io</li>
        <li>GitHub: github.com/stackads</li>
      </ul>

      <h2>Next Steps</h2>
      <ol>
        <li>Register as advertiser</li>
        <li>Prepare ad creatives</li>
        <li>Create your first campaign</li>
        <li>Set up targeting</li>
        <li>Monitor performance</li>
        <li>Optimize based on data</li>
        <li>Scale successful campaigns</li>
      </ol>
    </div>
  );
}
