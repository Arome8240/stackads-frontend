"use client";
import { motion } from "framer-motion";
import { Additem, Code1, Monitor, DollarCircle } from "iconsax-react";

const steps = [
  {
    icon: <Additem size={28} variant="Bold" color="#f7931a" />,
    color: "text-[#f7931a]",
    bg: "bg-[#f7931a]/10",
    ring: "ring-[#f7931a]/30",
    step: "01",
    title: "Advertisers Create Campaigns",
    desc: "Set your budget, targeting, and creative assets. Campaign parameters are written to the Stacks blockchain — immutable and verifiable.",
  },
  {
    icon: <Code1 size={28} variant="Bold" color="#a855f7" />,
    color: "text-[#a855f7]",
    bg: "bg-[#a855f7]/10",
    ring: "ring-[#a855f7]/30",
    step: "02",
    title: "Developers Integrate the SDK",
    desc: "Drop in a single script tag or npm package. Works with any framework — React, Next.js, Vue, or plain HTML.",
  },
  {
    icon: <Monitor size={28} variant="Bold" color="#22d3ee" />,
    color: "text-[#22d3ee]",
    bg: "bg-[#22d3ee]/10",
    ring: "ring-[#22d3ee]/30",
    step: "03",
    title: "Ads Are Displayed",
    desc: "Relevant, privacy-respecting ads are served to your users. Every impression is logged on-chain for full transparency.",
  },
  {
    icon: <DollarCircle size={28} variant="Bold" color="#4ade80" />,
    color: "text-[#4ade80]",
    bg: "bg-[#4ade80]/10",
    ring: "ring-[#4ade80]/30",
    step: "04",
    title: "Revenue Is Shared Transparently",
    desc: "STX flows directly to publisher wallets in real time. No intermediaries, no delays, no hidden cuts.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-24 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-[#f7931a]/3 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-[#f7931a] uppercase tracking-widest">
            How It Works
          </span>
          <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">
            Up and running in <span className="gradient-text">minutes</span>
          </h2>
          <p className="mt-4 text-white/50 max-w-xl mx-auto">
            Four simple steps from campaign creation to transparent revenue
            sharing.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-linear-to-r from-[#f7931a]/30 via-[#a855f7]/30 to-[#4ade80]/30" />

          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="flex flex-col items-center text-center gap-4"
            >
              <div
                className={`relative w-20 h-20 rounded-2xl ${s.bg} ring-1 ${s.ring} flex items-center justify-center ${s.color} z-10`}
              >
                {s.icon}
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#07070f] border border-white/10 flex items-center justify-center text-[10px] font-bold text-white/40">
                  {s.step}
                </span>
              </div>
              <h3 className="text-base font-semibold">{s.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
