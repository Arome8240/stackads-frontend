"use client";
import { motion } from "framer-motion";
import { ShieldTick, Global, Repeat } from "iconsax-react";

const pillars = [
  {
    icon: <ShieldTick size={28} variant="Bold" color="#f7931a" />,
    color: "from-[#f7931a] to-[#e8820a]",
    bg: "bg-[#f7931a]/10",
    text: "text-[#f7931a]",
    title: "Decentralized",
    desc: "No single point of control. Campaigns, payouts, and metrics live on the Stacks blockchain — immutable and auditable by anyone.",
  },
  {
    icon: <Global size={28} variant="Bold" color="#a855f7" />,
    color: "from-[#a855f7] to-[#9333ea]",
    bg: "bg-[#a855f7]/10",
    text: "text-[#a855f7]",
    title: "Cross-Platform",
    desc: "One SDK for Web2 websites, mobile apps, and Web3 dApps. Reach every developer, every platform, every user.",
  },
  {
    icon: <Repeat size={28} variant="Bold" color="#22d3ee" />,
    color: "from-[#22d3ee] to-[#0ea5e9]",
    bg: "bg-[#22d3ee]/10",
    text: "text-[#22d3ee]",
    title: "Transparent",
    desc: "Every impression, click, and payout is recorded on-chain. No black boxes. No hidden fees. Just verifiable truth.",
  },
];

export default function Solution() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-[#a855f7]/8 blur-[120px] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-[#a855f7] uppercase tracking-widest">
            The Solution
          </span>
          <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">
            Introducing <span className="gradient-text">StackAds</span>
          </h2>
          <p className="mt-4 text-white/50 max-w-xl mx-auto">
            A new kind of ad network — built on trust, powered by blockchain,
            and designed for the open web.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="glass rounded-2xl p-8 border border-white/8 card-hover text-center"
            >
              <div
                className={`w-14 h-14 rounded-2xl ${p.bg} flex items-center justify-center ${p.text} mx-auto mb-5`}
              >
                {p.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{p.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
