"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { DollarCircle, Eye, MouseCircle, ChartCircle } from "iconsax-react";
import Link from "next/link";
import MetricCard from "@/components/dashboard/MetricCard";
import StatusBadge from "@/components/dashboard/StatusBadge";
import SkeletonCard from "@/components/ui/SkeletonCard";
import SkeletonTable from "@/components/ui/SkeletonTable";
import { overviewMetrics, campaigns, analyticsData } from "@/lib/mock-data";

export default function AdvertiserDashboard() {
  const [loading] = useState(false);

  const dashboardMetrics = [
    {
      title: "Total Spend",
      value: `$${overviewMetrics.totalSpend.toLocaleString()}`,
      change: "+12.4%",
      positive: true,
      icon: <DollarCircle size={20} color="#f7931a" variant="Bold" />,
      iconBg: "bg-[#f7931a]/10",
    },
    {
      title: "Impressions",
      value: "1.2M",
      change: "+8.1%",
      positive: true,
      icon: <Eye size={20} color="#a855f7" variant="Bold" />,
      iconBg: "bg-[#a855f7]/10",
    },
    {
      title: "Clicks",
      value: "45K",
      change: "+5.3%",
      positive: true,
      icon: <MouseCircle size={20} color="#22d3ee" variant="Bold" />,
      iconBg: "bg-[#22d3ee]/10",
    },
    {
      title: "CTR",
      value: `${overviewMetrics.ctr}%`,
      change: "-0.2%",
      positive: false,
      icon: <ChartCircle size={20} color="#4ade80" variant="Bold" />,
      iconBg: "bg-[#4ade80]/10",
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col gap-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        <div className="glass rounded-2xl border border-white/8 overflow-hidden">
          <SkeletonTable rows={5} cols={6} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardMetrics.map((m, i) => (
          <MetricCard key={m.title} {...m} delay={i * 0.08} />
        ))}
      </div>

      {/* Active Campaigns */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="glass rounded-2xl border border-white/8 overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
          <h2 className="text-base font-semibold text-white">
            Active Campaigns
          </h2>
          <Link
            href="/dashboard/campaigns"
            className="text-xs text-[#f7931a] hover:underline"
          >
            View all →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {["Campaign", "Status", "Budget", "Impressions", "CTR"].map(
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
                  key={c.id}
                  className={`border-b border-white/5 hover:bg-white/3 transition-colors ${i % 2 !== 0 ? "bg-white/1" : ""}`}
                >
                  <td className="px-6 py-4 font-medium text-white">{c.name}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="px-6 py-4 text-white/60">
                    ${c.budget.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-white/60">
                    {(c.impressions / 1000).toFixed(0)}K
                  </td>
                  <td className="px-6 py-4 text-[#4ade80] font-medium">
                    {c.ctr}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
          {[
            {
              label: "Create Campaign",
              sub: "Launch new ads",
              href: "/dashboard/create",
            },
            {
              label: "Analytics",
              sub: "Performance insights",
              href: "/dashboard/analytics",
            },
            { label: "Wallet", sub: "Manage funds", href: "/dashboard/wallet" },
            {
              label: "Campaigns",
              sub: "View all campaigns",
              href: "/dashboard/campaigns",
            },
          ].map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
            >
              <p className="text-sm font-medium text-white">{a.label}</p>
              <p className="text-xs text-white/40 mt-1">{a.sub}</p>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
