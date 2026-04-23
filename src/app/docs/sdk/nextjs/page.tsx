export default function NextJSSDKPage() {
  return (
    <div className="prose">
      <h1>Next.js SDK</h1>
      <p className="lead">
        Next.js integration for StackAds SDK with App Router support, Server Components, and Server Actions.
      </p>

      <h2>Installation</h2>
      <pre><code>{`npm install @stackads/nextjs @stackads/sdk-core
# or
pnpm add @stackads/nextjs @stackads/sdk-core`}</code></pre>

      <h2>Setup</h2>
      
      <h3>App Router Setup</h3>
      <p>Create a client component provider:</p>
      <pre><code>{`// app/providers.tsx
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
}`}</code></pre>

      <p>Use in your root layout:</p>
      <pre><code>{`// app/layout.tsx
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
}`}</code></pre>

      <h2>Client Components</h2>

      <h3>TokenBalance</h3>
      <p>Display token balance with automatic loading states:</p>
      <pre><code>{`'use client';

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
}`}</code></pre>

      <h3>CampaignCard</h3>
      <p>Display campaign information:</p>
      <pre><code>{`'use client';

import { CampaignCard } from '@stackads/nextjs';

export function Campaign({ id }: { id: number }) {
  return (
    <CampaignCard
      campaignId={id}
      showMetrics={true}
      className="border rounded-lg p-4 shadow"
    />
  );
}`}</code></pre>

      <h3>StakingDashboard</h3>
      <p>Complete staking dashboard:</p>
      <pre><code>{`'use client';

import { StakingDashboard } from '@stackads/nextjs';

export function MyStaking({ address }: { address: string }) {
  return (
    <StakingDashboard
      address={address}
      className="max-w-4xl mx-auto"
    />
  );
}`}</code></pre>

      <h2>Server Components</h2>
      <p>Use server-side utilities in Server Components and API routes:</p>
      <pre><code>{`// app/campaign/[id]/page.tsx
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
}`}</code></pre>

      <h2>API Routes</h2>
      <pre><code>{`// app/api/balance/[address]/route.ts
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
}`}</code></pre>

      <h2>Server Actions</h2>
      <pre><code>{`// app/actions/staking.ts
'use server';

import { getStackAdsSDK, getStakingInfo } from '@stackads/nextjs/server';
import { StacksTestnet } from '@stacks/network';

export async function fetchStakingInfo(address: string) {
  const sdk = getStackAdsSDK({
    network: new StacksTestnet(),
    contractAddress: process.env.CONTRACT_ADDRESS!,
  });

  return await getStakingInfo(sdk, address);
}`}</code></pre>

      <h2>Hooks</h2>
      <p>All React hooks from @stackads/react are available:</p>
      <pre><code>{`'use client';

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
}`}</code></pre>

      <h2>Environment Variables</h2>
      <pre><code>{`# .env.local
NEXT_PUBLIC_CONTRACT_ADDRESS=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
NEXT_PUBLIC_NETWORK=testnet`}</code></pre>

      <h2>Best Practices</h2>
      <ul>
        <li>Use Server Components for initial data - Fetch data on the server for better performance</li>
        <li>Use Client Components for interactivity - Use hooks for real-time updates</li>
        <li>Cache SDK instances - Use the provided getStackAdsSDK with React cache</li>
        <li>Handle errors gracefully - Always provide error states in UI</li>
        <li>Use environment variables - Keep contract addresses in env vars</li>
      </ul>
    </div>
  );
}
