# @stackads/svelte

Svelte stores for the StackAds decentralized advertising platform on Stacks blockchain.

## Installation

```bash
npm install @stackads/svelte @stackads/sdk-core @stacks/connect @stacks/transactions
# or
pnpm add @stackads/svelte @stackads/sdk-core @stacks/connect @stacks/transactions
# or
yarn add @stackads/svelte @stackads/sdk-core @stacks/connect @stacks/transactions
```

## Setup

### 1. Initialize StackAds

```typescript
// src/lib/stackads.ts or +layout.svelte
import { initStackAds } from '@stackads/svelte';

initStackAds({
  network: 'testnet', // or 'mainnet'
  contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  contractName: 'stackads-token',
});
```

### 2. Use Stores in Components

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import { tokenStore } from '@stackads/svelte';

  const userAddress = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';

  onMount(async () => {
    await tokenStore.getBalance(userAddress);
  });
</script>

{#if $tokenStore.loading}
  <p>Loading...</p>
{:else if $tokenStore.error}
  <p>Error: {$tokenStore.error.message}</p>
{:else}
  <p>Balance: {$tokenStore.formattedBalance} SADS</p>
{/if}
```

## Stores

### tokenStore

Interact with the StackAds token contract.

```svelte
<script lang="ts">
  import { tokenStore } from '@stackads/svelte';

  async function handleTransfer() {
    try {
      const txId = await tokenStore.transfer(
        'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG',
        1000000n, // 1 SADS (6 decimals)
        'Payment for services'
      );
      console.log('Transaction ID:', txId);
    } catch (error) {
      console.error('Transfer failed:', error);
    }
  }

  async function loadBalance() {
    await tokenStore.getBalance('ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM');
  }

  async function loadTokenInfo() {
    await tokenStore.getTokenInfo();
  }
</script>

<div class="token-info">
  <h2>Token Balance</h2>
  
  {#if $tokenStore.loading}
    <p>Loading...</p>
  {:else if $tokenStore.error}
    <p class="error">Error: {$tokenStore.error.message}</p>
  {:else}
    <p class="balance">{$tokenStore.formattedBalance} SADS</p>
    
    {#if $tokenStore.tokenInfo}
      <div class="info">
        <p>Name: {$tokenStore.tokenInfo.name}</p>
        <p>Symbol: {$tokenStore.tokenInfo.symbol}</p>
        <p>Decimals: {$tokenStore.tokenInfo.decimals}</p>
      </div>
    {/if}
  {/if}

  <button on:click={handleTransfer}>Transfer Tokens</button>
  <button on:click={loadBalance}>Refresh Balance</button>
  <button on:click={loadTokenInfo}>Load Token Info</button>
</div>

<style>
  .balance {
    font-size: 2rem;
    font-weight: bold;
    color: #4f46e5;
  }
  .error {
    color: #dc2626;
  }
</style>
```

### registryStore

Manage publisher and advertiser registrations.

```svelte
<script lang="ts">
  import { registryStore } from '@stackads/svelte';
  import { onMount } from 'svelte';

  const userAddress = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';

  onMount(async () => {
    await registryStore.getPublisher(userAddress);
  });

  async function handleRegister() {
    try {
      const txId = await registryStore.registerPublisher(
        'My Website',
        'https://example.com',
        10000000n // 10 SADS stake
      );
      console.log('Registered:', txId);
      // Refresh publisher info
      await registryStore.getPublisher(userAddress);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  }

  async function updateStats() {
    await registryStore.updatePublisherStats(1000, 50); // 1000 impressions, 50 clicks
  }
</script>

<div class="registry">
  <h2>Publisher Status</h2>

  {#if $registryStore.loading}
    <p>Loading...</p>
  {:else if $registryStore.publisherInfo}
    <div class="publisher-info">
      <p>Name: {$registryStore.publisherInfo.name}</p>
      <p>Website: {$registryStore.publisherInfo.website}</p>
      <p>Reputation: {$registryStore.publisherInfo.reputation}</p>
      <p>Total Impressions: {$registryStore.publisherInfo.totalImpressions}</p>
      <p>Total Clicks: {$registryStore.publisherInfo.totalClicks}</p>
    </div>
  {:else}
    <button on:click={handleRegister}>Register as Publisher</button>
  {/if}
</div>
```

### stakingStore

Manage token staking and rewards.

```svelte
<script lang="ts">
  import { stakingStore } from '@stackads/svelte';
  import { onMount } from 'svelte';

  const userAddress = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';

  onMount(async () => {
    await stakingStore.getStakeInfo(userAddress);
  });

  async function handleStake() {
    try {
      const txId = await stakingStore.stake(5000000n); // Stake 5 SADS
      console.log('Staked:', txId);
      await stakingStore.getStakeInfo(userAddress);
    } catch (error) {
      console.error('Staking failed:', error);
    }
  }

  async function handleUnstake() {
    try {
      const txId = await stakingStore.unstake(2000000n); // Unstake 2 SADS
      console.log('Unstaked:', txId);
      await stakingStore.getStakeInfo(userAddress);
    } catch (error) {
      console.error('Unstaking failed:', error);
    }
  }

  async function handleClaim() {
    try {
      const txId = await stakingStore.claimRewards();
      console.log('Claimed:', txId);
      await stakingStore.getStakeInfo(userAddress);
    } catch (error) {
      console.error('Claim failed:', error);
    }
  }
</script>

<div class="staking">
  <h2>Staking Dashboard</h2>

  {#if $stakingStore.loading}
    <p>Loading...</p>
  {:else if $stakingStore.stakeInfo}
    <div class="stake-info">
      <p class="staked">Staked: {$stakingStore.formattedStake} SADS</p>
      <p>Rewards: {stakingStore.formatAmount($stakingStore.stakeInfo.rewards)} SADS</p>
    </div>
    
    <div class="actions">
      <button on:click={handleStake}>Stake 5 SADS</button>
      <button on:click={handleUnstake}>Unstake 2 SADS</button>
      <button on:click={handleClaim}>Claim Rewards</button>
    </div>
  {/if}
</div>

<style>
  .staked {
    font-size: 1.5rem;
    font-weight: bold;
    color: #4f46e5;
  }
  .actions {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
  }
</style>
```

### campaignStore

Manage advertising campaigns.

```svelte
<script lang="ts">
  import { campaignStore } from '@stackads/svelte';

  let campaignId = 1;

  async function handleCreate() {
    try {
      const txId = await campaignStore.createCampaign(
        'Summer Sale 2024',
        50000000n, // 50 SADS budget
        100000n,   // 0.1 SADS per click
        30         // 30 days duration
      );
      console.log('Campaign created:', txId);
    } catch (error) {
      console.error('Creation failed:', error);
    }
  }

  async function loadCampaign() {
    await campaignStore.getCampaign(campaignId);
  }

  async function handlePause() {
    await campaignStore.pauseCampaign(campaignId);
    await loadCampaign();
  }

  async function handleResume() {
    await campaignStore.resumeCampaign(campaignId);
    await loadCampaign();
  }
</script>

<div class="campaign">
  <h2>Campaign Management</h2>

  {#if $campaignStore.loading}
    <p>Loading...</p>
  {:else if $campaignStore.campaignInfo}
    <div class="campaign-info">
      <p>Name: {$campaignStore.campaignInfo.name}</p>
      <p>Budget: {$campaignStore.campaignInfo.budget}</p>
      <p>Status: {$campaignStore.campaignInfo.active ? 'Active' : 'Paused'}</p>
    </div>

    <div class="actions">
      {#if $campaignStore.campaignInfo.active}
        <button on:click={handlePause}>Pause Campaign</button>
      {:else}
        <button on:click={handleResume}>Resume Campaign</button>
      {/if}
    </div>
  {/if}

  <button on:click={handleCreate}>Create New Campaign</button>
</div>
```

## Complete Example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { tokenStore, registryStore, stakingStore } from '@stackads/svelte';

  const userAddress = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';

  onMount(async () => {
    // Load all data in parallel
    await Promise.all([
      tokenStore.getBalance(userAddress),
      registryStore.getPublisher(userAddress),
      stakingStore.getStakeInfo(userAddress),
    ]);
  });

  async function handleRegister() {
    await registryStore.registerPublisher(
      'My Blog',
      'https://myblog.com',
      10000000n
    );
    await registryStore.getPublisher(userAddress);
  }

  async function handleStake() {
    await stakingStore.stake(5000000n);
    await stakingStore.getStakeInfo(userAddress);
  }
</script>

<div class="dashboard">
  <h1>StackAds Dashboard</h1>

  {#if $tokenStore.loading || $registryStore.loading || $stakingStore.loading}
    <div class="loading">Loading...</div>
  {:else}
    <div class="content">
      <!-- Token Balance -->
      <section class="card">
        <h2>Token Balance</h2>
        <p class="balance">{$tokenStore.formattedBalance} SADS</p>
      </section>

      <!-- Publisher Info -->
      <section class="card">
        <h2>Publisher Status</h2>
        {#if $registryStore.publisherInfo}
          <div>
            <p>Name: {$registryStore.publisherInfo.name}</p>
            <p>Website: {$registryStore.publisherInfo.website}</p>
            <p>Reputation: {$registryStore.publisherInfo.reputation}</p>
            <p>Impressions: {$registryStore.publisherInfo.totalImpressions}</p>
            <p>Clicks: {$registryStore.publisherInfo.totalClicks}</p>
          </div>
        {:else}
          <button on:click={handleRegister}>Register as Publisher</button>
        {/if}
      </section>

      <!-- Staking Info -->
      <section class="card">
        <h2>Staking</h2>
        {#if $stakingStore.stakeInfo}
          <p>Staked: {$stakingStore.formattedStake} SADS</p>
          <button on:click={handleStake}>Stake 5 SADS</button>
        {/if}
      </section>
    </div>
  {/if}
</div>

<style>
  .dashboard {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  .loading {
    text-align: center;
    padding: 2rem;
  }

  .content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  .card {
    background: white;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .balance {
    font-size: 2rem;
    font-weight: bold;
    color: #4f46e5;
  }

  button {
    background: #4f46e5;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    cursor: pointer;
    font-size: 1rem;
  }

  button:hover {
    background: #4338ca;
  }
</style>
```

## SvelteKit Integration

### +layout.svelte

```svelte
<script lang="ts">
  import { initStackAds } from '@stackads/svelte';
  import { onMount } from 'svelte';

  onMount(() => {
    initStackAds({
      network: 'testnet',
      contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      contractName: 'stackads-token',
    });
  });
</script>

<slot />
```

### +page.ts (Load Data)

```typescript
import { tokenStore, registryStore } from '@stackads/svelte';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
  const userAddress = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';

  await Promise.all([
    tokenStore.getBalance(userAddress),
    registryStore.getPublisher(userAddress),
  ]);

  return {};
};
```

## Reactive Statements

Use Svelte's reactive statements with stores:

```svelte
<script lang="ts">
  import { tokenStore } from '@stackads/svelte';

  $: balance = $tokenStore.balance;
  $: hasBalance = balance !== null && balance > 0n;
  $: canTransfer = hasBalance && !$tokenStore.loading;
</script>

{#if canTransfer}
  <button>Transfer Available</button>
{/if}
```

## TypeScript Support

All stores are fully typed:

```typescript
import type {
  StackAdsConfig,
  PublisherInfo,
  AdvertiserInfo,
  StakeInfo,
  CampaignInfo,
} from '@stackads/svelte';
```

## Error Handling

Handle errors from store operations:

```svelte
<script lang="ts">
  import { tokenStore } from '@stackads/svelte';

  async function transfer() {
    try {
      await tokenStore.transfer('ST2...', 1000000n);
    } catch (error) {
      console.error('Transfer failed:', error);
      // Show error notification
    }
  }

  $: if ($tokenStore.error) {
    console.error('Store error:', $tokenStore.error);
  }
</script>
```

## License

MIT
