export default function IntegrationGuidePage() {
  return (
    <div className="prose">
      <h1>Integration Guide</h1>
      <p className="lead">
        Step-by-step guide to integrate StackAds into your application across different frameworks and platforms.
      </p>

      <h2>Overview</h2>
      <p>
        StackAds provides SDKs for all major frameworks. This guide covers installation, configuration, 
        and common integration patterns.
      </p>

      <h2>Quick Start</h2>

      <h3>1. Choose Your SDK</h3>
      <ul>
        <li>React/Next.js: @stackads/react or @stackads/nextjs</li>
        <li>Vue: @stackads/vue</li>
        <li>Angular: @stackads/angular</li>
        <li>Svelte: @stackads/svelte</li>
        <li>Vanilla JS: @stackads/vanilla</li>
        <li>Core (any framework): @stackads/sdk-core</li>
      </ul>

      <h3>2. Install Dependencies</h3>
      <pre><code>{`# React
npm install @stackads/react @stackads/sdk-core

# Next.js
npm install @stackads/nextjs @stackads/sdk-core

# Vue
npm install @stackads/vue @stackads/sdk-core

# Angular
npm install @stackads/angular @stackads/sdk-core

# Svelte
npm install @stackads/svelte @stackads/sdk-core

# Vanilla JS
npm install @stackads/vanilla`}</code></pre>

      <h3>3. Configure SDK</h3>
      <pre><code>{`const config = {
  network: 'testnet', // or 'mainnet'
  contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  contractName: 'stackads-token'
};`}</code></pre>

      <h2>React Integration</h2>

      <h3>Setup Provider</h3>
      <pre><code>{`// app.tsx
import { StackAdsProvider } from '@stackads/react';

function App() {
  return (
    <StackAdsProvider config={{
      network: 'testnet',
      contractAddress: process.env.REACT_APP_CONTRACT_ADDRESS
    }}>
      <YourApp />
    </StackAdsProvider>
  );
}`}</code></pre>

      <h3>Use Hooks</h3>
      <pre><code>{`import { useTokenBalance, useRegisterPublisher } from '@stackads/react';

function Dashboard() {
  const { balance, loading } = useTokenBalance(address);
  const { register } = useRegisterPublisher();

  return (
    <div>
      <p>Balance: {balance} SADS</p>
      <button onClick={() => register('My Site', 'https://example.com', 100000000n)}>
        Register
      </button>
    </div>
  );
}`}</code></pre>

      <h2>Next.js Integration</h2>

      <h3>App Router Setup</h3>
      <pre><code>{`// app/providers.tsx
'use client';

import { StackAdsProvider } from '@stackads/nextjs';

export function Providers({ children }) {
  return (
    <StackAdsProvider config={{
      network: process.env.NEXT_PUBLIC_NETWORK,
      contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
    }}>
      {children}
    </StackAdsProvider>
  );
}

// app/layout.tsx
import { Providers } from './providers';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}`}</code></pre>

      <h3>Server Components</h3>
      <pre><code>{`// app/campaign/[id]/page.tsx
import { getStackAdsSDK, getCampaign } from '@stackads/nextjs/server';

export default async function CampaignPage({ params }) {
  const sdk = getStackAdsSDK({
    network: 'testnet',
    contractAddress: process.env.CONTRACT_ADDRESS
  });

  const campaign = await getCampaign(sdk, parseInt(params.id));

  return (
    <div>
      <h1>{campaign.name}</h1>
      <p>Budget: {campaign.budget}</p>
    </div>
  );
}`}</code></pre>

      <h2>Vue Integration</h2>

      <h3>Install Plugin</h3>
      <pre><code>{`// main.ts
import { createApp } from 'vue';
import { StackAdsPlugin } from '@stackads/vue';
import App from './App.vue';

const app = createApp(App);

app.use(StackAdsPlugin, {
  config: {
    network: 'testnet',
    contractAddress: import.meta.env.VITE_CONTRACT_ADDRESS
  }
});

app.mount('#app');`}</code></pre>

      <h3>Use Composables</h3>
      <pre><code>{`<script setup lang="ts">
import { useToken, useRegistry } from '@stackads/vue';

const { balance, getBalance } = useToken();
const { registerPublisher } = useRegistry();

onMounted(async () => {
  await getBalance(address.value);
});
</script>

<template>
  <div>
    <p>Balance: {{ balance }} SADS</p>
  </div>
</template>`}</code></pre>

      <h2>Angular Integration</h2>

      <h3>Configure Module</h3>
      <pre><code>{`// app.module.ts
import { StackAdsConfigService } from '@stackads/angular';

@NgModule({
  providers: [
    ...StackAdsConfigService.forRoot({
      network: 'testnet',
      contractAddress: environment.contractAddress
    }).providers
  ]
})
export class AppModule {}`}</code></pre>

      <h3>Use Services</h3>
      <pre><code>{`import { Component } from '@angular/core';
import { TokenService } from '@stackads/angular';

@Component({
  selector: 'app-dashboard',
  template: \`
    <div *ngIf="tokenService.balance$ | async as balance">
      Balance: {{ tokenService.formatAmount(balance) }} SADS
    </div>
  \`
})
export class DashboardComponent {
  constructor(public tokenService: TokenService) {}

  ngOnInit() {
    this.tokenService.getBalance(address).subscribe();
  }
}`}</code></pre>

      <h2>Svelte Integration</h2>

      <h3>Initialize</h3>
      <pre><code>{`// +layout.svelte
<script lang="ts">
  import { initStackAds } from '@stackads/svelte';
  import { onMount } from 'svelte';

  onMount(() => {
    initStackAds({
      network: 'testnet',
      contractAddress: import.meta.env.VITE_CONTRACT_ADDRESS
    });
  });
</script>

<slot />`}</code></pre>

      <h3>Use Stores</h3>
      <pre><code>{`<script lang="ts">
  import { tokenStore } from '@stackads/svelte';
  import { onMount } from 'svelte';

  onMount(async () => {
    await tokenStore.getBalance(address);
  });
</script>

{#if $tokenStore.loading}
  <p>Loading...</p>
{:else}
  <p>Balance: {$tokenStore.formattedBalance} SADS</p>
{/if}`}</code></pre>

      <h2>Vanilla JS Integration</h2>

      <h3>ES Modules</h3>
      <pre><code>{`import StackAds from '@stackads/vanilla';

const stackads = new StackAds({
  network: 'testnet',
  contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
});

// Get balance
const balance = await stackads.getBalance(address);
console.log('Balance:', stackads.formatAmount(balance));`}</code></pre>

      <h3>CDN (Browser)</h3>
      <pre><code>{`<script src="https://unpkg.com/@stackads/vanilla@latest/dist/index.global.js"></script>
<script>
  const stackads = new StackAds.default({
    network: 'testnet',
    contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
  });

  async function loadBalance() {
    const balance = await stackads.getBalance(address);
    document.getElementById('balance').textContent = 
      stackads.formatAmount(balance) + ' SADS';
  }

  loadBalance();
</script>`}</code></pre>

      <h2>Environment Configuration</h2>

      <h3>Environment Variables</h3>
      <pre><code>{`# .env.local (Next.js)
NEXT_PUBLIC_NETWORK=testnet
NEXT_PUBLIC_CONTRACT_ADDRESS=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM

# .env (React)
REACT_APP_NETWORK=testnet
REACT_APP_CONTRACT_ADDRESS=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM

# .env (Vue/Vite)
VITE_NETWORK=testnet
VITE_CONTRACT_ADDRESS=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM

# environment.ts (Angular)
export const environment = {
  network: 'testnet',
  contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
};`}</code></pre>

      <h3>Network Configuration</h3>
      <pre><code>{`// Testnet
network: 'testnet'

// Mainnet
network: 'mainnet'

// Custom network
import { StacksTestnet } from '@stacks/network';

const network = new StacksTestnet();
network.coreApiUrl = 'https://custom-api.example.com';`}</code></pre>

      <h2>Common Integration Patterns</h2>

      <h3>Wallet Connection</h3>
      <pre><code>{`import { useConnect } from '@stacks/connect-react';

function ConnectButton() {
  const { doOpenAuth } = useConnect();

  const handleConnect = () => {
    doOpenAuth();
  };

  return <button onClick={handleConnect}>Connect Wallet</button>;
}`}</code></pre>

      <h3>Transaction Handling</h3>
      <pre><code>{`import { useTransaction } from '@stackads/react';

function TransferButton() {
  const { execute, loading, error } = useTransaction();

  const handleTransfer = async () => {
    try {
      const txId = await execute(async (sdk) => {
        return await sdk.token.transfer(
          recipient,
          amount,
          'Transfer memo'
        );
      });
      console.log('Transaction:', txId);
    } catch (err) {
      console.error('Failed:', err);
    }
  };

  return (
    <div>
      <button onClick={handleTransfer} disabled={loading}>
        Transfer
      </button>
      {error && <p>Error: {error.message}</p>}
    </div>
  );
}`}</code></pre>

      <h3>Error Handling</h3>
      <pre><code>{`try {
  await sdk.token.transfer(recipient, amount);
} catch (error) {
  if (error.message.includes('insufficient balance')) {
    // Handle insufficient balance
  } else if (error.message.includes('user rejected')) {
    // Handle user rejection
  } else {
    // Handle other errors
  }
}`}</code></pre>

      <h2>Testing Integration</h2>

      <h3>Unit Tests</h3>
      <pre><code>{`import { render, screen } from '@testing-library/react';
import { StackAdsProvider } from '@stackads/react';

test('displays balance', async () => {
  render(
    <StackAdsProvider config={testConfig}>
      <Dashboard />
    </StackAdsProvider>
  );

  const balance = await screen.findByText(/Balance:/);
  expect(balance).toBeInTheDocument();
});`}</code></pre>

      <h3>Integration Tests</h3>
      <pre><code>{`describe('Publisher Registration', () => {
  it('should register successfully', async () => {
    const sdk = createTestSDK();
    
    const txId = await sdk.registry.registerPublisher(
      'Test Site',
      'https://test.com',
      100000000n
    );
    
    expect(txId).toBeDefined();
    
    const publisher = await sdk.registry.getPublisher(address);
    expect(publisher.name).toBe('Test Site');
  });
});`}</code></pre>

      <h2>Performance Optimization</h2>

      <h3>Caching</h3>
      <pre><code>{`// Cache SDK instance
const sdk = useMemo(() => createStackAdsSDK(config), [config]);

// Cache query results
const { data, isLoading } = useQuery(
  ['balance', address],
  () => sdk.token.getBalance(address),
  { staleTime: 60000 } // Cache for 1 minute
);`}</code></pre>

      <h3>Lazy Loading</h3>
      <pre><code>{`// Lazy load SDK
const StackAdsProvider = lazy(() => import('@stackads/react'));

// Code splitting
const Dashboard = lazy(() => import('./Dashboard'));`}</code></pre>

      <h2>Security Best Practices</h2>

      <h3>Environment Variables</h3>
      <ul>
        <li>Never commit .env files</li>
        <li>Use different keys for dev/prod</li>
        <li>Validate all inputs</li>
        <li>Use HTTPS in production</li>
      </ul>

      <h3>Transaction Security</h3>
      <ul>
        <li>Always validate amounts</li>
        <li>Check user authorization</li>
        <li>Implement rate limiting</li>
        <li>Log all transactions</li>
      </ul>

      <h2>Troubleshooting</h2>

      <h3>Common Issues</h3>

      <h4>SDK Not Initializing</h4>
      <ul>
        <li>Check network configuration</li>
        <li>Verify contract address</li>
        <li>Ensure dependencies installed</li>
      </ul>

      <h4>Transactions Failing</h4>
      <ul>
        <li>Check wallet connection</li>
        <li>Verify sufficient STX for gas</li>
        <li>Check contract permissions</li>
      </ul>

      <h4>Type Errors</h4>
      <ul>
        <li>Install @types packages</li>
        <li>Check TypeScript version</li>
        <li>Update SDK to latest version</li>
      </ul>

      <h2>Next Steps</h2>
      <ol>
        <li>Choose your framework SDK</li>
        <li>Install dependencies</li>
        <li>Configure environment</li>
        <li>Implement basic features</li>
        <li>Add error handling</li>
        <li>Test thoroughly</li>
        <li>Deploy to production</li>
      </ol>
    </div>
  );
}
