"use client";
import { motion } from "framer-motion";
import { Chainlink, Flash, Code, Eye, ShieldCross } from "iconsax-react";

const features = [
  {
    icon: <Chainlink size={24} variant="Bold" color="#f7931a" />,
    color: "text-[#f7931a]",
    bg: "bg-[#f7931a]/10",
    border: "border-[#f7931a]/20",
    title: "On-Chain Ad Campaigns",
    desc: "Create and manage campaigns directly on the Stacks blockchain. Every spend, every impression — fully auditable.",
  },
  {
    icon: <Flash size={24} variant="Bold" color="#a855f7" />,
    color: "text-[#a855f7]",
    bg: "bg-[#a855f7]/10",
    border: "border-[#a855f7]/20",
    title: "Instant Payouts",
    desc: "Revenue flows directly to your wallet in STX. No waiting 30 days. No minimum thresholds. Just instant settlement.",
  },
  {
    icon: <Code size={24} variant="Bold" color="#22d3ee" />,
    color: "text-[#22d3ee]",
    bg: "bg-[#22d3ee]/10",
    border: "border-[#22d3ee]/20",
    title: "Developer SDK",
    desc: "Drop in our lightweight SDK with a single line of code. Works with React, Vue, vanilla JS, and any mobile framework.",
  },
  {
    icon: <Eye size={24} variant="Bold" color="#4ade80" />,
    color: "text-[#4ade80]",
    bg: "bg-[#4ade80]/10",
    border: "border-[#4ade80]/20",
    title: "Privacy-First Ads",
    desc: "No invasive tracking. No third-party cookies. Contextual targeting that respects your users and complies with regulations.",
  },
  {
    icon: <ShieldCross size={24} variant="Bold" color="#f472b6" />,
    color: "text-[#f472b6]",
    bg: "bg-[#f472b6]/10",
    border: "border-[#f472b6]/20",
    title: "Fraud-Resistant Metrics",
    desc: "On-chain verification makes click fraud and impression stuffing impossible. Every metric is cryptographically proven.",
  },
];

export default function Features() {
  return (
    <section id="features" className="relative py-24">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-[#f7931a] uppercase tracking-widest">
            Features
          </span>
          <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">
            Everything you need to{" "}
            <span className="gradient-text">monetize</span>
          </h2>
          <p className="mt-4 text-white/50 max-w-xl mx-auto">
            Built for developers who demand transparency, speed, and control
            over their revenue.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`glass rounded-2xl p-6 border ${f.border} card-hover`}
            >
              <div
                className={`w-11 h-11 rounded-xl ${f.bg} flex items-center justify-center ${f.color} mb-4`}
              >
                {f.icon}
              </div>
              <h3 className="text-base font-semibold mb-2">{f.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}

          {/* Wide CTA card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="glass rounded-2xl p-6 border border-white/8 card-hover flex flex-col justify-between"
            style={{
              background:
                "linear-gradient(135deg, rgba(247,147,26,0.05), rgba(168,85,247,0.05))",
            }}
          >
            <div>
              <h3 className="text-base font-semibold mb-2">And much more...</h3>
              <p className="text-white/50 text-sm leading-relaxed">
                Analytics dashboard, A/B testing, multi-chain support, and a
                growing ecosystem of integrations.
              </p>
            </div>
            <a
              href="#"
              className="mt-4 text-sm font-semibold text-[#f7931a] hover:underline"
            >
              View full docs →
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
