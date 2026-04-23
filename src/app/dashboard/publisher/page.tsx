"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useStacks } from "@/providers/StacksProvider";
import { useRegistry, useToken, useStaking } from "@stackads/react";
import MetricCard from "@/components/dashboard/MetricCard";
import { DollarCircle, Eye, MouseCircle, ChartCircle } from "iconsax-react";
import Link from "next/link";

export default function PublisherDashboard() {
  const { address, isConnected } = useStacks();
  const { publisherInfo, getPublisher, loading: registryLoading } = useRegistry();
  const { balance, getBalance, formattedBalance } = useToken();
  const { stakeInfo, getStakeInfo, formattedStake } = useStaking();

  const [metrics, setMetrics] = useState({
    totalEarnings: 0,
    impressions: 0,
    clicks: 0,
    ctr: 0,
  });

  useEffect(() => {
    if (address && isConnected) {
      loadDashboardData();
    }
  }, [address, isConnected]);

  useEffect(() => {
    if (publisherInfo) {
      setMetrics({
        totalEarnings: Number(publisherInfo.totalEarnings || 0),
        impressions: publisherInfo.totalImpressions,
        clicks: publisherInfo.totalClicks,
        ctr: publisherInfo.totalImpressions > 0 
          ? (publisherInfo.totalClicks / publisherInfo.totalImpressions) * 100 
          : 0,
      });
    }
  }, [publisherInfo]);

  const loadDashboardData = async () => {
    if (!address) return;
    
    try {
      await Promise.all([
        getPublisher(address),
        getBalance(address),
        getStakeInfo(address),
      ]);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
  };

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
          <p className="text-white/60 mb-6">
            Please connect your Stacks wallet to access the publisher dashboard
          </p>
        </div>
      </div>
    );
  }

  if (registryLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f7931a] mx-auto mb-4"></div>
          <p className="text-white/60">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!publisherInfo) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">Register as Publisher</h2>
          <p className="text-white/60 mb-6">
            You need to register as a publisher to access this dashboard
          </p>
          <Link
            href="/dashboard/publisher/register"
            className="inline-block px-6 py-3 bg-[#f7931a] text-white rounded-lg hover:bg-[#f7931a]/90 transition-colors"
          >
            Register Now
          </Link>
        </div>
      </div>
    );
  }

  const dashboardMetrics = [
    {
      title: "Total Earnings",
      value: `${(metrics.totalEarnings / 1_000_000).toFixed(2)} SADS`,
      change: "+12.4%",
      positive: true,
      icon: <DollarCircle size={20} color="#f7931a" variant="Bold" />,
      iconBg: "bg-[#f7931a]/10",
    },
    {
      title: "Impressions",
      value: metrics.impressions >= 1000 
        ? `${(metrics.impressions / 1000).toFixed(1)}K` 
        : metrics.impressions.toString(),
      change: "+8.1%",
      positive: true,
      icon: <Eye size={20} color="#a855f7" variant="Bold" />,
      iconBg: "bg-[#a855f7]/10",
    },
    {
      title: "Clicks",
      value: metrics.clicks >= 1000 
        ? `${(metrics.clicks / 1000).toFixed(1)}K` 
        : metrics.clicks.toString(),
      change: "+5.3%",
      positive: true,
      icon: <MouseCircle size={20} color="#22d3ee" variant="Bold" />,
      iconBg: "bg-[#22d3ee]/10",
    },
    {
      title: "CTR",
      value: `${metrics.ctr.toFixed(2)}%`,
      change: "-0.2%",
      positive: false,
      icon: <ChartCircle size={20} color="#4ade80" variant="Bold" />,
      iconBg: "bg-[#4ade80]/10",
    },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Publisher Dashboard</h1>
          <p className="text-white/60 text-sm mt-1">
            Welcome back, {publisherInfo.name}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-white/40">Wallet Balance</p>
            <p className="text-lg font-semibold">{formattedBalance} SADS</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/40">Staked</p>
            <p className="text-lg font-semibold">{formattedStake} SADS</p>
          </div>
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardMetrics.map((m, i) => (
          <MetricCard key={m.title} {...m} delay={i * 0.08} />
        ))}
      </div>

      {/* Publisher Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="glass rounded-2xl p-6 border border-white/8"
      >
        <h2 className="text-base font-semibold text-white mb-4">
          Publisher Information
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-white/40 mb-1">Website</p>
            <p className="text-sm font-medium">{publisherInfo.website}</p>
          </div>
          <div>
            <p className="text-xs text-white/40 mb-1">Reputation Score</p>
            <p className="text-sm font-medium text-[#4ade80]">
              {publisherInfo.reputation}/100
            </p>
          </div>
          <div>
            <p className="text-xs text-white/40 mb-1">Status</p>
            <p className="text-sm font-medium">
              {publisherInfo.active ? (
                <span className="text-[#4ade80]">Active</span>
              ) : (
                <span className="text-[#f87171]">Inactive</span>
              )}
            </p>
          </div>
          <div>
            <p className="text-xs text-white/40 mb-1">Member Since</p>
            <p className="text-sm font-medium">
              {new Date(publisherInfo.registeredAt * 1000).toLocaleDateString()}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="glass rounded-2xl p-6 border border-white/8"
      >
        <h2 className="text-base font-semibold text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/dashboard/publisher/placements"
            className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
          >
            <p className="text-sm font-medium">Manage Placements</p>
            <p className="text-xs text-white/40 mt-1">Create & edit ad slots</p>
          </Link>
          <Link
            href="/dashboard/publisher/analytics"
            className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
          >
            <p className="text-sm font-medium">View Analytics</p>
            <p className="text-xs text-white/40 mt-1">Detailed performance</p>
          </Link>
          <Link
            href="/dashboard/publisher/payouts"
            className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
          >
            <p className="text-sm font-medium">Payouts</p>
            <p className="text-xs text-white/40 mt-1">Earnings & withdrawals</p>
          </Link>
          <Link
            href="/dashboard/publisher/settings"
            className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
          >
            <p className="text-sm font-medium">Settings</p>
            <p className="text-xs text-white/40 mt-1">Profile & preferences</p>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
