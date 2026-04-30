"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, TickCircle } from "iconsax-react";
import Toast from "@/components/dashboard/Toast";
import type { ToastType } from "@/components/dashboard/Toast";

const budgetRanges = [
  "< $500 / month",
  "$500 – $2K",
  "$2K – $10K",
  "$10K – $50K",
  "> $50K / month",
];
const goals = [
  "Brand Awareness",
  "User Acquisition",
  "App Installs",
  "DeFi Protocol Growth",
  "NFT Sales",
  "Other",
];

export default function AdvertiserOnboardingPage() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);
  const [form, setForm] = useState({
    name: "",
    company: "",
    website: "",
    budget: "",
    goal: "",
  });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.company || !form.budget || !form.goal) {
      setToast({
        message: "Please fill in all required fields.",
        type: "error",
      });
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setStep(2);
    }, 1200);
  };

  if (step === 2) {
    return (
      <div className="min-h-screen bg-[#07070f] flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 rounded-full bg-[#f7931a]/15 flex items-center justify-center mx-auto mb-6">
            <TickCircle size={40} color="#f7931a" variant="Bold" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">
            Welcome aboard!
          </h1>
          <p className="text-white/50 text-sm leading-relaxed mb-8">
            Your advertiser account for{" "}
            <span className="text-white font-medium">{form.company}</span> is
            ready. Create your first campaign to start reaching your audience.
          </p>
          <Link
            href="/dashboard/create"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-linear-to-r from-[#f7931a] to-[#e8820a] text-black font-bold hover:opacity-90 transition-opacity"
          >
            Create First Campaign
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07070f] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft size={16} color="currentColor" /> Back
          </Link>

          <div className="mb-8">
            <span className="text-xs font-semibold text-[#f7931a] uppercase tracking-widest">
              Advertiser Setup
            </span>
            <h1 className="text-2xl font-bold text-white mt-2 mb-1">
              Tell us about your campaign
            </h1>
            <p className="text-white/50 text-sm">
              We&apos;ll use this to help you reach the right audience.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="glass rounded-2xl p-6 border border-white/8 flex flex-col gap-5"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-white/70">
                  Your Name <span className="text-[#f7931a]">*</span>
                </label>
                <input
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="Alex Johnson"
                  className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#f7931a]/50 transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-white/70">
                  Company / Project <span className="text-[#f7931a]">*</span>
                </label>
                <input
                  value={form.company}
                  onChange={(e) => set("company", e.target.value)}
                  placeholder="Acme DeFi"
                  className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#f7931a]/50 transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-white/70">
                Website{" "}
                <span className="text-white/30 font-normal">(optional)</span>
              </label>
              <input
                value={form.website}
                onChange={(e) => set("website", e.target.value)}
                placeholder="https://acmedefi.xyz"
                type="url"
                className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#f7931a]/50 transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-white/70">
                  Monthly Budget <span className="text-[#f7931a]">*</span>
                </label>
                <select
                  value={form.budget}
                  onChange={(e) => set("budget", e.target.value)}
                  className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-[#f7931a]/50 transition-colors appearance-none"
                >
                  <option value="" disabled className="bg-[#0d0d1a]">
                    Select...
                  </option>
                  {budgetRanges.map((b) => (
                    <option key={b} value={b} className="bg-[#0d0d1a]">
                      {b}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-white/70">
                  Primary Goal <span className="text-[#f7931a]">*</span>
                </label>
                <select
                  value={form.goal}
                  onChange={(e) => set("goal", e.target.value)}
                  className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-[#f7931a]/50 transition-colors appearance-none"
                >
                  <option value="" disabled className="bg-[#0d0d1a]">
                    Select...
                  </option>
                  {goals.map((g) => (
                    <option key={g} value={g} className="bg-[#0d0d1a]">
                      {g}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="py-3.5 rounded-xl bg-linear-to-r from-[#f7931a] to-[#e8820a] text-black font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <TickCircle size={18} color="#000" variant="Bold" />
              )}
              {submitting ? "Creating account..." : "Create Advertiser Account"}
            </motion.button>
          </form>
        </motion.div>
      </div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
