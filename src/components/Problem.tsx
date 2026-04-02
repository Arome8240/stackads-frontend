"use client";
import { motion } from "framer-motion";
import { Warning2, Lock, EmojiSad } from "iconsax-react";

const problems = [
  {
    icon: <Lock size={24} variant="Bold" color="#f87171" />,
    title: "Centralized & Opaque",
    desc: "Web2 ad networks control your data, your payouts, and your audience — with zero transparency into how decisions are made.",
  },
  {
    icon: <Warning2 size={24} variant="Bold" color="#f87171" />,
    title: "Developers Earn Less",
    desc: "Middlemen take the lion's share. Publishers see pennies on the dollar while platforms pocket the rest.",
  },
  {
    icon: <EmojiSad size={24} variant="Bold" color="#f87171" />,
    title: "dApps Have No Options",
    desc: "Web3 apps are left out entirely. No ad network supports on-chain apps, leaving dApp developers with no monetization path.",
  },
];

export default function Problem() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-red-950/5 to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-red-400/80 uppercase tracking-widest">
            The Problem
          </span>
          <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">
            The current system is <span className="text-red-400">broken</span>
          </h2>
          <p className="mt-4 text-white/50 max-w-xl mx-auto">
            Advertising today is built on trust you can&apos;t verify, revenue
            you can&apos;t audit, and platforms that don&apos;t serve you.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {problems.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass rounded-2xl p-6 border border-red-500/10 card-hover"
            >
              <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400 mb-4">
                {p.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{p.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
