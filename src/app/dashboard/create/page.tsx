"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { DocumentUpload, Send } from "iconsax-react";
import Toast from "@/components/dashboard/Toast";
import type { ToastType } from "@/types";

const formats = ["Banner", "Native", "Video"];
const audiences = [
  "Web3 / DeFi Users",
  "NFT Collectors",
  "Crypto Traders",
  "General Web2",
  "Mobile App Users",
  "Developer Community",
];

export default function CreateCampaignPage() {
  const [form, setForm] = useState({
    name: "",
    budget: "",
    audience: "",
    format: "Banner",
    creative: null as File | null,
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.budget || !form.audience) {
      setToast({
        message: "Please fill in all required fields.",
        type: "error",
      });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setToast({ message: "Campaign launched successfully!", type: "success" });
      setForm({
        name: "",
        budget: "",
        audience: "",
        format: "Banner",
        creative: null,
      });
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-xl font-bold text-white mb-1">Create Campaign</h2>
        <p className="text-sm text-white/40 mb-6">
          Launch a new on-chain ad campaign on StackAds.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Campaign Name */}
          <div className="glass rounded-2xl p-6 border border-white/8 flex flex-col gap-5">
            <h3 className="text-sm font-semibold text-white/60 uppercase tracking-widest">
              Campaign Details
            </h3>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-white/70">
                Campaign Name <span className="text-[#f7931a]">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Stacks DeFi Launch Q2"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#f7931a]/60 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-white/70">
                Budget (USD) <span className="text-[#f7931a]">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm">
                  $
                </span>
                <input
                  type="number"
                  placeholder="1000"
                  min="50"
                  value={form.budget}
                  onChange={(e) => set("budget", e.target.value)}
                  className="w-full pl-8 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#f7931a]/60 transition-colors"
                />
              </div>
              <p className="text-xs text-white/30">Minimum budget: $50</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-white/70">
                Target Audience <span className="text-[#f7931a]">*</span>
              </label>
              <select
                value={form.audience}
                onChange={(e) => set("audience", e.target.value)}
                className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-[#f7931a]/60 transition-colors appearance-none"
              >
                <option value="" disabled className="bg-[#0d0d1a]">
                  Select audience...
                </option>
                {audiences.map((a) => (
                  <option key={a} value={a} className="bg-[#0d0d1a]">
                    {a}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Ad Format */}
          <div className="glass rounded-2xl p-6 border border-white/8 flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-white/60 uppercase tracking-widest">
              Ad Format
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {formats.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => set("format", f)}
                  className={`py-3 rounded-xl text-sm font-medium border transition-all ${
                    form.format === f
                      ? "bg-[#f7931a]/15 border-[#f7931a]/40 text-[#f7931a]"
                      : "bg-white/5 border-white/10 text-white/50 hover:text-white hover:border-white/20"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Creative Upload */}
          <div className="glass rounded-2xl p-6 border border-white/8 flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-white/60 uppercase tracking-widest">
              Creative Asset
            </h3>
            <label className="flex flex-col items-center justify-center gap-3 py-10 rounded-xl border-2 border-dashed border-white/10 hover:border-[#f7931a]/30 cursor-pointer transition-colors bg-white/2">
              <DocumentUpload size={32} color="#f7931a" variant="Bold" />
              <div className="text-center">
                <p className="text-sm font-medium text-white/60">
                  {form.creative
                    ? form.creative.name
                    : "Click to upload or drag & drop"}
                </p>
                <p className="text-xs text-white/30 mt-1">
                  PNG, JPG, GIF, MP4 up to 10MB
                </p>
              </div>
              <input
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    creative: e.target.files?.[0] ?? null,
                  }))
                }
              />
            </label>
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-linear-to-r from-[#f7931a] to-[#e8820a] text-black font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : (
              <Send size={18} color="#000" variant="Bold" />
            )}
            {loading ? "Launching..." : "Launch Campaign"}
          </motion.button>
        </form>
      </motion.div>

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
