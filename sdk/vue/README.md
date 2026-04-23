# @stackads/vue

Vue 3 composables for the StackAds decentralized advertising platform on Stacks blockchain.

## Installation

```bash
npm install @stackads/vue @stackads/sdk-core @stacks/connect @stacks/transactions
# or
pnpm add @stackads/vue @stackads/sdk-core @stacks/connect @stacks/transactions
# or
yarn add @stackads/vue @stackads/sdk-core @stacks/connect @stacks/transactions
```

## Setup

### 1. Install the Plugin

```typescript
// main.ts
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

app.mount('#app');
```

### 2. Use Composables in Components

```vue
<script setup lang="ts">
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
</template>
```

## Composables

### useToken

Interact with the StackAds token contract.

```vue
<script setup lang="ts">
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

// Get token info
const fetchTokenInfo = async () => {
  await getTokenInfo();
};
</script>
```

### useRegistry

Manage publisher and advertiser registrations.

```vue
<script setup lang="ts">
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
  slashUser,
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

// Update stats
const updateStats = async () => {
  await updatePublisherStats(1000, 50); // 1000 impressions, 50 clicks
};
</script>
```

### useStaking

Manage token staking and rewards.

```vue
<script setup lang="ts">
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
  getPendingRewards,
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

// Get stake info
const fetchStakeInfo = async (address: string) => {
  await getStakeInfo(address);
};
</script>

<template>
  <div>
    <p>Staked: {{ formattedStake }} SADS</p>
    <button @click="stakeTokens" :disabled="loading">Stake</button>
    <button @click="unstakeTokens" :disabled="loading">Unstake</button>
    <button @click="claim" :disabled="loading">Claim Rewards</button>
  </div>
</template>
```

### useCampaign

Manage advertising campaigns.

```vue
<script setup lang="ts">
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
  recordImpression,
  recordClick,
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

// Get campaign details
const fetchCampaign = async (id: number) => {
  await getCampaign(id);
};

// Fund campaign
const addFunds = async (id: number) => {
  await fundCampaign(id, 10000000n); // Add 10 SADS
};

// Pause/Resume
const toggleCampaign = async (id: number, isPaused: boolean) => {
  if (isPaused) {
    await resumeCampaign(id);
  } else {
    await pauseCampaign(id);
  }
};
</script>
```

## Complete Example

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useToken, useRegistry, useStaking } from '@stackads/vue';

// Token operations
const {
  balance,
  formattedBalance,
  getBalance,
  transfer,
} = useToken();

// Registry operations
const {
  publisherInfo,
  registerPublisher,
  getPublisher,
} = useRegistry();

// Staking operations
const {
  stakeInfo,
  formattedStake,
  stake,
  getStakeInfo,
} = useStaking();

const userAddress = ref('ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM');
const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  try {
    await Promise.all([
      getBalance(userAddress.value),
      getPublisher(userAddress.value),
      getStakeInfo(userAddress.value),
    ]);
  } finally {
    loading.value = false;
  }
});

const handleRegister = async () => {
  await registerPublisher(
    'My Blog',
    'https://myblog.com',
    10000000n
  );
  await getPublisher(userAddress.value);
};

const handleStake = async () => {
  await stake(5000000n);
  await getStakeInfo(userAddress.value);
};
</script>

<template>
  <div class="dashboard">
    <h1>StackAds Dashboard</h1>

    <div v-if="loading" class="loading">
      Loading...
    </div>

    <div v-else class="content">
      <!-- Token Balance -->
      <section class="card">
        <h2>Token Balance</h2>
        <p class="balance">{{ formattedBalance }} SADS</p>
      </section>

      <!-- Publisher Info -->
      <section class="card">
        <h2>Publisher Status</h2>
        <div v-if="publisherInfo">
          <p>Name: {{ publisherInfo.name }}</p>
          <p>Website: {{ publisherInfo.website }}</p>
          <p>Reputation: {{ publisherInfo.reputation }}</p>
          <p>Total Impressions: {{ publisherInfo.totalImpressions }}</p>
          <p>Total Clicks: {{ publisherInfo.totalClicks }}</p>
        </div>
        <button v-else @click="handleRegister">
          Register as Publisher
        </button>
      </section>

      <!-- Staking Info -->
      <section class="card">
        <h2>Staking</h2>
        <p>Staked: {{ formattedStake }} SADS</p>
        <button @click="handleStake">Stake 5 SADS</button>
      </section>
    </div>
  </div>
</template>

<style scoped>
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

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
```

## Pinia Store Integration

You can also use StackAds with Pinia stores:

```typescript
// stores/stackads.ts
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

    async registerPublisher(
      client: RegistryClient,
      name: string,
      website: string,
      stake: bigint
    ) {
      this.loading = true;
      try {
        const txId = await client.registerPublisher(name, website, stake);
        return txId;
      } catch (error) {
        this.error = error;
        throw error;
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
});
```

## TypeScript Support

All composables are fully typed with TypeScript:

```typescript
import type {
  StackAdsConfig,
  PublisherInfo,
  AdvertiserInfo,
  StakeInfo,
  CampaignInfo,
} from '@stackads/vue';
```

## Error Handling

All composables expose an `error` ref that contains any errors:

```vue
<script setup lang="ts">
import { useToken } from '@stackads/vue';
import { watch } from 'vue';

const { error, getBalance } = useToken();

watch(error, (newError) => {
  if (newError) {
    console.error('Token error:', newError.message);
    // Show toast notification, etc.
  }
});
</script>
```

## License

MIT
