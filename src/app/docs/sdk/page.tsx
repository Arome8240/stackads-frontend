import Link from "next/link";

export default function SDKOverview() {
  const sdks = [
    {
      name: "Core SDK",
      description: "TypeScript SDK for direct contract interaction",
      href: "/docs/sdk/core",
      language: "TypeScript",
      features: ["Contract clients", "Type definitions", "Utilities"],
    },
    {
      name: "React",
      description: "React hooks and components",
      href: "/docs/sdk/react",
      language: "TypeScript",
      features: ["Custom hooks", "Context provider", "TypeScript support"],
    },
    {
      name: "Next.js",
      description: "Next.js App Router integration",
      href: "/docs/sdk/nextjs",
      language: "TypeScript",
      features: ["Server components", "API routes", "Server actions"],
    },
    {
      name: "Vue",
      description: "Vue 3 composables",
      href: "/docs/sdk/vue",
      language: "TypeScript",
      features: ["Composition API", "Reactive stores", "Plugin system"],
    },
    {
      name: "Angular",
      description: "Angular services with RxJS",
      href: "/docs/sdk/angular",
      language: "TypeScript",
      features: ["Injectable services", "Observables", "Dependency injection"],
    },
    {
      name: "Svelte",
      description: "Svelte stores and components",
      href: "/docs/sdk/svelte",
      language: "TypeScript",
      features: ["Reactive stores", "SvelteKit support", "Auto-subscriptions"],
    },
    {
      name: "Vanilla JS",
      description: "Framework-free JavaScript",
      href: "/docs/sdk/vanilla",
      language: "JavaScript",
      features: ["CDN support", "Browser compatible", "No dependencies"],
    },
  ];

  return (
    <div className="prose prose-invert max-w-none">
      <h1>SDK Reference</h1>
      <p className="lead">
        Choose the SDK that matches your tech stack and start building with StackAds.
      </p>

      <h2>Available SDKs</h2>
      <p>
        We provide official SDKs for all major web frameworks. Each SDK is built on top of our
        Core SDK and provides framework-specific patterns and best practices.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 not-prose my-8">
        {sdks.map((sdk) => (
          <Link
            key={sdk.name}
            href={sdk.href}
            className="glass rounded-2xl p-6 border border-white/8 hover:border-[#f7931a]/50 transition-all group"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-semibold">{sdk.name}</h3>
              <span className="px-2 py-1 bg-white/5 rounded text-xs text-white/60">
                {sdk.language}
              </span>
            </div>
            <p className="text-white/60 text-sm mb-4">{sdk.description}</p>
            <ul className="space-y-1">
              {sdk.features.map((feature) => (
                <li key={feature} className="text-xs text-white/40 flex items-center gap-2">
                  <span className="text-[#4ade80]">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-4 border-t border-white/10">
              <span className="text-sm text-[#f7931a] group-hover:underline">
                View Documentation →
              </span>
            </div>
          </Link>
        ))}
      </div>

      <h2>Installation</h2>
      <p>All SDKs are available on npm and can be installed with your preferred package manager:</p>
      <pre><code>{`# npm
npm install @stackads/[sdk-name]

# pnpm
pnpm add @stackads/[sdk-name]

# yarn
yarn add @stackads/[sdk-name]`}</code></pre>

      <h2>Common Features</h2>
      <p>All SDKs provide the following core functionality:</p>
      <ul>
        <li><strong>Token Operations:</strong> Balance queries, transfers, token info</li>
        <li><strong>Registry Management:</strong> Publisher/advertiser registration</li>
        <li><strong>Staking:</strong> Stake, unstake, claim rewards</li>
        <li><strong>Campaign Management:</strong> Create, pause, resume campaigns</li>
        <li><strong>TypeScript Support:</strong> Full type definitions included</li>
        <li><strong>Error Handling:</strong> Comprehensive error messages</li>
      </ul>

      <h2>Choosing an SDK</h2>
      <p>Select the SDK based on your project's framework:</p>
      <ul>
        <li><strong>React/Next.js:</strong> Use @stackads/react or @stackads/nextjs</li>
        <li><strong>Vue:</strong> Use @stackads/vue</li>
        <li><strong>Angular:</strong> Use @stackads/angular</li>
        <li><strong>Svelte/SvelteKit:</strong> Use @stackads/svelte</li>
        <li><strong>No Framework:</strong> Use @stackads/vanilla</li>
        <li><strong>Backend/Node.js:</strong> Use @stackads/sdk-core</li>
      </ul>

      <h2>Quick Start</h2>
      <p>Here's a minimal example for each framework:</p>

      <h3>React</h3>
      <pre><code>{`import { StackAdsProvider, useToken } from '@stackads/react';

function App() {
  return (
    <StackAdsProvider config={{ network: 'testnet', ... }}>
      <Dashboard />
    </StackAdsProvider>
  );
}`}</code></pre>

      <h3>Vue</h3>
      <pre><code>{`import { initStackAds, tokenStore } from '@stackads/vue';

initStackAds({ network: 'testnet', ... });

// In component
const balance = $tokenStore.formattedBalance;`}</code></pre>

      <h3>Angular</h3>
      <pre><code>{`import { StackAdsConfigService, TokenService } from '@stackads/angular';

// In module
providers: [
  ...StackAdsConfigService.forRoot({ network: 'testnet', ... }).providers
]

// In component
constructor(private tokenService: TokenService) {}`}</code></pre>

      <h3>Svelte</h3>
      <pre><code>{`import { initStackAds, tokenStore } from '@stackads/svelte';

initStackAds({ network: 'testnet', ... });

// In component
$: balance = $tokenStore.formattedBalance;`}</code></pre>

      <h2>Support</h2>
      <p>
        Need help? Check out our{" "}
        <a href="/docs/advanced/troubleshooting">troubleshooting guide</a> or join our{" "}
        <a href="https://discord.gg/stackads">Discord community</a>.
      </p>
    </div>
  );
}
