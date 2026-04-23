export default function GettingStarted() {
  return (
    <div className="prose prose-invert max-w-none">
      <h1>Getting Started with StackAds</h1>
      <p className="lead">
        Learn how to integrate StackAds into your application in just a few minutes.
      </p>

      <h2>Prerequisites</h2>
      <p>Before you begin, make sure you have:</p>
      <ul>
        <li>Node.js 18+ installed</li>
        <li>A Stacks wallet (Hiro or Xverse)</li>
        <li>Basic knowledge of React or your chosen framework</li>
        <li>SADS tokens for staking (get from faucet for testnet)</li>
      </ul>

      <h2>Installation</h2>
      <p>Choose your framework and install the corresponding SDK:</p>

      <h3>React</h3>
      <pre><code>{`npm install @stackads/react @stackads/sdk-core @stacks/connect`}</code></pre>

      <h3>Next.js</h3>
      <pre><code>{`npm install @stackads/nextjs @stackads/sdk-core @stacks/connect`}</code></pre>

      <h3>Vue</h3>
      <pre><code>{`npm install @stackads/vue @stackads/sdk-core @stacks/connect`}</code></pre>

      <h3>Angular</h3>
      <pre><code>{`npm install @stackads/angular @stackads/sdk-core @stacks/connect`}</code></pre>

      <h3>Svelte</h3>
      <pre><code>{`npm install @stackads/svelte @stackads/sdk-core @stacks/connect`}</code></pre>

      <h3>Vanilla JavaScript</h3>
      <pre><code>{`npm install @stackads/vanilla @stackads/sdk-core @stacks/connect`}</code></pre>

      <h2>Quick Start (React)</h2>
      <p>Here's a minimal example to get you started with React:</p>

      <h3>1. Setup Provider</h3>
      <pre><code>{`import { StackAdsProvider } from '@stackads/react';

function App() {
  return (
    <StackAdsProvider
      config={{
        network: 'testnet',
        contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        contractName: 'stackads-token',
      }}
    >
      <YourApp />
    </StackAdsProvider>
  );
}`}</code></pre>

      <h3>2. Use Hooks</h3>
      <pre><code>{`import { useToken, useRegistry } from '@stackads/react';

function Dashboard() {
  const { balance, getBalance, formattedBalance } = useToken();
  const { publisherInfo, registerPublisher } = useRegistry();

  useEffect(() => {
    getBalance('YOUR_ADDRESS');
  }, []);

  return (
    <div>
      <h1>Balance: {formattedBalance} SADS</h1>
      {!publisherInfo && (
        <button onClick={() => registerPublisher('My Site', 'https://example.com', 10000000n)}>
          Register as Publisher
        </button>
      )}
    </div>
  );
}`}</code></pre>

      <h2>For Publishers</h2>
      <p>To start earning as a publisher:</p>
      <ol>
        <li>Register as a publisher with a minimum stake of 10 SADS</li>
        <li>Create ad placements on your dashboard</li>
        <li>Integrate the ad code into your website</li>
        <li>Start earning from impressions and clicks</li>
      </ol>

      <h2>For Advertisers</h2>
      <p>To start advertising:</p>
      <ol>
        <li>Register as an advertiser with a minimum stake of 10 SADS</li>
        <li>Create a campaign with your budget and targeting</li>
        <li>Upload your ad creatives</li>
        <li>Launch your campaign and track performance</li>
      </ol>

      <h2>Next Steps</h2>
      <ul>
        <li>
          <a href="/docs/sdk/react">Explore the React SDK documentation</a>
        </li>
        <li>
          <a href="/docs/guides/publisher">Read the Publisher Guide</a>
        </li>
        <li>
          <a href="/docs/guides/advertiser">Read the Advertiser Guide</a>
        </li>
        <li>
          <a href="/docs/smart-contracts">Learn about Smart Contracts</a>
        </li>
      </ul>

      <div className="glass rounded-2xl p-6 border border-[#22d3ee]/20 bg-[#22d3ee]/5 not-prose mt-8">
        <h3 className="text-lg font-semibold mb-2 text-[#22d3ee]">
          Need Help?
        </h3>
        <p className="text-white/80 mb-4">
          Join our community or check out the troubleshooting guide if you run into issues.
        </p>
        <div className="flex gap-3">
          <a
            href="https://discord.gg/stackads"
            className="px-4 py-2 bg-[#22d3ee] text-white rounded-lg hover:bg-[#22d3ee]/90 transition-colors text-sm font-medium"
          >
            Join Discord
          </a>
          <a
            href="/docs/advanced/troubleshooting"
            className="px-4 py-2 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-colors text-sm font-medium"
          >
            Troubleshooting
          </a>
        </div>
      </div>
    </div>
  );
}
