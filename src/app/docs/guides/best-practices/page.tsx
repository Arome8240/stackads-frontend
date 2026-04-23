export default function BestPracticesPage() {
  return (
    <div className="prose">
      <h1>Best Practices</h1>
      <p className="lead">
        Essential guidelines and best practices for building secure, performant, and user-friendly applications with StackAds.
      </p>

      <h2>Code Organization</h2>

      <h3>Project Structure</h3>
      <pre><code>{`src/
├── components/
│   ├── ads/
│   │   ├── AdPlacement.tsx
│   │   └── AdManager.tsx
│   └── dashboard/
│       ├── CampaignList.tsx
│       └── Analytics.tsx
├── hooks/
│   ├── useStackAds.ts
│   └── useCampaign.ts
├── lib/
│   ├── stackads.ts
│   └── config.ts
├── types/
│   └── stackads.d.ts
└── utils/
    ├── format.ts
    └── validation.ts`}</code></pre>

      <h3>Configuration Management</h3>
      <pre><code>{`// lib/config.ts
export const stackAdsConfig = {
  network: process.env.NEXT_PUBLIC_NETWORK as 'testnet' | 'mainnet',
  contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
  contractName: 'stackads-token',
};

// Validate config on startup
if (!stackAdsConfig.contractAddress) {
  throw new Error('CONTRACT_ADDRESS not configured');
}`}</code></pre>

      <h3>Type Safety</h3>
      <pre><code>{`// types/stackads.d.ts
export interface Campaign {
  id: number;
  name: string;
  budget: bigint;
  spent: bigint;
  status: CampaignStatus;
}

export type CampaignStatus = 'active' | 'paused' | 'ended';

// Use types everywhere
const campaign: Campaign = await sdk.getCampaign(id);`}</code></pre>

      <h2>Error Handling</h2>

      <h3>Comprehensive Error Handling</h3>
      <pre><code>{`import { ContractError, NetworkError } from '@stackads/sdk-core';

async function handleTransaction() {
  try {
    const result = await sdk.token.transfer(recipient, amount);
    return { success: true, txId: result.txId };
  } catch (error) {
    if (error instanceof ContractError) {
      // Handle contract-specific errors
      if (error.message.includes('insufficient balance')) {
        return { success: false, error: 'Not enough tokens' };
      }
    } else if (error instanceof NetworkError) {
      // Handle network errors
      return { success: false, error: 'Network error, please retry' };
    }
    
    // Log unexpected errors
    console.error('Unexpected error:', error);
    return { success: false, error: 'Transaction failed' };
  }
}`}</code></pre>

      <h3>User-Friendly Error Messages</h3>
      <pre><code>{`const ERROR_MESSAGES = {
  'insufficient balance': 'You don\\'t have enough SADS tokens',
  'user rejected': 'Transaction was cancelled',
  'network error': 'Connection issue, please try again',
  'contract error': 'Smart contract error occurred',
};

function getErrorMessage(error: Error): string {
  for (const [key, message] of Object.entries(ERROR_MESSAGES)) {
    if (error.message.toLowerCase().includes(key)) {
      return message;
    }
  }
  return 'An unexpected error occurred';
}`}</code></pre>

      <h3>Error Boundaries</h3>
      <pre><code>{`import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <h2>Something went wrong</h2>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <StackAdsProvider>
        <YourApp />
      </StackAdsProvider>
    </ErrorBoundary>
  );
}`}</code></pre>

      <h2>Performance Optimization</h2>

      <h3>Memoization</h3>
      <pre><code>{`import { useMemo, useCallback } from 'react';

function CampaignList({ campaigns }) {
  // Memoize expensive calculations
  const totalSpent = useMemo(() => {
    return campaigns.reduce((sum, c) => sum + Number(c.spent), 0);
  }, [campaigns]);

  // Memoize callbacks
  const handlePause = useCallback((id: number) => {
    pauseCampaign(id);
  }, [pauseCampaign]);

  return (
    <div>
      <p>Total Spent: {totalSpent} SADS</p>
      {campaigns.map(c => (
        <Campaign key={c.id} data={c} onPause={handlePause} />
      ))}
    </div>
  );
}`}</code></pre>

      <h3>Lazy Loading</h3>
      <pre><code>{`import { lazy, Suspense } from 'react';

// Lazy load heavy components
const Analytics = lazy(() => import('./Analytics'));
const CampaignManager = lazy(() => import('./CampaignManager'));

function Dashboard() {
  return (
    <Suspense fallback={<Loading />}>
      <Analytics />
      <CampaignManager />
    </Suspense>
  );
}`}</code></pre>

      <h3>Data Caching</h3>
      <pre><code>{`import { useQuery } from '@tanstack/react-query';

function useCampaign(id: number) {
  return useQuery({
    queryKey: ['campaign', id],
    queryFn: () => sdk.getCampaign(id),
    staleTime: 60000, // Cache for 1 minute
    cacheTime: 300000, // Keep in cache for 5 minutes
    retry: 3,
  });
}`}</code></pre>

      <h3>Debouncing</h3>
      <pre><code>{`import { useDebouncedCallback } from 'use-debounce';

function SearchCampaigns() {
  const [search, setSearch] = useState('');

  const debouncedSearch = useDebouncedCallback(
    (value) => {
      // API call here
      searchCampaigns(value);
    },
    500 // Wait 500ms after user stops typing
  );

  return (
    <input
      value={search}
      onChange={(e) => {
        setSearch(e.target.value);
        debouncedSearch(e.target.value);
      }}
    />
  );
}`}</code></pre>

      <h2>Security Best Practices</h2>

      <h3>Input Validation</h3>
      <pre><code>{`import { z } from 'zod';

const CampaignSchema = z.object({
  name: z.string().min(3).max(100),
  budget: z.bigint().positive(),
  duration: z.number().int().positive().max(365),
});

function validateCampaign(data: unknown) {
  try {
    return CampaignSchema.parse(data);
  } catch (error) {
    throw new Error('Invalid campaign data');
  }
}`}</code></pre>

      <h3>Amount Validation</h3>
      <pre><code>{`function validateAmount(amount: bigint, max: bigint): boolean {
  if (amount <= 0n) {
    throw new Error('Amount must be positive');
  }
  if (amount > max) {
    throw new Error('Amount exceeds maximum');
  }
  return true;
}

// Use before transactions
validateAmount(transferAmount, userBalance);`}</code></pre>

      <h3>Rate Limiting</h3>
      <pre><code>{`import { rateLimit } from '@/lib/rate-limit';

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
});

async function handleRequest(req: Request) {
  try {
    await limiter.check(req, 10); // 10 requests per minute
    // Process request
  } catch {
    return new Response('Rate limit exceeded', { status: 429 });
  }
}`}</code></pre>

      <h3>Sanitize User Input</h3>
      <pre><code>{`import DOMPurify from 'dompurify';

function sanitizeInput(input: string): string {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  });
}

// Use for user-generated content
const safeName = sanitizeInput(userInput);`}</code></pre>

      <h2>State Management</h2>

      <h3>Context Pattern</h3>
      <pre><code>{`import { createContext, useContext, useState } from 'react';

interface StackAdsContextType {
  campaigns: Campaign[];
  loading: boolean;
  error: Error | null;
  refreshCampaigns: () => Promise<void>;
}

const StackAdsContext = createContext<StackAdsContextType | null>(null);

export function StackAdsProvider({ children }) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refreshCampaigns = async () => {
    setLoading(true);
    try {
      const data = await sdk.getCampaigns();
      setCampaigns(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StackAdsContext.Provider value={{ campaigns, loading, error, refreshCampaigns }}>
      {children}
    </StackAdsContext.Provider>
  );
}

export function useStackAds() {
  const context = useContext(StackAdsContext);
  if (!context) {
    throw new Error('useStackAds must be used within StackAdsProvider');
  }
  return context;
}`}</code></pre>

      <h3>Zustand Store</h3>
      <pre><code>{`import create from 'zustand';

interface StackAdsStore {
  campaigns: Campaign[];
  loading: boolean;
  fetchCampaigns: () => Promise<void>;
  pauseCampaign: (id: number) => Promise<void>;
}

export const useStackAdsStore = create<StackAdsStore>((set, get) => ({
  campaigns: [],
  loading: false,

  fetchCampaigns: async () => {
    set({ loading: true });
    try {
      const campaigns = await sdk.getCampaigns();
      set({ campaigns, loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  pauseCampaign: async (id) => {
    await sdk.pauseCampaign(id);
    await get().fetchCampaigns();
  },
}));`}</code></pre>

      <h2>Testing</h2>

      <h3>Unit Tests</h3>
      <pre><code>{`import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

describe('CampaignList', () => {
  it('displays campaigns', async () => {
    const mockCampaigns = [
      { id: 1, name: 'Test Campaign', budget: 100n }
    ];

    vi.spyOn(sdk, 'getCampaigns').mockResolvedValue(mockCampaigns);

    render(<CampaignList />);

    await waitFor(() => {
      expect(screen.getByText('Test Campaign')).toBeInTheDocument();
    });
  });
});`}</code></pre>

      <h3>Integration Tests</h3>
      <pre><code>{`describe('Campaign Flow', () => {
  it('creates and pauses campaign', async () => {
    // Create campaign
    const campaignId = await sdk.createCampaign({
      name: 'Test',
      budget: 100000000n,
      duration: 1440
    });

    expect(campaignId).toBeGreaterThan(0);

    // Verify creation
    const campaign = await sdk.getCampaign(campaignId);
    expect(campaign.name).toBe('Test');
    expect(campaign.status).toBe('active');

    // Pause campaign
    await sdk.pauseCampaign(campaignId);

    // Verify pause
    const paused = await sdk.getCampaign(campaignId);
    expect(paused.status).toBe('paused');
  });
});`}</code></pre>

      <h2>Accessibility</h2>

      <h3>Semantic HTML</h3>
      <pre><code>{`function CampaignCard({ campaign }) {
  return (
    <article aria-labelledby={\`campaign-\${campaign.id}\`}>
      <h2 id={\`campaign-\${campaign.id}\`}>{campaign.name}</h2>
      <p>Budget: {campaign.budget} SADS</p>
      <button aria-label={\`Pause \${campaign.name}\`}>
        Pause
      </button>
    </article>
  );
}`}</code></pre>

      <h3>Keyboard Navigation</h3>
      <pre><code>{`function Modal({ isOpen, onClose, children }) {
  useEffect(() => {
    if (isOpen) {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  return isOpen ? (
    <div role="dialog" aria-modal="true">
      {children}
    </div>
  ) : null;
}`}</code></pre>

      <h3>Screen Reader Support</h3>
      <pre><code>{`function LoadingButton({ loading, children, ...props }) {
  return (
    <button
      {...props}
      disabled={loading}
      aria-busy={loading}
      aria-live="polite"
    >
      {loading ? (
        <>
          <span className="sr-only">Loading...</span>
          <Spinner aria-hidden="true" />
        </>
      ) : (
        children
      )}
    </button>
  );
}`}</code></pre>

      <h2>Documentation</h2>

      <h3>Code Comments</h3>
      <pre><code>{`/**
 * Creates a new advertising campaign
 * @param name - Campaign name (3-100 characters)
 * @param budget - Total budget in micro-SADS (1 SADS = 1,000,000)
 * @param duration - Campaign duration in blocks (~10 min per block)
 * @returns Campaign ID
 * @throws {ValidationError} If parameters are invalid
 * @throws {ContractError} If contract call fails
 */
async function createCampaign(
  name: string,
  budget: bigint,
  duration: number
): Promise<number> {
  // Implementation
}`}</code></pre>

      <h3>README Files</h3>
      <pre><code>{`# Campaign Manager

## Overview
Manages advertising campaigns on StackAds platform.

## Installation
\`\`\`bash
npm install @stackads/react
\`\`\`

## Usage
\`\`\`tsx
import { useCampaign } from '@stackads/react';

function MyCampaign() {
  const { campaign, loading } = useCampaign(id);
  return <div>{campaign.name}</div>;
}
\`\`\`

## API Reference
See [docs](https://docs.stackads.io)`}</code></pre>

      <h2>Monitoring & Logging</h2>

      <h3>Error Tracking</h3>
      <pre><code>{`import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});

// Log errors
try {
  await sdk.createCampaign(data);
} catch (error) {
  Sentry.captureException(error, {
    tags: { feature: 'campaign-creation' },
    extra: { campaignData: data }
  });
  throw error;
}`}</code></pre>

      <h3>Analytics</h3>
      <pre><code>{`import { analytics } from '@/lib/analytics';

// Track events
analytics.track('Campaign Created', {
  campaignId: id,
  budget: budget.toString(),
  duration: duration
});

// Track page views
analytics.page('Campaign Dashboard');`}</code></pre>

      <h2>Deployment</h2>

      <h3>Environment Checks</h3>
      <pre><code>{`// Check required env vars
const requiredEnvVars = [
  'NEXT_PUBLIC_CONTRACT_ADDRESS',
  'NEXT_PUBLIC_NETWORK',
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(\`Missing required env var: \${envVar}\`);
  }
}`}</code></pre>

      <h3>Build Optimization</h3>
      <pre><code>{`// next.config.js
module.exports = {
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  images: {
    domains: ['ipfs.io'],
  },
  webpack: (config) => {
    config.optimization.splitChunks = {
      chunks: 'all',
    };
    return config;
  },
};`}</code></pre>

      <h2>Summary</h2>
      <ul>
        <li>Organize code logically</li>
        <li>Handle errors comprehensively</li>
        <li>Optimize performance</li>
        <li>Prioritize security</li>
        <li>Write tests</li>
        <li>Ensure accessibility</li>
        <li>Document thoroughly</li>
        <li>Monitor in production</li>
      </ul>
    </div>
  );
}
