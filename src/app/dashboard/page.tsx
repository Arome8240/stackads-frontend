"use client";
import { motion } from "framer-motion";
import { useStacks } from "@/providers/StacksProvider";
import Link from "next/link";
import { Chart, People, ShieldTick } from "iconsax-react";

export default function DashboardPage() {
  const { isConnected, address } = useStacks();

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">Welcome to StackAds</h2>
          <p className="text-white/60 mb-6">
            Connect your Stacks wallet to access your dashboard
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Choose Your Dashboard</h1>
        <p className="text-white/60">
          Select the dashboard that matches your role
        </p>
      </div>

      {/* Dashboard Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Publisher Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Link
            href="/dashboard/publisher"
            className="block glass rounded-2xl p-8 border border-white/8 hover:border-[#a855f7]/50 transition-all group"
          >
            <div className="w-16 h-16 rounded-xl bg-[#a855f7]/10 flex items-center justify-center mb-6 group-hover:bg-[#a855f7]/20 transition-colors">
              <Chart size={32} color="#a855f7" variant="Bold" />
            </div>
            <h2 className="text-xl font-bold mb-2">Publisher</h2>
            <p className="text-white/60 text-sm mb-4">
              Monetize your website by displaying ads and earning revenue
            </p>
            <ul className="text-xs text-white/40 space-y-2">
              <li>• Manage ad placements</li>
              <li>• Track earnings & analytics</li>
              <li>• Withdraw payments</li>
              <li>• Build reputation</li>
            </ul>
            <div className="mt-6 pt-4 border-t border-white/10">
              <span className="text-sm text-[#a855f7] group-hover:underline">
                Go to Publisher Dashboard →
              </span>
            </div>
          </Link>
        </motion.div>

        {/* Advertiser Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Link
            href="/dashboard/advertiser"
            className="block glass rounded-2xl p-8 border border-white/8 hover:border-[#f7931a]/50 transition-all group"
          >
            <div className="w-16 h-16 rounded-xl bg-[#f7931a]/10 flex items-center justify-center mb-6 group-hover:bg-[#f7931a]/20 transition-colors">
              <People size={32} color="#f7931a" variant="Bold" />
            </div>
            <h2 className="text-xl font-bold mb-2">Advertiser</h2>
            <p className="text-white/60 text-sm mb-4">
              Create campaigns and reach your target audience effectively
            </p>
            <ul className="text-xs text-white/40 space-y-2">
              <li>• Create ad campaigns</li>
              <li>• Target audiences</li>
              <li>• Track performance</li>
              <li>• Manage budgets</li>
            </ul>
            <div className="mt-6 pt-4 border-t border-white/10">
              <span className="text-sm text-[#f7931a] group-hover:underline">
                Go to Advertiser Dashboard →
              </span>
            </div>
          </Link>
        </motion.div>

        {/* Admin Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Link
            href="/dashboard/admin"
            className="block glass rounded-2xl p-8 border border-white/8 hover:border-[#4ade80]/50 transition-all group"
          >
            <div className="w-16 h-16 rounded-xl bg-[#4ade80]/10 flex items-center justify-center mb-6 group-hover:bg-[#4ade80]/20 transition-colors">
              <ShieldTick size={32} color="#4ade80" variant="Bold" />
            </div>
            <h2 className="text-xl font-bold mb-2">Super Admin</h2>
            <p className="text-white/60 text-sm mb-4">
              Manage the entire platform and monitor all activities
            </p>
            <ul className="text-xs text-white/40 space-y-2">
              <li>• User management</li>
              <li>• Platform analytics</li>
              <li>• Smart contract controls</li>
              <li>• Financial oversight</li>
            </ul>
            <div className="mt-6 pt-4 border-t border-white/10">
              <span className="text-sm text-[#4ade80] group-hover:underline">
                Go to Admin Dashboard →
              </span>
            </div>
          </Link>
        </motion.div>
      </div>

      {/* Info Box */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="glass rounded-2xl p-6 border border-white/8 mt-8"
      >
        <h3 className="text-sm font-semibold mb-3">Connected Wallet</h3>
        <div className="flex items-center justify-between">
          <p className="text-sm font-mono text-white/60">{address}</p>
          <span className="px-3 py-1 bg-[#4ade80]/10 text-[#4ade80] text-xs rounded-full">
            Connected
          </span>
        </div>
      </motion.div>
    </div>
  );
}
