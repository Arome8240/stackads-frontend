"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, TickCircle } from "iconsax-react";
import Toast from "@/components/dashboard/Toast";
import type { ToastType } from "@/components/dashboard/Toast";

const categories = [
  "DeFi",
  "NFT",
  "Gaming",
  "News",
  "Developer Tools",
  "Social",
  "Finance",
  "Other",
];
const trafficRanges = [
  "< 1K / month",
  "1K – 10K",
  "10K – 100K",
  "100K – 1M",
  "> 1M / month",
];

export default function PublisherOnboardingPage() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);
  const [form, setForm] = useState({
    appName: "",
    url: "",
    category: "",
    traffic: "",
    description: "",
  });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.appName || !form.url || !form.category || !form.traffic) {
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
          <div className="w-20 h-20 rounded-full bg-[#4ade80]/15 flex items-center justify-center mx-auto mb-6">
            <TickCircle size={40} color="#4ade80" variant="Bold" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">
            You&apos;re all set!
          </h1>
          <p className="text-white/50 text-sm leading-relaxed mb-8">
            Your publisher account for{" "}
            <span className="text-white font-medium">{form.appName}</span> has
            been created. Head to your dashboard to add your first ad unit.
          </p>
          <Link
            href="/publisher"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-linear-to-r from-[#4ade80] to-[#22d3ee] text-black font-bold hover:opacity-90 transition-opacity"
          >
            Go to Publisher Dashboard
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
            <span className="text-xs font-semibold text-[#4ade80] uppercase tracking-widest">
              Publisher Setup
            </span>
            <h1 className="text-2xl font-bold text-white mt-2 mb-1">
              Tell us about your app
            </h1>
            <p className="text-white/50 text-sm">
              This helps us match the right ads to your audience.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="glass rounded-2xl p-6 border border-white/8 flex flex-col gap-5"
          >
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-white/70">
                App / Site Name <span className="text-[#4ade80]">*</span>
              </label>
              <input
                value={form.appName}
                onChange={(e) => set("appName", e.target.value)}
                placeholder="e.g. My DeFi App"
                className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#4ade80]/50 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-white/70">
                Website URL <span className="text-[#4ade80]">*</span>
              </label>
              <input
                value={form.url}
                onChange={(e) => set("url", e.target.value)}
                placeholder="https://myapp.xyz"
                type="url"
                className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#4ade80]/50 transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-white/70">
                  Category <span className="text-[#4ade80]">*</span>
                </label>
                <select
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                  className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-[#4ade80]/50 transition-colors appearance-none"
                >
                  <option value="" disabled className="bg-[#0d0d1a]">
                    Select...
                  </option>
                  {categories.map((c) => (
                    <option key={c} value={c} className="bg-[#0d0d1a]">
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-white/70">
                  Monthly Traffic <span className="text-[#4ade80]">*</span>
                </label>
                <select
                  value={form.traffic}
                  onChange={(e) => set("traffic", e.target.value)}
                  className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-[#4ade80]/50 transition-colors appearance-none"
                >
                  <option value="" disabled className="bg-[#0d0d1a]">
                    Select...
                  </option>
                  {trafficRanges.map((t) => (
                    <option key={t} value={t} className="bg-[#0d0d1a]">
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-white/70">
                Description{" "}
                <span className="text-white/30 font-normal">(optional)</span>
              </label>
              <textarea
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                rows={3}
                placeholder="Briefly describe your app and audience..."
                className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#4ade80]/50 transition-colors resize-none"
              />
            </div>

            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="py-3.5 rounded-xl bg-linear-to-r from-[#4ade80] to-[#22d3ee] text-black font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <TickCircle size={18} color="#000" variant="Bold" />
              )}
              {submitting ? "Creating account..." : "Create Publisher Account"}
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
