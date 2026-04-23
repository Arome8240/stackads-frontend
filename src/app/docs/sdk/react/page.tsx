export default function ReactSDKDocs() {
  return (
    <div className="prose prose-invert max-w-none">
      <h1>React SDK</h1>
      <p className="lead">
        React hooks and components for integrating StackAds into your React application.
      </p>

      <h2>Installation</h2>
      <pre><code>{`npm install @stackads/react @stackads/sdk-core @stacks/connect @stacks/transactions`}</code></pre>

      <h2>Setup</h2>
      <p>Wrap your application with the StackAdsProvider:</p>
      <pre><code>{`import { StackAdsProvider } from '@stackads/react';

function App() {
  return (
    <StackAdsProvider
      config={{
        network: 'testnet', // or 'mainnet'
        contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        contractName: 'stackads-token',
      }}
    >
      <YourApp />
    </StackAdsProvider>
  );
}`}</code></pre>

      <h2>Hooks</h2>

      <h3>useToken</h3>
      <p>Interact with the StackAds token contract.</p>
      <pre><code>{`import { useToken } from '@stackads/react';

function TokenBalance() {
  const {
    balance,
    loading,
    error,
    formattedBalance,
    getBalance,
    transfer,
    getTokenInfo,
  } = useToken();

  useEffect(() => {
    getBalance('ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM');
  }, []);

  const handleTransfer = async () => {
    await transfer(
      'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG',
      1000000n, // 1 SADS
      'Payment'
    );
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <p>Balance: {formattedBalance} SADS</p>
      <button onClick={handleTransfer}>Send 1 SADS</button>
    </div>
  );
}`}</code></pre>

      <h4>API</h4>
      <ul>
        <li><code>balance</code>: bigint | null - Current token balance</li>
        <li><code>loading</code>: boolean - Loading state</li>
        <li><code>error</code>: Error | null - Error state</li>
        <li><code>formattedBalance</code>: string - Formatted balance with decimals</li>
        <li><code>getBalance(address: string)</code>: Promise - Fetch balance</li>
        <li><code>transfer(to: string, amount: bigint, memo?: string)</code>: Promise - Transfer tokens</li>
        <li><code>getTokenInfo()</code>: Promise - Get token metadata</li>
      </ul>

      <h3>useRegistry</h3>
      <p>Manage publisher and advertiser registrations.</p>
      <pre><code>{`import { useRegistry } from '@stackads/react';

function Registration() {
  const {
    publisherInfo,
    advertiserInfo,
    loading,
    registerPublisher,
    registerAdvertiser,
    getPublisher,
  } = useRegistry();

  const handleRegister = async () => {
    await registerPublisher(
      'My Website',
      'https://example.com',
      10000000n // 10 SADS stake
    );
  };

  return (
    <div>
      {!publisherInfo ? (
        <button onClick={handleRegister}>Register as Publisher</button>
      ) : (
        <div>
          <h2>{publisherInfo.name}</h2>
          <p>Reputation: {publisherInfo.reputation}</p>
        </div>
      )}
    </div>
  );
}`}</code></pre>

      <h4>API</h4>
      <ul>
        <li><code>publisherInfo</code>: PublisherInfo | null - Publisher data</li>
        <li><code>advertiserInfo</code>: AdvertiserInfo | null - Advertiser data</li>
        <li><code>loading</code>: boolean - Loading state</li>
        <li><code>registerPublisher(name, website, stake)</code>: Promise - Register as publisher</li>
        <li><code>registerAdvertiser(name, company, stake)</code>: Promise - Register as advertiser</li>
        <li><code>getPublisher(address)</code>: Promise - Fetch publisher info</li>
        <li><code>getAdvertiser(address)</code>: Promise - Fetch advertiser info</li>
      </ul>

      <h3>useStaking</h3>
      <p>Manage token staking and rewards.</p>
      <pre><code>{`import { useStaking } from '@stackads/react';

function Staking() {
  const {
    stakeInfo,
    loading,
    formattedStake,
    stake,
    unstake,
    claimRewards,
    getStakeInfo,
  } = useStaking();

  const handleStake = async () => {
    await stake(5000000n); // Stake 5 SADS
  };

  return (
    <div>
      <p>Staked: {formattedStake} SADS</p>
      <button onClick={handleStake}>Stake 5 SADS</button>
      <button onClick={claimRewards}>Claim Rewards</button>
    </div>
  );
}`}</code></pre>

      <h4>API</h4>
      <ul>
        <li><code>stakeInfo</code>: StakeInfo | null - Staking data</li>
        <li><code>loading</code>: boolean - Loading state</li>
        <li><code>formattedStake</code>: string - Formatted stake amount</li>
        <li><code>stake(amount: bigint)</code>: Promise - Stake tokens</li>
        <li><code>unstake(amount: bigint)</code>: Promise - Unstake tokens</li>
        <li><code>claimRewards()</code>: Promise - Claim staking rewards</li>
        <li><code>getStakeInfo(address)</code>: Promise - Fetch stake info</li>
      </ul>

      <h3>useCampaign</h3>
      <p>Manage advertising campaigns.</p>
      <pre><code>{`import { useCampaign } from '@stackads/react';

function Campaigns() {
  const {
    campaigns,
    loading,
    createCampaign,
    pauseCampaign,
    resumeCampaign,
  } = useCampaign();

  const handleCreate = async () => {
    await createCampaign(
      'Summer Sale',
      50000000n, // 50 SADS budget
      100000n,   // 0.1 SADS per click
      30         // 30 days
    );
  };

  return (
    <div>
      <button onClick={handleCreate}>Create Campaign</button>
      {campaigns.map(campaign => (
        <div key={campaign.id}>
          <h3>{campaign.name}</h3>
          <p>Budget: {campaign.budget}</p>
        </div>
      ))}
    </div>
  );
}`}</code></pre>

      <h4>API</h4>
      <ul>
        <li><code>campaigns</code>: CampaignInfo[] - List of campaigns</li>
        <li><code>loading</code>: boolean - Loading state</li>
        <li><code>createCampaign(name, budget, cpc, duration)</code>: Promise - Create campaign</li>
        <li><code>pauseCampaign(id)</code>: Promise - Pause campaign</li>
        <li><code>resumeCampaign(id)</code>: Promise - Resume campaign</li>
        <li><code>getCampaign(id)</code>: Promise - Fetch campaign details</li>
      </ul>

      <h2>TypeScript Support</h2>
      <p>All hooks are fully typed with TypeScript:</p>
      <pre><code>{`import type {
  PublisherInfo,
  AdvertiserInfo,
  StakeInfo,
  CampaignInfo,
} from '@stackads/react';`}</code></pre>

      <h2>Error Handling</h2>
      <p>All hooks expose an error state:</p>
      <pre><code>{`const { error } = useToken();

if (error) {
  console.error('Token error:', error.message);
}`}</code></pre>

      <h2>Examples</h2>
      <p>Check out complete examples in our GitHub repository:</p>
      <ul>
        <li><a href="https://github.com/stackads/examples/react-publisher">Publisher Dashboard</a></li>
        <li><a href="https://github.com/stackads/examples/react-advertiser">Advertiser Dashboard</a></li>
        <li><a href="https://github.com/stackads/examples/react-integration">Basic Integration</a></li>
      </ul>
    </div>
  );
}
