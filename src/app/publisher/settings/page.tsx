"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, TickCircle, Warning2 } from "iconsax-react";
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

const SDK_SNIPPET = `import { StackAds } from '@stackads/sdk'

const ads = new StackAds({
  publisherId: 'pub_xxxxxxxx',
  network: 'stacks-mainnet',
})

ads.display('#ad-container', {
  format: 'banner',
  onRevenue: (stx) => console.log(\`Earned: \${stx} STX\`)
})`;

export default function PublisherSettingsPage() {
  const [profile, setProfile] = useState({
    appName: "My DeFi App",
    websiteUrl: "https://mydefiapp.xyz",
    category: "DeFi",
    description: "A decentralized finance application built on Stacks.",
  });
  const [notifications, setNotifications] = useState({
    dailyReport: true,
    payoutAlert: true,
    campaignUpdates: false,
    weeklyDigest: true,
  });
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  const setField = (k: string, v: string) =>
    setProfile((p) => ({ ...p, [k]: v }));
  const toggleNotif = (k: string) =>
    setNotifications((n) => ({ ...n, [k]: !n[k as keyof typeof n] }));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setToast({ message: "Settings saved successfully.", type: "success" });
    }, 1000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(SDK_SNIPPET);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setToast({ message: "SDK snippet copied to clipboard.", type: "success" });
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-xl font-bold text-white mb-1">Settings</h2>
        <p className="text-sm text-white/40">
          Manage your publisher profile and preferences.
        </p>
      </motion.div>

      {/* Profile form */}
      <motion.form
        onSubmit={handleSave}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="glass rounded-2xl p-6 border border-white/8 flex flex-col gap-5"
      >
        <h3 className="text-sm font-semibold text-white/50 uppercase tracking-widest">
          Publisher Profile
        </h3>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-white/70">
            App / Site Name
          </label>
          <input
            value={profile.appName}
            onChange={(e) => setField("appName", e.target.value)}
            className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#4ade80]/50 transition-colors"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-white/70">
            Website URL
          </label>
          <input
            value={profile.websiteUrl}
            onChange={(e) => setField("websiteUrl", e.target.value)}
            className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#4ade80]/50 transition-colors"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-white/70">Category</label>
          <select
            value={profile.category}
            onChange={(e) => setField("category", e.target.value)}
            className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-[#4ade80]/50 transition-colors appearance-none"
          >
            {categories.map((c) => (
              <option key={c} value={c} className="bg-[#0d0d1a]">
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-white/70">
            Description
          </label>
          <textarea
            value={profile.description}
            onChange={(e) => setField("description", e.target.value)}
            rows={3}
            className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#4ade80]/50 transition-colors resize-none"
          />
        </div>

        <motion.button
          type="submit"
          disabled={saving}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className="py-3 rounded-xl bg-linear-to-r from-[#4ade80] to-[#22d3ee] text-black font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {saving ? (
            <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
          ) : (
            <TickCircle size={16} color="#000" variant="Bold" />
          )}
          {saving ? "Saving..." : "Save Changes"}
        </motion.button>
      </motion.form>

      {/* SDK snippet */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="glass rounded-2xl p-6 border border-white/8 flex flex-col gap-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white/50 uppercase tracking-widest">
            SDK Integration
          </h3>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg glass border border-white/10 text-white/50 hover:text-white transition-colors"
          >
            {copied ? (
              <TickCircle size={14} color="#4ade80" variant="Bold" />
            ) : (
              <Copy size={14} color="#a855f7" variant="Bold" />
            )}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <pre className="text-xs font-mono text-white/60 bg-white/3 rounded-xl p-4 overflow-x-auto leading-relaxed">
          <code>{SDK_SNIPPET}</code>
        </pre>
        <p className="text-xs text-white/30">
          Replace <span className="text-[#f7931a]">pub_xxxxxxxx</span> with your
          actual publisher ID from the overview page.
        </p>
      </motion.div>

      {/* Notification preferences */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="glass rounded-2xl p-6 border border-white/8 flex flex-col gap-4"
      >
        <h3 className="text-sm font-semibold text-white/50 uppercase tracking-widest">
          Notifications
        </h3>
        {[
          {
            key: "dailyReport",
            label: "Daily earnings report",
            desc: "Receive a daily summary of your earnings",
          },
          {
            key: "payoutAlert",
            label: "Payout alerts",
            desc: "Get notified when a withdrawal is processed",
          },
          {
            key: "campaignUpdates",
            label: "Campaign updates",
            desc: "Updates when campaigns targeting your units change",
          },
          {
            key: "weeklyDigest",
            label: "Weekly digest",
            desc: "A weekly overview of your performance",
          },
        ].map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between gap-4"
          >
            <div>
              <p className="text-sm font-medium text-white/80">{item.label}</p>
              <p className="text-xs text-white/40 mt-0.5">{item.desc}</p>
            </div>
            <button
              onClick={() => toggleNotif(item.key)}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${notifications[item.key as keyof typeof notifications] ? "bg-[#4ade80]" : "bg-white/10"}`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${notifications[item.key as keyof typeof notifications] ? "translate-x-5" : "translate-x-0.5"}`}
              />
            </button>
          </div>
        ))}
      </motion.div>

      {/* Danger zone */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="glass rounded-2xl p-6 border border-red-500/20 flex flex-col gap-4"
      >
        <div className="flex items-center gap-2">
          <Warning2 size={18} color="#f87171" variant="Bold" />
          <h3 className="text-sm font-semibold text-red-400 uppercase tracking-widest">
            Danger Zone
          </h3>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-white/70">
              Deactivate Account
            </p>
            <p className="text-xs text-white/40 mt-0.5">
              Removes your publisher registration and pauses all ad units. Your
              earnings remain claimable.
            </p>
          </div>
          <button
            onClick={() =>
              setToast({
                message: "Please contact support to deactivate your account.",
                type: "info",
              })
            }
            className="px-4 py-2 rounded-xl border border-red-500/30 text-red-400 text-sm font-medium hover:bg-red-500/10 transition-colors whitespace-nowrap"
          >
            Deactivate
          </button>
        </div>
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
