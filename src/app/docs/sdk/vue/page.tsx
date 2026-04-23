export default function VueSDKPage() {
  return (
    <div className="prose">
      <h1>Vue SDK</h1>
      <p className="lead">
        Vue 3 composables for the StackAds decentralized advertising platform on Stacks blockchain.
      </p>

      <h2>Installation</h2>
      <pre><code>{`npm install @stackads/vue @stackads/sdk-core
# or
pnpm add @stackads/vue @stackads/sdk-core`}</code></pre>

      <h2>Setup</h2>
      <h3>Install the Plugin</h3>
      <pre><code>{`// main.ts
import { createApp } from 'vue';
import { StackAdsPlugin } from '@stackads/vue';
import App from './App.vue';

const app = createApp(App);

app.use(StackAdsPlugin, {
  config: {
    network: 'testnet', // or 'mainnet'
    contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
    contractName: 'stackads-token',
  },
});

app.mount('#app');`}</code></pre>

      <h3>Use Composables in Components</h3>
      <pre><code>{`<script setup lang="ts">
import { useToken } from '@stackads/vue';
import { ref, onMounted } from 'vue';

const { balance, loading, error, getBalance, formattedBalance } = useToken();
const userAddress = ref('ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM');

onMounted(async () => {
  await getBalance(userAddress.value);
});
</script>

<template>
  <div>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>
    <div v-else>
      <p>Balance: {{ formattedBalance }} SADS</p>
    </div>
  </div>
</template>`}</code></pre>

      <h2>Composables</h2>

      <h3>useToken</h3>
      <p>Interact with the StackAds token contract.</p>
      <pre><code>{`<script setup lang="ts">
import { useToken } from '@stackads/vue';

const {
  balance,
  tokenInfo,
  loading,
  error,
  formattedBalance,
  getBalance,
  transfer,
  getTokenInfo,
} = useToken();

// Get balance
const fetchBalance = async () => {
  await getBalance('ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM');
};

// Transfer tokens
const sendTokens = async () => {
  const txId = await transfer(
    'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG',
    1000000n, // 1 SADS (6 decimals)
    'Payment for services'
  );
  console.log('Transaction ID:', txId);
};
</script>`}</code></pre>

      <h3>useRegistry</h3>
      <p>Manage publisher and advertiser registrations.</p>
      <pre><code>{`<script setup lang="ts">
import { useRegistry } from '@stackads/vue';

const {
  publisherInfo,
  advertiserInfo,
  loading,
  error,
  registerPublisher,
  getPublisher,
  registerAdvertiser,
  getAdvertiser,
  updatePublisherStats,
} = useRegistry();

// Register as publisher
const register = async () => {
  const txId = await registerPublisher(
    'My Website',
    'https://example.com',
    10000000n // 10 SADS stake
  );
  console.log('Registered:', txId);
};

// Get publisher info
const fetchPublisher = async (address: string) => {
  await getPublisher(address);
};
</script>`}</code></pre>

      <h3>useStaking</h3>
      <p>Manage token staking and rewards.</p>
      <pre><code>{`<script setup lang="ts">
import { useStaking } from '@stackads/vue';

const {
  stakeInfo,
  loading,
  error,
  stakedAmount,
  formattedStake,
  stake,
  unstake,
  getStakeInfo,
  claimRewards,
} = useStaking();

// Stake tokens
const stakeTokens = async () => {
  const txId = await stake(5000000n); // Stake 5 SADS
  console.log('Staked:', txId);
};

// Unstake tokens
const unstakeTokens = async () => {
  const txId = await unstake(2000000n); // Unstake 2 SADS
  console.log('Unstaked:', txId);
};

// Claim rewards
const claim = async () => {
  const txId = await claimRewards();
  console.log('Claimed:', txId);
};
</script>

<template>
  <div>
    <p>Staked: {{ formattedStake }} SADS</p>
    <button @click="stakeTokens" :disabled="loading">Stake</button>
    <button @click="unstakeTokens" :disabled="loading">Unstake</button>
    <button @click="claim" :disabled="loading">Claim Rewards</button>
  </div>
</template>`}</code></pre>

      <h3>useCampaign</h3>
      <p>Manage advertising campaigns.</p>
      <pre><code>{`<script setup lang="ts">
import { useCampaign } from '@stackads/vue';

const {
  campaignInfo,
  campaigns,
  loading,
  error,
  createCampaign,
  getCampaign,
  fundCampaign,
  pauseCampaign,
  resumeCampaign,
} = useCampaign();

// Create campaign
const create = async () => {
  const txId = await createCampaign(
    'Summer Sale 2024',
    50000000n, // 50 SADS budget
    100000n,   // 0.1 SADS per click
    30         // 30 days duration
  );
  console.log('Campaign created:', txId);
};
</script>`}</code></pre>

      <h2>Pinia Store Integration</h2>
      <p>You can also use StackAds with Pinia stores:</p>
      <pre><code>{`// stores/stackads.ts
import { defineStore } from 'pinia';
import { TokenClient, RegistryClient } from '@stackads/sdk-core';

export const useStackAdsStore = defineStore('stackads', {
  state: () => ({
    balance: 0n,
    publisherInfo: null,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchBalance(client: TokenClient, address: string) {
      this.loading = true;
      try {
        this.balance = await client.getBalance(address);
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },
  },

  getters: {
    formattedBalance: (state) => {
      return (Number(state.balance) / 1_000_000).toFixed(6);
    },
  },
});`}</code></pre>

      <h2>TypeScript Support</h2>
      <p>All composables are fully typed with TypeScript:</p>
      <pre><code>{`import type {
  StackAdsConfig,
  PublisherInfo,
  AdvertiserInfo,
  StakeInfo,
  CampaignInfo,
} from '@stackads/vue';`}</code></pre>

      <h2>Error Handling</h2>
      <p>All composables expose an error ref that contains any errors:</p>
      <pre><code>{`<script setup lang="ts">
import { useToken } from '@stackads/vue';
import { watch } from 'vue';

const { error, getBalance } = useToken();

watch(error, (newError) => {
  if (newError) {
    console.error('Token error:', newError.message);
    // Show toast notification, etc.
  }
});
</script>`}</code></pre>
    </div>
  );
}
