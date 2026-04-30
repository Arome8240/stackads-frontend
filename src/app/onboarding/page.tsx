"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Code, Briefcase, ArrowRight } from "iconsax-react";

const roles = [
  {
    href: "/onboarding/publisher",
    icon: <Code size={36} color="#4ade80" variant="Bold" />,
    bg: "bg-[#4ade80]/10",
    border: "border-[#4ade80]/20",
    hover: "hover:border-[#4ade80]/50",
    accent: "text-[#4ade80]",
    title: "Publisher",
    subtitle: "I have an app or website",
    desc: "Integrate the StackAds SDK and earn revenue by displaying ads to your users.",
    perks: ["Drop-in SDK", "Real-time payouts", "Privacy-first ads"],
  },
  {
    href: "/onboarding/advertiser",
    icon: <Briefcase size={36} color="#f7931a" variant="Bold" />,
    bg: "bg-[#f7931a]/10",
    border: "border-[#f7931a]/20",
    hover: "hover:border-[#f7931a]/50",
    accent: "text-[#f7931a]",
    title: "Advertiser",
    subtitle: "I want to run ad campaigns",
    desc: "Create on-chain campaigns, reach Web2 and Web3 audiences, and track every impression.",
    perks: ["On-chain campaigns", "Fraud-proof metrics", "Web2 + Web3 reach"],
  },
];

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-[#07070f] flex items-center justify-center px-6 py-16">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-[#f7931a]/8 blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-3xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <Link href="/" className="inline-flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-[#f7931a] to-[#a855f7] flex items-center justify-center">
              <span className="text-white font-bold">S</span>
            </div>
            <span className="font-bold text-xl">StackAds</span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            How will you use StackAds?
          </h1>
          <p className="text-white/50 text-base">
            Choose your role to get started. You can always switch later.
          </p>
        </motion.div>

        {/* Role cards */}
        <div className="grid md:grid-cols-2 gap-5">
          {roles.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
            >
              <Link
                href={r.href}
                className={`block glass rounded-2xl p-8 border ${r.border} ${r.hover} transition-all duration-200 group`}
              >
                <div
                  className={`w-16 h-16 rounded-2xl ${r.bg} flex items-center justify-center mb-5`}
                >
                  {r.icon}
                </div>
                <p
                  className={`text-xs font-semibold uppercase tracking-widest ${r.accent} mb-1`}
                >
                  {r.subtitle}
                </p>
                <h2 className="text-xl font-bold text-white mb-3">{r.title}</h2>
                <p className="text-white/50 text-sm leading-relaxed mb-5">
                  {r.desc}
                </p>
                <ul className="flex flex-col gap-2 mb-6">
                  {r.perks.map((p) => (
                    <li
                      key={p}
                      className="flex items-center gap-2 text-sm text-white/60"
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${r.bg}`}
                        style={{ background: "currentColor", opacity: 0.8 }}
                      />
                      {p}
                    </li>
                  ))}
                </ul>
                <div
                  className={`flex items-center gap-1.5 text-sm font-semibold ${r.accent} group-hover:gap-2.5 transition-all`}
                >
                  Get started <ArrowRight size={16} color="currentColor" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center text-xs text-white/30 mt-8"
        >
          Already have an account?{" "}
          <Link
            href="/dashboard"
            className="text-white/50 hover:text-white transition-colors underline"
          >
            Sign in
          </Link>
        </motion.p>
      </div>
    </div>
  );
}
