"use client";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "iconsax-react";
import { fadeUp } from "@/lib/animations";
import RevenueCard from "./features/RevenueCard";
import OnChainBadge from "./features/OnChainBadge";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[#f7931a]/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-[#a855f7]/10 blur-[100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 py-24 flex flex-col items-center text-center gap-8">
        {/* Badge */}
        <motion.div {...fadeUp(0)}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-medium text-white/70 border border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f7931a] animate-pulse" />
            Powered by Stacks Blockchain
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          {...fadeUp(0.1)}
          className="text-5xl md:text-7xl font-bold tracking-tight leading-tight max-w-4xl"
        >
          Monetize Your App{" "}
          <span className="gradient-text">Without Limits</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          {...fadeUp(0.2)}
          className="text-lg md:text-xl text-white/50 max-w-2xl leading-relaxed"
        >
          The decentralized ad network for Web2 and Web3. Transparent payouts,
          on-chain campaigns, and a developer SDK that just works.
        </motion.p>

        {/* CTAs */}
        <motion.div
          {...fadeUp(0.3)}
          className="flex flex-col sm:flex-row gap-4"
        >
          <a
            href="#"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-linear-to-r from-[#f7931a] to-[#e8820a] text-black font-semibold hover:opacity-90 transition-opacity orange-glow"
          >
            Start Earning
            <ArrowRight size={18} color="#000000" />
          </a>
          <a
            href="#"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full glass text-white font-semibold hover:bg-white/10 transition-colors"
          >
            <Play size={18} variant="Bold" color="#f0f0f5" />
            Launch Campaign
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          {...fadeUp(0.4)}
          className="flex flex-col sm:flex-row gap-8 mt-8 pt-8 border-t border-white/10 w-full max-w-lg justify-center"
        >
          {[
            { value: "$2M+", label: "Paid to Developers" },
            { value: "10K+", label: "Active Campaigns" },
            { value: "99.9%", label: "Uptime" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1">
              <span className="text-2xl font-bold gradient-text">
                {stat.value}
              </span>
              <span className="text-sm text-white/40">{stat.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Visual illustration */}
        <motion.div
          {...fadeUp(0.5)}
          className="relative mt-12 w-full max-w-3xl"
        >
          <div className="glass rounded-2xl p-6 border border-white/10 orange-glow">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
              <span className="ml-2 text-xs text-white/30 font-mono">
                stackads-sdk.js
              </span>
            </div>
            <pre className="text-left text-sm font-mono text-white/60 overflow-x-auto">
              <code>{`import { StackAds } from '@stackads/sdk'

const ads = new StackAds({
  publisherId: 'pub_xxxxxxxx',
  network: 'stacks-mainnet',
})

// Render an ad unit
ads.display('#ad-container', {
  format: 'banner',
  onRevenue: (stx) => console.log(\`Earned: \${stx} STX\`)
})`}</code>
            </pre>
          </div>
          <RevenueCard revenue="+0.42 STX" />
          <OnChainBadge txHash="0x4f2a...9c1e" />
        </motion.div>
      </div>
    </section>
  );
}
