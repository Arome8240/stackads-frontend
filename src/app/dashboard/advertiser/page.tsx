"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useStacks } from "@/providers/StacksProvider";
import { useRegistry, useToken, useCampaign } from "@stackads/react";
import MetricCard from "@/components/dashboard/MetricCard";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { DollarCircle, Eye, MouseCircle, ChartCircle } from "iconsax-react";
import Link from "next/link";

export default function AdvertiserDashboard() {
  const { address, isConnected } = useStacks();
  const { advertiserInfo, getAdvertiser, loading: registryLoading } = useRegistry();
  const { balance, getBalance, formattedBalance } = useToken();
  const { campaigns, loading: campaignsLoading } = useCampaign();

  const [metrics, setMetrics] = useState({
    totalSpend: 0,
    impressions: 0,
    clicks: 0,
    ctr: 0,
  });

  useEffect(() => {
    if (address && isConnected) {
      loadDashboardData();
    }
  }, [address, isConnected]);

  const loadDashboardData = async () => {
    if (!address) return;
    
    try {
      await Promise.all([
        getAdvertiser(address),
        getBalance(address),
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
            Please connect your Stacks wallet to access the advertiser dashboard
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

  if (!advertiserInfo) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">Register as Advertiser</h2>
          <p className="text-white/60 mb-6">
            You need to register as an advertiser to access this dashboard
          </p>
          <Link
            href="/dashboard/advertiser/register"
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
      title: "Total Spend",
      value: `${(metrics.totalSpend / 1_000_000).toFixed(2)} SADS`,
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
          <h1 className="text-2xl font-bold">Advertiser Dashboard</h1>
          <p className="text-white/60 text-sm mt-1">
            Welcome back, {advertiserInfo.name}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-white/40">Wallet Balance</p>
            <p className="text-lg font-semibold">{formattedBalance} SADS</p>
          </div>
          <Link
            href="/dashboard/advertiser/campaigns/create"
            className="px-4 py-2 bg-[#f7931a] text-white rounded-lg hover:bg-[#f7931a]/90 transition-colors text-sm font-medium"
          >
            Create Campaign
          </Link>
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardMetrics.map((m, i) => (
          <MetricCard key={m.title} {...m} delay={i * 0.08} />
        ))}
      </div>

      {/* Advertiser Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="glass rounded-2xl p-6 border border-white/8"
      >
        <h2 className="text-base font-semibold text-white mb-4">
          Advertiser Information
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-white/40 mb-1">Company</p>
            <p className="text-sm font-medium">{advertiserInfo.company}</p>
          </div>
          <div>
            <p className="text-xs text-white/40 mb-1">Reputation Score</p>
            <p className="text-sm font-medium text-[#4ade80]">
              {advertiserInfo.reputation}/100
            </p>
          </div>
          <div>
            <p className="text-xs text-white/40 mb-1">Status</p>
            <p className="text-sm font-medium">
              {advertiserInfo.active ? (
                <span className="text-[#4ade80]">Active</span>
              ) : (
                <span className="text-[#f87171]">Inactive</span>
              )}
            </p>
          </div>
          <div>
            <p className="text-xs text-white/40 mb-1">Member Since</p>
            <p className="text-sm font-medium">
              {new Date(advertiserInfo.registeredAt * 1000).toLocaleDateString()}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Active Campaigns */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="glass rounded-2xl border border-white/8 overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
          <h2 className="text-base font-semibold text-white">
            Active Campaigns
          </h2>
          <Link
            href="/dashboard/advertiser/campaigns"
            className="text-xs text-[#f7931a] hover:underline"
          >
            View all →
          </Link>
        </div>
        
        {campaignsLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f7931a] mx-auto"></div>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-white/60 mb-4">No campaigns yet</p>
            <Link
              href="/dashboard/advertiser/campaigns/create"
              className="inline-block px-4 py-2 bg-[#f7931a] text-white rounded-lg hover:bg-[#f7931a]/90 transition-colors text-sm"
            >
              Create Your First Campaign
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  {["Campaign", "Status", "Budget", "Spent", "Impressions", "CTR"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-6 py-3 text-left text-xs font-medium text-white/30 uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {campaigns.slice(0, 5).map((c, i) => (
                  <tr
                    key={i}
                    className={`border-b border-white/5 hover:bg-white/3 transition-colors ${i % 2 === 0 ? "" : "bg-white/1"}`}
                  >
                    <td className="px-6 py-4 font-medium text-white">{c.name}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={c.active ? "active" : "paused"} />
                    </td>
                    <td className="px-6 py-4 text-white/60">
                      {(Number(c.budget) / 1_000_000).toFixed(2)} SADS
                    </td>
                    <td className="px-6 py-4 text-white/60">
                      {(Number(c.spent) / 1_000_000).toFixed(2)} SADS
                    </td>
                    <td className="px-6 py-4 text-white/60">
                      {c.impressions >= 1000 ? `${(c.impressions / 1000).toFixed(1)}K` : c.impressions}
                    </td>
                    <td className="px-6 py-4 text-[#4ade80] font-medium">
                      {c.impressions > 0 ? ((c.clicks / c.impressions) * 100).toFixed(2) : 0}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="glass rounded-2xl p-6 border border-white/8"
      >
        <h2 className="text-base font-semibold text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/dashboard/advertiser/campaigns/create"
            className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
          >
            <p className="text-sm font-medium">Create Campaign</p>
            <p className="text-xs text-white/40 mt-1">Launch new ads</p>
          </Link>
          <Link
            href="/dashboard/advertiser/creatives"
            className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
          >
            <p className="text-sm font-medium">Ad Creatives</p>
            <p className="text-xs text-white/40 mt-1">Manage assets</p>
          </Link>
          <Link
            href="/dashboard/advertiser/analytics"
            className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
          >
            <p className="text-sm font-medium">Analytics</p>
            <p className="text-xs text-white/40 mt-1">Performance insights</p>
          </Link>
          <Link
            href="/dashboard/advertiser/settings"
            className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
          >
            <p className="text-sm font-medium">Settings</p>
            <p className="text-xs text-white/40 mt-1">Account & billing</p>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
