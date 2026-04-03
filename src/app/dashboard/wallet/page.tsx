"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Wallet,
  ArrowCircleUp,
  ArrowCircleDown,
  TickCircle,
  WalletAdd,
} from "iconsax-react";
import Toast from "@/components/dashboard/Toast";
import type { ToastType } from "@/components/dashboard/Toast";
import { transactions } from "@/lib/mock-data";

const typeStyles = {
  Deposit: {
    color: "text-[#4ade80]",
    bg: "bg-[#4ade80]/10",
    icon: <ArrowCircleDown size={18} color="#4ade80" variant="Bold" />,
    prefix: "+",
  },
  Spend: {
    color: "text-red-400",
    bg: "bg-red-500/10",
    icon: <ArrowCircleUp size={18} color="#f87171" variant="Bold" />,
    prefix: "",
  },
  Refund: {
    color: "text-[#22d3ee]",
    bg: "bg-[#22d3ee]/10",
    icon: <TickCircle size={18} color="#22d3ee" variant="Bold" />,
    prefix: "+",
  },
};

export default function WalletPage() {
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);
  const [funding, setFunding] = useState(false);
  const [amount, setAmount] = useState("");

  const handleFund = () => {
    if (!amount || Number(amount) <= 0) {
      setToast({ message: "Please enter a valid amount.", type: "error" });
      return;
    }
    setFunding(true);
    setTimeout(() => {
      setFunding(false);
      setAmount("");
      setToast({
        message: `$${Number(amount).toLocaleString()} added to your wallet!`,
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
        className="glass rounded-2xl p-8 border border-[#f7931a]/20 orange-glow relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#f7931a]/5 blur-[80px] pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#f7931a]/15 flex items-center justify-center">
              <Wallet size={24} color="#f7931a" variant="Bold" />
            </div>
            <div>
              <p className="text-xs text-white/40 uppercase tracking-widest">
                Current Balance
              </p>
              <p className="text-3xl font-bold text-white mt-0.5">$2,340.00</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex flex-col gap-1.5">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm">
                  $
                </span>
                <input
                  type="number"
                  placeholder="Enter amount"
                  min="10"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#f7931a]/50 transition-colors"
                />
              </div>
            </div>
            <motion.button
              onClick={handleFund}
              disabled={funding}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-[#f7931a] to-[#e8820a] text-black font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-60 whitespace-nowrap"
            >
              {funding ? (
                <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <WalletAdd size={18} color="#000" variant="Bold" />
              )}
              {funding ? "Processing..." : "Fund Wallet"}
            </motion.button>
          </div>

          <p className="text-xs text-white/30 mt-3">
            Funds are settled on-chain via the Stacks network. Tx hash provided
            on confirmation.
          </p>
        </div>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "Total Deposited",
            value: "$7,000",
            color: "text-[#4ade80]",
          },
          { label: "Total Spent", value: "$4,660", color: "text-red-400" },
          { label: "Total Refunded", value: "$120", color: "text-[#22d3ee]" },
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

      {/* Transaction history */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="glass rounded-2xl border border-white/8 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-white/8">
          <h3 className="text-base font-semibold text-white">
            Transaction History
          </h3>
          <p className="text-xs text-white/40 mt-0.5">
            {transactions.length} transactions
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {["Type", "Description", "Amount", "Date", "Tx Hash"].map(
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
              {transactions.map((tx, i) => {
                const s = typeStyles[tx.type];
                return (
                  <tr
                    key={tx.id}
                    className={`border-b border-white/5 hover:bg-white/3 transition-colors ${i % 2 !== 0 ? "bg-white/1" : ""}`}
                  >
                    <td className="px-6 py-4">
                      <div
                        className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full ${s.bg} text-xs font-medium ${s.color}`}
                      >
                        {s.icon}
                        {tx.type}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white/60 max-w-[200px] truncate">
                      {tx.description}
                    </td>
                    <td className={`px-6 py-4 font-semibold ${s.color}`}>
                      {s.prefix}
                      {Math.abs(tx.amount) < 0 ? "" : ""}
                      {tx.amount > 0 ? "+" : ""}$
                      {Math.abs(tx.amount).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-white/40 whitespace-nowrap">
                      {tx.date}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs text-[#a855f7] bg-[#a855f7]/10 px-2 py-1 rounded-lg">
                        {tx.txHash}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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
