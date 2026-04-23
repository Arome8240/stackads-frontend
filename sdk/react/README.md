# @stackads/react

React hooks and components for StackAds SDK.

## Installation

```bash
npm install @stackads/react @stackads/sdk-core
# or
yarn add @stackads/react @stackads/sdk-core
# or
pnpm add @stackads/react @stackads/sdk-core
```

## Setup

Wrap your app with the `StackAdsProvider`:

```tsx
import { StackAdsProvider } from '@stackads/react';
import { StacksTestnet } from '@stacks/network';

function App() {
  return (
    <StackAdsProvider
      config={{
        network: new StacksTestnet(),
        contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      }}
    >
      <YourApp />
    </StackAdsProvider>
  );
}
```

## Hooks

### Token Hooks

#### useTokenBalance

Get token balance for an address:

```tsx
import { useTokenBalance } from '@stackads/react';

function BalanceDisplay({ address }: { address: string }) {
  const { balance, formatted, loading, error } = useTokenBalance(address);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <p>Balance: {formatted} SADS</p>
      <p>Raw: {balance?.toString()}</p>
    </div>
  );
}
```

#### useTokenMetadata

Get token metadata:

```tsx
import { useTokenMetadata } from '@stackads/react';

function TokenInfo() {
  const { metadata, loading, error } = useTokenMetadata();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <p>Name: {metadata?.name}</p>
      <p>Symbol: {metadata?.symbol}</p>
      <p>Decimals: {metadata?.decimals}</p>
      <p>Total Supply: {metadata?.totalSupply.toString()}</p>
    </div>
  );
}
```

#### useTokenTransfer

Transfer tokens:

```tsx
import { useTokenTransfer } from '@stackads/react';

function TransferForm() {
  const { transfer, loading, error, result } = useTokenTransfer();

  const handleTransfer = async () => {
    try {
      await transfer(
        100, // amount
        'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG', // recipient
        'your-private-key'
      );
    } catch (err) {
      console.error('Transfer failed:', err);
    }
  };

  return (
    <div>
      <button onClick={handleTransfer} disabled={loading}>
        {loading ? 'Transferring...' : 'Transfer'}
      </button>
      {result && <p>Transaction ID: {result.txId}</p>}
      {error && <p>Error: {error.message}</p>}
    </div>
  );
}
```

### Registry Hooks

#### useParticipant

Get participant information:

```tsx
import { useParticipant } from '@stackads/react';

function ParticipantProfile({ address }: { address: string }) {
  const { participant, loading, error } = useParticipant(address);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!participant) return <div>Not registered</div>;

  return (
    <div>
      <p>Type: {participant.type === 1 ? 'Publisher' : 'Advertiser'}</p>
      <p>Reputation: {participant.reputationScore}/1000</p>
      <p>Staked: {participant.stakedAmount.toString()}</p>
      <p>Impressions: {participant.totalImpressions.toString()}</p>
      <p>Clicks: {participant.totalClicks.toString()}</p>
    </div>
  );
}
```

#### useRegisterPublisher

Register as a publisher:

```tsx
import { useRegisterPublisher } from '@stackads/react';

function RegisterPublisher() {
  const { register, loading, error, result } = useRegisterPublisher();

  const handleRegister = async () => {
    try {
      await register('ipfs://metadata-uri', 'your-private-key');
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  return (
    <div>
      <button onClick={handleRegister} disabled={loading}>
        {loading ? 'Registering...' : 'Register as Publisher'}
      </button>
      {result && <p>Transaction ID: {result.txId}</p>}
      {error && <p>Error: {error.message}</p>}
    </div>
  );
}
```

### Staking Hooks

#### useStakingInfo

Get staking information:

```tsx
import { useStakingInfo } from '@stackads/react';

function StakingDashboard({ address }: { address: string }) {
  const { stakingInfo, loading, error } = useStakingInfo(address);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <p>Staked: {stakingInfo?.balance.toString()}</p>
      <p>Earned: {stakingInfo?.earned.toString()}</p>
      <p>Reward Rate: {stakingInfo?.rewardRate.toString()}</p>
      <p>Total Supply: {stakingInfo?.totalSupply.toString()}</p>
    </div>
  );
}
```

#### useStakingAPY

Get current staking APY:

```tsx
import { useStakingAPY } from '@stackads/react';

function APYDisplay() {
  const { apy, loading, error } = useStakingAPY();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>Current APY: {apy?.toFixed(2)}%</div>;
}
```

#### useStake

Stake tokens:

```tsx
import { useStake } from '@stackads/react';

function StakeForm() {
  const { stake, loading, error, result } = useStake();

  const handleStake = async () => {
    try {
      await stake(100, 'your-private-key');
    } catch (err) {
      console.error('Staking failed:', err);
    }
  };

  return (
    <div>
      <button onClick={handleStake} disabled={loading}>
        {loading ? 'Staking...' : 'Stake 100 SADS'}
      </button>
      {result && <p>Transaction ID: {result.txId}</p>}
      {error && <p>Error: {error.message}</p>}
    </div>
  );
}
```

### Campaign Hooks

#### useCampaign

Get campaign details:

```tsx
import { useCampaign } from '@stackads/react';

function CampaignDetails({ campaignId }: { campaignId: number }) {
  const { campaign, loading, error } = useCampaign(campaignId);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!campaign) return <div>Campaign not found</div>;

  return (
    <div>
      <p>Advertiser: {campaign.advertiser}</p>
      <p>Budget: {campaign.budget.toString()}</p>
      <p>Spent: {campaign.spent.toString()}</p>
      <p>Impressions: {campaign.totalImpressions.toString()}</p>
      <p>Clicks: {campaign.totalClicks.toString()}</p>
      <p>Status: {campaign.status}</p>
    </div>
  );
}
```

#### useCampaignMetrics

Get campaign metrics:

```tsx
import { useCampaignMetrics } from '@stackads/react';

function CampaignMetrics({ campaignId }: { campaignId: number }) {
  const { metrics, loading, error } = useCampaignMetrics(campaignId);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <p>CTR: {metrics?.ctr.toFixed(2)}%</p>
      <p>Avg CPC: {metrics?.averageCpc.toFixed(6)}</p>
      <p>Budget Used: {metrics?.budgetUsed.toFixed(2)}%</p>
      <p>Remaining: {metrics?.remainingBudget.toString()}</p>
    </div>
  );
}
```

#### useCreateCampaign

Create a new campaign:

```tsx
import { useCreateCampaign } from '@stackads/react';

function CreateCampaignForm() {
  const { createCampaign, loading, error, result } = useCreateCampaign();

  const handleCreate = async () => {
    try {
      await createCampaign(
        1000, // budget
        0.001, // cost per impression
        0.01, // cost per click
        1440, // duration (blocks)
        'ipfs://campaign-metadata',
        'your-private-key'
      );
    } catch (err) {
      console.error('Campaign creation failed:', err);
    }
  };

  return (
    <div>
      <button onClick={handleCreate} disabled={loading}>
        {loading ? 'Creating...' : 'Create Campaign'}
      </button>
      {result && <p>Transaction ID: {result.txId}</p>}
      {error && <p>Error: {error.message}</p>}
    </div>
  );
}
```

## TypeScript Support

Full TypeScript support with all types from `@stackads/sdk-core`:

```tsx
import type {
  Participant,
  Campaign,
  StakingInfo,
  TransactionResult,
} from '@stackads/react';
```

## License

MIT

## Links

- [Core SDK Documentation](https://www.npmjs.com/package/@stackads/sdk-core)
- [GitHub](https://github.com/stackads/stackads-sdk)
- [Website](https://stackads.io)
