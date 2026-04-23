export default function SvelteSDKPage() {
  return (
    <div className="prose">
      <h1>Svelte SDK</h1>
      <p className="lead">
        Svelte stores for the StackAds decentralized advertising platform on Stacks blockchain.
      </p>

      <h2>Installation</h2>
      <pre><code>{`npm install @stackads/svelte @stackads/sdk-core
# or
pnpm add @stackads/svelte @stackads/sdk-core`}</code></pre>

      <h2>Setup</h2>
      <h3>Initialize StackAds</h3>
      <pre><code>{`// src/lib/stackads.ts or +layout.svelte
import { initStackAds } from '@stackads/svelte';

initStackAds({
  network: 'testnet', // or 'mainnet'
  contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  contractName: 'stackads-token',
});`}</code></pre>

      <h3>Use Stores in Components</h3>
      <pre><code>{`<script lang="ts">
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
{/if}`}</code></pre>

      <h2>Stores</h2>

      <h3>tokenStore</h3>
      <p>Interact with the StackAds token contract.</p>
      <pre><code>{`<script lang="ts">
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
</script>

<div class="token-info">
  <h2>Token Balance</h2>
  
  {#if $tokenStore.loading}
    <p>Loading...</p>
  {:else if $tokenStore.error}
    <p class="error">Error: {$tokenStore.error.message}</p>
  {:else}
    <p class="balance">{$tokenStore.formattedBalance} SADS</p>
  {/if}

  <button on:click={handleTransfer}>Transfer Tokens</button>
</div>`}</code></pre>

      <h3>registryStore</h3>
      <p>Manage publisher and advertiser registrations.</p>
      <pre><code>{`<script lang="ts">
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
      await registryStore.getPublisher(userAddress);
    } catch (error) {
      console.error('Registration failed:', error);
    }
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
    </div>
  {:else}
    <button on:click={handleRegister}>Register as Publisher</button>
  {/if}
</div>`}</code></pre>

      <h3>stakingStore</h3>
      <p>Manage token staking and rewards.</p>
      <pre><code>{`<script lang="ts">
  import { stakingStore } from '@stackads/svelte';
  import { onMount } from 'svelte';

  const userAddress = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';

  onMount(async () => {
    await stakingStore.getStakeInfo(userAddress);
  });

  async function handleStake() {
    try {
      const txId = await stakingStore.stake(5000000n);
      console.log('Staked:', txId);
      await stakingStore.getStakeInfo(userAddress);
    } catch (error) {
      console.error('Staking failed:', error);
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
      <button on:click={handleStake}>Stake 5 SADS</button>
    </div>
  {/if}
</div>`}</code></pre>

      <h3>campaignStore</h3>
      <p>Manage advertising campaigns.</p>
      <pre><code>{`<script lang="ts">
  import { campaignStore } from '@stackads/svelte';

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
</script>`}</code></pre>

      <h2>SvelteKit Integration</h2>
      <pre><code>{`// +layout.svelte
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

<slot />`}</code></pre>

      <h2>TypeScript Support</h2>
      <p>All stores are fully typed:</p>
      <pre><code>{`import type {
  StackAdsConfig,
  PublisherInfo,
  AdvertiserInfo,
  StakeInfo,
  CampaignInfo,
} from '@stackads/svelte';`}</code></pre>
    </div>
  );
}
