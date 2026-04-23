import Link from "next/link";
import { Code, Book, Rocket, Shield } from "iconsax-react";

export default function DocsHome() {
  return (
    <div className="prose prose-invert max-w-none">
      <h1 className="text-4xl font-bold mb-4">StackAds Documentation</h1>
      <p className="text-xl text-white/60 mb-12">
        Everything you need to integrate StackAds into your application
      </p>

      {/* Quick Start Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 not-prose mb-12">
        <Link
          href="/docs/getting-started"
          className="glass rounded-2xl p-6 border border-white/8 hover:border-[#f7931a]/50 transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-[#f7931a]/10 flex items-center justify-center mb-4 group-hover:bg-[#f7931a]/20 transition-colors">
            <Rocket size={24} color="#f7931a" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Getting Started</h3>
          <p className="text-white/60 text-sm">
            Quick start guide to integrate StackAds in minutes
          </p>
        </Link>

        <Link
          href="/docs/sdk"
          className="glass rounded-2xl p-6 border border-white/8 hover:border-[#a855f7]/50 transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-[#a855f7]/10 flex items-center justify-center mb-4 group-hover:bg-[#a855f7]/20 transition-colors">
            <Code size={24} color="#a855f7" />
          </div>
          <h3 className="text-lg font-semibold mb-2">SDK Reference</h3>
          <p className="text-white/60 text-sm">
            Complete SDK documentation for all frameworks
          </p>
        </Link>

        <Link
          href="/docs/smart-contracts"
          className="glass rounded-2xl p-6 border border-white/8 hover:border-[#22d3ee]/50 transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-[#22d3ee]/10 flex items-center justify-center mb-4 group-hover:bg-[#22d3ee]/20 transition-colors">
            <Shield size={24} color="#22d3ee" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Smart Contracts</h3>
          <p className="text-white/60 text-sm">
            Clarity smart contract documentation and API
          </p>
        </Link>

        <Link
          href="/docs/guides"
          className="glass rounded-2xl p-6 border border-white/8 hover:border-[#4ade80]/50 transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-[#4ade80]/10 flex items-center justify-center mb-4 group-hover:bg-[#4ade80]/20 transition-colors">
            <Book size={24} color="#4ade80" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Guides & Tutorials</h3>
          <p className="text-white/60 text-sm">
            Step-by-step guides for common use cases
          </p>
        </Link>
      </div>

      {/* Overview */}
      <h2 className="text-2xl font-bold mb-4">What is StackAds?</h2>
      <p className="text-white/80 mb-6">
        StackAds is a decentralized advertising platform built on the Stacks blockchain. 
        It connects publishers and advertisers through smart contracts, enabling transparent, 
        trustless advertising with token incentives.
      </p>

      <h3 className="text-xl font-semibold mb-3">Key Features</h3>
      <ul className="text-white/80 space-y-2 mb-8">
        <li>🔗 <strong>Blockchain-based:</strong> All transactions on Stacks blockchain</li>
        <li>💰 <strong>Token incentives:</strong> Earn SADS tokens for participation</li>
        <li>🎯 <strong>Transparent:</strong> All metrics verifiable on-chain</li>
        <li>🛡️ <strong>Trustless:</strong> Smart contracts handle all payments</li>
        <li>📊 <strong>Real-time analytics:</strong> Track performance instantly</li>
        <li>🌐 <strong>Multi-platform:</strong> SDKs for web, mobile, and backend</li>
      </ul>

      <h3 className="text-xl font-semibold mb-3">For Publishers</h3>
      <p className="text-white/80 mb-4">
        Monetize your website or app by displaying ads. Earn SADS tokens for impressions 
        and clicks. Build your reputation score to attract premium advertisers.
      </p>

      <h3 className="text-xl font-semibold mb-3">For Advertisers</h3>
      <p className="text-white/80 mb-4">
        Create targeted campaigns and reach your audience. Pay only for actual clicks. 
        Track performance in real-time with transparent, on-chain metrics.
      </p>

      <h3 className="text-xl font-semibold mb-3">Available SDKs</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 not-prose mb-8">
        {[
          { name: "React", href: "/docs/sdk/react" },
          { name: "Next.js", href: "/docs/sdk/nextjs" },
          { name: "Vue", href: "/docs/sdk/vue" },
          { name: "Angular", href: "/docs/sdk/angular" },
          { name: "Svelte", href: "/docs/sdk/svelte" },
          { name: "Vanilla JS", href: "/docs/sdk/vanilla" },
          { name: "Core", href: "/docs/sdk/core" },
        ].map((sdk) => (
          <Link
            key={sdk.name}
            href={sdk.href}
            className="px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 text-center transition-colors"
          >
            {sdk.name}
          </Link>
        ))}
      </div>

      <div className="glass rounded-2xl p-6 border border-[#f7931a]/20 bg-[#f7931a]/5 not-prose">
        <h3 className="text-lg font-semibold mb-2 text-[#f7931a]">
          Ready to get started?
        </h3>
        <p className="text-white/80 mb-4">
          Follow our quick start guide to integrate StackAds in your application.
        </p>
        <Link
          href="/docs/getting-started"
          className="inline-block px-6 py-3 bg-[#f7931a] text-white rounded-lg hover:bg-[#f7931a]/90 transition-colors font-medium"
        >
          Get Started →
        </Link>
      </div>
    </div>
  );
}
