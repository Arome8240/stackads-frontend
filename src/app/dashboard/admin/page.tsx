"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useStacks } from "@/providers/StacksProvider";
import { useToken } from "@stackads/react";
import MetricCard from "@/components/dashboard/MetricCard";
import { 
  DollarCircle, 
  People, 
  Chart, 
  ShieldTick,
  Eye,
  MouseCircle 
} from "iconsax-react";
import Link from "next/link";

export default function AdminDashboard() {
  const { address, isConnected } = useStacks();
  const { balance, getBalance, formattedBalance } = useToken();

  const [platformMetrics, setPlatformMetrics] = useState({
    totalUsers: 0,
    totalPublishers: 0,
    totalAdvertisers: 0,
    totalRevenue: 0,
    activeCampaigns: 0,
    totalImpressions: 0,
    totalClicks: 0,
    platformFees: 0,
  });

  useEffect(() => {
    if (address && isConnected) {
      loadAdminData();
    }
  }, [address, isConnected]);

  const loadAdminData = async () => {
    if (!address) return;

    try {
      await getBalance(address);
      // TODO: Load platform-wide metrics from smart contracts
      // For now using mock data
      setPlatformMetrics({
        totalUsers: 1247,
        totalPublishers: 523,
        totalAdvertisers: 724,
        totalRevenue: 125000,
        activeCampaigns: 89,
        totalImpressions: 5200000,
        totalClicks: 156000,
        platformFees: 12500,
      });
    } catch (error) {
      console.error("Error loading admin data:", error);
    }
  };

  // Check if user is admin (in production, this should be verified on-chain)
  const isAdmin = address === process.env.NEXT_PUBLIC_ADMIN_ADDRESS;

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
          <p className="text-white/60 mb-6">
            Please connect your Stacks wallet to access the admin dashboard
          </p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldTick size={32} color="#ef4444" variant="Bold" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-white/60 mb-6">
            You don't have permission to access the admin dashboard
          </p>
          <Link
            href="/dashboard"
            className="inline-block px-6 py-3 bg-[#f7931a] text-white rounded-lg hover:bg-[#f7931a]/90 transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const adminMetrics = [
    {
      title: "Total Users",
      value: platformMetrics.totalUsers.toLocaleString(),
      change: "+12.4%",
      positive: true,
      icon: <People size={20} color="#f7931a" variant="Bold" />,
      iconBg: "bg-[#f7931a]/10",
    },
    {
      title: "Platform Revenue",
      value: `${(platformMetrics.totalRevenue / 1_000_000).toFixed(2)} SADS`,
      change: "+18.2%",
      positive: true,
      icon: <DollarCircle size={20} color="#4ade80" variant="Bold" />,
      iconBg: "bg-[#4ade80]/10",
    },
    {
      title: "Active Campaigns",
      value: platformMetrics.activeCampaigns.toString(),
      change: "+5.3%",
      positive: true,
      icon: <Chart size={20} color="#a855f7" variant="Bold" />,
      iconBg: "bg-[#a855f7]/10",
    },
    {
      title: "Platform Fees",
      value: `${(platformMetrics.platformFees / 1_000_000).toFixed(2)} SADS`,
      change: "+15.7%",
      positive: true,
      icon: <ShieldTick size={20} color="#22d3ee" variant="Bold" />,
      iconBg: "bg-[#22d3ee]/10",
    },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Super Admin Dashboard</h1>
          <p className="text-white/60 text-sm mt-1">
            Platform-wide management and analytics
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-white/40">Treasury Balance</p>
          <p className="text-lg font-semibold">{formattedBalance} SADS</p>
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {adminMetrics.map((m, i) => (
          <MetricCard key={m.title} {...m} delay={i * 0.08} />
        ))}
      </div>

      {/* Platform Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="glass rounded-2xl p-6 border border-white/8"
      >
        <h2 className="text-base font-semibold text-white mb-4">
          Platform Statistics
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-white/40 mb-1">Publishers</p>
            <p className="text-2xl font-bold text-[#4ade80]">
              {platformMetrics.totalPublishers}
            </p>
          </div>
          <div>
            <p className="text-xs text-white/40 mb-1">Advertisers</p>
            <p className="text-2xl font-bold text-[#f7931a]">
              {platformMetrics.totalAdvertisers}
            </p>
          </div>
          <div>
            <p className="text-xs text-white/40 mb-1">Total Impressions</p>
            <p className="text-2xl font-bold text-[#a855f7]">
              {(platformMetrics.totalImpressions / 1_000_000).toFixed(1)}M
            </p>
          </div>
          <div>
            <p className="text-xs text-white/40 mb-1">Total Clicks</p>
            <p className="text-2xl font-bold text-[#22d3ee]">
              {(platformMetrics.totalClicks / 1000).toFixed(0)}K
            </p>
          </div>
        </div>
      </motion.div>

      {/* Management Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="glass rounded-2xl p-6 border border-white/8"
        >
          <h2 className="text-base font-semibold text-white mb-4">
            User Management
          </h2>
          <div className="space-y-3">
            <Link
              href="/dashboard/admin/users"
              className="block p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <p className="text-sm font-medium">All Users</p>
              <p className="text-xs text-white/40 mt-1">
                View and manage all platform users
              </p>
            </Link>
            <Link
              href="/dashboard/admin/verification"
              className="block p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <p className="text-sm font-medium">Verification Queue</p>
              <p className="text-xs text-white/40 mt-1">
                Approve pending registrations
              </p>
            </Link>
            <Link
              href="/dashboard/admin/moderation"
              className="block p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <p className="text-sm font-medium">Content Moderation</p>
              <p className="text-xs text-white/40 mt-1">
                Review flagged content
              </p>
            </Link>
          </div>
        </motion.div>

        {/* Financial Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="glass rounded-2xl p-6 border border-white/8"
        >
          <h2 className="text-base font-semibold text-white mb-4">
            Financial Management
          </h2>
          <div className="space-y-3">
            <Link
              href="/dashboard/admin/treasury"
              className="block p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <p className="text-sm font-medium">Treasury</p>
              <p className="text-xs text-white/40 mt-1">
                Manage platform treasury
              </p>
            </Link>
            <Link
              href="/dashboard/admin/transactions"
              className="block p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <p className="text-sm font-medium">Transactions</p>
              <p className="text-xs text-white/40 mt-1">
                Monitor all transactions
              </p>
            </Link>
            <Link
              href="/dashboard/admin/disputes"
              className="block p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <p className="text-sm font-medium">Disputes</p>
              <p className="text-xs text-white/40 mt-1">
                Resolve payment disputes
              </p>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Smart Contract Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
        className="glass rounded-2xl p-6 border border-white/8"
      >
        <h2 className="text-base font-semibold text-white mb-4">
          Smart Contract Controls
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/dashboard/admin/contracts"
            className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
          >
            <p className="text-sm font-medium">Contracts</p>
            <p className="text-xs text-white/40 mt-1">Manage contracts</p>
          </Link>
          <Link
            href="/dashboard/admin/staking"
            className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
          >
            <p className="text-sm font-medium">Staking</p>
            <p className="text-xs text-white/40 mt-1">View all stakes</p>
          </Link>
          <Link
            href="/dashboard/admin/governance"
            className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
          >
            <p className="text-sm font-medium">Governance</p>
            <p className="text-xs text-white/40 mt-1">Manage proposals</p>
          </Link>
          <Link
            href="/dashboard/admin/analytics"
            className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
          >
            <p className="text-sm font-medium">Analytics</p>
            <p className="text-xs text-white/40 mt-1">Platform insights</p>
          </Link>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.7 }}
        className="glass rounded-2xl border border-white/8 overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
          <h2 className="text-base font-semibold text-white">
            Recent Activity
          </h2>
          <Link
            href="/dashboard/admin/activity"
            className="text-xs text-[#f7931a] hover:underline"
          >
            View all →
          </Link>
        </div>
        <div className="p-6">
          <p className="text-sm text-white/60 text-center py-8">
            Activity log will be displayed here
          </p>
        </div>
      </motion.div>
    </div>
  );
}
