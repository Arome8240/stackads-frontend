# @stackads/nextjs

Next.js integration for StackAds SDK with App Router support.

## Installation

```bash
npm install @stackads/nextjs @stackads/sdk-core
# or
yarn add @stackads/nextjs @stackads/sdk-core
# or
pnpm add @stackads/nextjs @stackads/sdk-core
```

## Setup

### App Router Setup

Create a client component provider:

```tsx
// app/providers.tsx
'use client';

import { StackAdsProvider } from '@stackads/nextjs';
import { StacksTestnet } from '@stacks/network';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StackAdsProvider
      config={{
        network: new StacksTestnet(),
        contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      }}
    >
      {children}
    </StackAdsProvider>
  );
}
```

Use in your root layout:

```tsx
// app/layout.tsx
import { Providers } from './providers';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

## Client Components

### TokenBalance

Display token balance with automatic loading states:

```tsx
'use client';

import { TokenBalance } from '@stackads/nextjs';

export function UserBalance({ address }: { address: string }) {
  return (
    <div>
      <h2>Your Balance</h2>
      <TokenBalance
        address={address}
        showRaw={true}
        className="text-2xl font-bold"
        loadingComponent={<span>Loading balance...</span>}
        errorComponent={(error) => <span>Error: {error.message}</span>}
      />
    </div>
  );
}
```

### CampaignCard

Display campaign information:

```tsx
'use client';

import { CampaignCard } from '@stackads/nextjs';

export function Campaign({ id }: { id: number }) {
  return (
    <CampaignCard
      campaignId={id}
      showMetrics={true}
      className="border rounded-lg p-4 shadow"
    />
  );
}
```

### StakingDashboard

Complete staking dashboard:

```tsx
'use client';

import { StakingDashboard } from '@stackads/nextjs';

export function MyStaking({ address }: { address: string }) {
  return (
    <StakingDashboard
      address={address}
      className="max-w-4xl mx-auto"
    />
  );
}
```

## Server Components

Use server-side utilities in Server Components and API routes:

```tsx
// app/campaign/[id]/page.tsx
import { getStackAdsSDK, getCampaign } from '@stackads/nextjs/server';
import { StacksTestnet } from '@stacks/network';

export default async function CampaignPage({
  params,
}: {
  params: { id: string };
}) {
  const sdk = getStackAdsSDK({
    network: new StacksTestnet(),
    contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  });

  const campaign = await getCampaign(sdk, parseInt(params.id));

  if (!campaign) {
    return <div>Campaign not found</div>;
  }

  return (
    <div>
      <h1>Campaign #{params.id}</h1>
      <p>Budget: {campaign.budget.toString()}</p>
      <p>Spent: {campaign.spent.toString()}</p>
      <p>Status: {campaign.status}</p>
    </div>
  );
}
```

## API Routes

### App Router API Routes

```tsx
// app/api/balance/[address]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getStackAdsSDK, getTokenBalance, formatError } from '@stackads/nextjs/server';
import { StacksTestnet } from '@stacks/network';

export async function GET(
  request: NextRequest,
  { params }: { params: { address: string } }
) {
  try {
    const sdk = getStackAdsSDK({
      network: new StacksTestnet(),
      contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
    });

    const { balance, formatted } = await getTokenBalance(sdk, params.address);

    return NextResponse.json({
      address: params.address,
      balance: balance.toString(),
      formatted,
    });
  } catch (error) {
    return NextResponse.json(formatError(error), { status: 500 });
  }
}
```

### Campaign Stats API

```tsx
// app/api/campaign/[id]/stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getStackAdsSDK, getCampaignMetrics } from '@stackads/nextjs/server';
import { StacksTestnet } from '@stacks/network';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const sdk = getStackAdsSDK({
    network: new StacksTestnet(),
    contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
  });

  const metrics = await getCampaignMetrics(sdk, parseInt(params.id));

  return NextResponse.json(metrics);
}
```

## Server Actions

Use with Next.js Server Actions:

```tsx
// app/actions/staking.ts
'use server';

import { getStackAdsSDK, getStakingInfo } from '@stackads/nextjs/server';
import { StacksTestnet } from '@stacks/network';

export async function fetchStakingInfo(address: string) {
  const sdk = getStackAdsSDK({
    network: new StacksTestnet(),
    contractAddress: process.env.CONTRACT_ADDRESS!,
  });

  return await getStakingInfo(sdk, address);
}
```

Use in a Client Component:

```tsx
'use client';

import { useState } from 'react';
import { fetchStakingInfo } from './actions/staking';

export function StakingInfo({ address }: { address: string }) {
  const [info, setInfo] = useState(null);

  const loadInfo = async () => {
    const data = await fetchStakingInfo(address);
    setInfo(data);
  };

  return (
    <div>
      <button onClick={loadInfo}>Load Staking Info</button>
      {info && <pre>{JSON.stringify(info, null, 2)}</pre>}
    </div>
  );
}
```

## Hooks

All React hooks from `@stackads/react` are available:

```tsx
'use client';

import {
  useTokenBalance,
  useStakingInfo,
  useCampaign,
  useRegisterPublisher,
} from '@stackads/nextjs';

export function MyComponent() {
  const { balance, loading } = useTokenBalance(address);
  const { stakingInfo } = useStakingInfo(address);
  const { campaign } = useCampaign(campaignId);
  const { register } = useRegisterPublisher();

  // ... use hooks
}
```

## Server-Side Data Fetching

### Batch Operations

```tsx
import { getStackAdsSDK, getBatchBalances } from '@stackads/nextjs/server';

export default async function Leaderboard() {
  const sdk = getStackAdsSDK(config);
  const addresses = ['ST1...', 'ST2...', 'ST3...'];
  
  const balances = await getBatchBalances(sdk, addresses);

  return (
    <div>
      {Array.from(balances.entries()).map(([addr, bal]) => (
        <div key={addr}>
          {addr}: {bal.toString()}
        </div>
      ))}
    </div>
  );
}
```

### Platform Statistics

```tsx
import { getStackAdsSDK, getPlatformStats } from '@stackads/nextjs/server';

export default async function Stats() {
  const sdk = getStackAdsSDK(config);
  const stats = await getPlatformStats(sdk);

  return (
    <div>
      <p>Publishers: {stats.publisherCount}</p>
      <p>Advertisers: {stats.advertiserCount}</p>
      <p>Total Supply: {stats.totalSupply.toString()}</p>
    </div>
  );
}
```

## Environment Variables

```env
# .env.local
NEXT_PUBLIC_CONTRACT_ADDRESS=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
NEXT_PUBLIC_NETWORK=testnet
```

## TypeScript Support

Full TypeScript support with all types:

```tsx
import type {
  Campaign,
  Participant,
  StakingInfo,
  TransactionResult,
} from '@stackads/nextjs';
```

## Best Practices

1. **Use Server Components for initial data**: Fetch data on the server for better performance
2. **Use Client Components for interactivity**: Use hooks for real-time updates
3. **Cache SDK instances**: Use the provided `getStackAdsSDK` with React cache
4. **Handle errors gracefully**: Always provide error states in UI
5. **Use environment variables**: Keep contract addresses in env vars

## License

MIT

## Links

- [Core SDK](https://www.npmjs.com/package/@stackads/sdk-core)
- [React SDK](https://www.npmjs.com/package/@stackads/react)
- [GitHub](https://github.com/stackads/stackads-sdk)
