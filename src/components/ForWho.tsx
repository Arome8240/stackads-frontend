"use client";
import { motion } from "framer-motion";
import { Code, Briefcase, People } from "iconsax-react";

const audiences = [
  {
    icon: <Code size={32} variant="Bold" color="#f7931a" />,
    color: "text-[#f7931a]",
    bg: "bg-[#f7931a]/10",
    border: "border-[#f7931a]/20",
    glow: "hover:shadow-[0_0_40px_rgba(247,147,26,0.12)]",
    title: "Developers",
    subtitle: "Web2 & Web3",
    desc: "Whether you're building a SaaS product, a mobile app, or a dApp on Stacks — StackAds gives you a revenue stream that's transparent, instant, and fully in your control.",
    perks: ["Drop-in SDK", "Real-time STX payouts", "Works with any stack"],
    cta: "Start Earning",
  },
  {
    icon: <Briefcase size={32} variant="Bold" color="#a855f7" />,
    color: "text-[#a855f7]",
    bg: "bg-[#a855f7]/10",
    border: "border-[#a855f7]/20",
    glow: "hover:shadow-[0_0_40px_rgba(168,85,247,0.12)]",
    title: "Advertisers",
    subtitle: "Brands & Projects",
    desc: "Reach engaged Web2 and Web3 audiences with campaigns that are verifiable on-chain. Set your budget, define your audience, and watch every dollar work.",
    perks: [
      "On-chain campaign tracking",
      "Fraud-proof metrics",
      "Web2 + Web3 reach",
    ],
    cta: "Launch Campaign",
  },
  {
    icon: <People size={32} variant="Bold" color="#4ade80" />,
    color: "text-[#4ade80]",
    bg: "bg-[#4ade80]/10",
    border: "border-[#4ade80]/20",
    glow: "hover:shadow-[0_0_40px_rgba(74,222,128,0.12)]",
    title: "Users",
    subtitle: "Earn for Engagement",
    desc: "Opt in to earn rewards for engaging with ads. Your attention has value — StackAds lets you capture a share of it, paid directly to your wallet.",
    perks: ["Opt-in rewards", "Privacy preserved", "Direct wallet payouts"],
    cta: "Learn More",
  },
];

export default function ForWho() {
  return (
    <section id="for-who" className="relative py-24">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-[#4ade80] uppercase tracking-widest">
            Who It&apos;s For
          </span>
          <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">
            Built for the{" "}
            <span className="gradient-text">entire ecosystem</span>
          </h2>
          <p className="mt-4 text-white/50 max-w-xl mx-auto">
            StackAds aligns incentives for developers, advertisers, and users —
            everyone wins.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {audiences.map((a, i) => (
            <motion.div
              key={a.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className={`glass rounded-2xl p-8 border ${a.border} ${a.glow} transition-shadow duration-300 flex flex-col gap-5`}
            >
              <div
                className={`w-14 h-14 rounded-2xl ${a.bg} flex items-center justify-center ${a.color}`}
              >
                {a.icon}
              </div>
              <div>
                <div className="text-xs font-medium text-white/40 uppercase tracking-widest mb-1">
                  {a.subtitle}
                </div>
                <h3 className="text-xl font-bold">{a.title}</h3>
              </div>
              <p className="text-white/50 text-sm leading-relaxed">{a.desc}</p>
              <ul className="flex flex-col gap-2">
                {a.perks.map((perk) => (
                  <li
                    key={perk}
                    className="flex items-center gap-2 text-sm text-white/60"
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${a.color}`}
                      style={{ background: "currentColor", opacity: 0.8 }}
                    />
                    {perk}
                  </li>
                ))}
              </ul>
              <a
                href="#"
                className={`mt-auto inline-flex items-center gap-1.5 text-sm font-semibold ${a.color} hover:underline`}
              >
                {a.cta} →
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
