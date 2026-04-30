"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  DollarCircle,
  WalletMoney,
  ArrowCircleDown,
  TrendUp,
  Receipt,
} from "iconsax-react";
import PerformanceChart from "@/components/dashboard/PerformanceChart";
import Toast from "@/components/dashboard/Toast";
import EmptyState from "@/components/ui/EmptyState";
import type { ToastType } from "@/components/dashboard/Toast";
import {
  earningsHistory,
  publisherAnalytics,
  publisherMetrics,
} from "@/lib/mock-data";

const MIN_WITHDRAWAL = 10;

export default function EarningsPage() {
  const [amount, setAmount] = useState("");
  const [withdrawing, setWithdrawing] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  const balance = 142.8;

  const handleWithdraw = () => {
    const val = Number(amount);
    if (!val || val <= 0) {
      setToast({ message: "Enter a valid amount.", type: "error" });
      return;
    }
    if (val < MIN_WITHDRAWAL) {
      setToast({
        message: `Minimum withdrawal is $${MIN_WITHDRAWAL}.`,
        type: "error",
      });
      return;
    }
    if (val > balance) {
      setToast({ message: "Amount exceeds available balance.", type: "error" });
      return;
    }
    setWithdrawing(true);
    setTimeout(() => {
      setWithdrawing(false);
      setAmount("");
      setToast({
        message: `$${val.toFixed(2)} withdrawn to your wallet!`,
        type: "success",
      });
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      {/* Balance card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass rounded-2xl p-8 border border-[#4ade80]/20 relative overflow-hidden"
        style={{ boxShadow: "0 0 60px rgba(74,222,128,0.1)" }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#4ade80]/5 blur-[80px] pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#4ade80]/15 flex items-center justify-center">
              <WalletMoney size={24} color="#4ade80" variant="Bold" />
            </div>
            <div>
              <p className="text-xs text-white/40 uppercase tracking-widest">
                Withdrawable Balance
              </p>
              <p className="text-3xl font-bold text-white mt-0.5">
                ${balance.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Threshold indicator */}
          <div className="mb-5">
            <div className="flex items-center justify-between text-xs text-white/40 mb-1.5">
              <span>Minimum withdrawal: ${MIN_WITHDRAWAL}</span>
              <span>
                {((balance / MIN_WITHDRAWAL) * 100).toFixed(0)}% of threshold
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-[#4ade80]"
                style={{
                  width: `${Math.min((balance / MIN_WITHDRAWAL) * 100, 100)}%`,
                }}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm">
                $
              </span>
              <input
                type="number"
                placeholder="Enter amount"
                min={MIN_WITHDRAWAL}
                max={balance}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-8 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#4ade80]/50 transition-colors"
              />
            </div>
            <motion.button
              onClick={handleWithdraw}
              disabled={withdrawing}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-[#4ade80] to-[#22d3ee] text-black font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-60 whitespace-nowrap"
            >
              {withdrawing ? (
                <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <ArrowCircleDown size={18} color="#000" variant="Bold" />
              )}
              {withdrawing ? "Processing..." : "Withdraw"}
            </motion.button>
          </div>
          <p className="text-xs text-white/30 mt-3">
            Funds are sent directly to your connected wallet via Stacks network.
          </p>
        </div>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "Total Earned",
            value: `$${publisherMetrics.totalEarned.toLocaleString()}`,
            color: "text-[#4ade80]",
          },
          {
            label: "This Month",
            value: `$${publisherMetrics.thisMonth.toFixed(2)}`,
            color: "text-[#22d3ee]",
          },
          {
            label: "Total Withdrawn",
            value: "$2,542.20",
            color: "text-[#a855f7]",
          },
        ].map((s) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="glass rounded-2xl p-4 border border-white/8 text-center"
          >
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-white/40 mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Cumulative earnings chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="glass rounded-2xl p-6 border border-white/8"
      >
        <div className="flex items-center gap-2 mb-1">
          <TrendUp size={18} color="#4ade80" variant="Bold" />
          <h3 className="text-base font-semibold text-white">
            Earnings Over Time
          </h3>
        </div>
        <p className="text-xs text-white/30 mb-6 ml-6">
          Daily earnings — last 30 days
        </p>
        <PerformanceChart
          data={publisherAnalytics}
          lines={[{ key: "earnings", color: "#4ade80", label: "Earnings ($)" }]}
          height={220}
        />
      </motion.div>

      {/* Earnings history */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="glass rounded-2xl border border-white/8 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-white/8">
          <h3 className="text-base font-semibold text-white">
            Earnings History
          </h3>
          <p className="text-xs text-white/40 mt-0.5">
            {earningsHistory.length} records
          </p>
        </div>
        {earningsHistory.length === 0 ? (
          <EmptyState
            icon={<Receipt size={28} color="#4ade80" variant="Bold" />}
            title="No earnings yet"
            description="Your earnings will appear here once ads start serving on your units."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  {["Date", "Campaign", "Ad Unit", "Impressions", "Amount"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-6 py-3 text-left text-xs font-medium text-white/30 uppercase tracking-wider whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {earningsHistory.map((r, i) => (
                  <tr
                    key={r.id}
                    className={`border-b border-white/5 hover:bg-white/3 transition-colors ${i % 2 !== 0 ? "bg-white/1" : ""}`}
                  >
                    <td className="px-6 py-4 text-white/40 whitespace-nowrap">
                      {r.date}
                    </td>
                    <td className="px-6 py-4 text-white/70">{r.campaign}</td>
                    <td className="px-6 py-4 text-white/50">{r.adUnit}</td>
                    <td className="px-6 py-4 text-white/60">
                      {r.impressions.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 text-[#4ade80] font-semibold">
                        <DollarCircle
                          size={14}
                          color="#4ade80"
                          variant="Bold"
                        />
                        {r.amount.toFixed(2)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
