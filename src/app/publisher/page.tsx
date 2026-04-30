"use client";
import { motion } from "framer-motion";
import { DollarCircle, Eye, MouseCircle, ChartCircle } from "iconsax-react";
import Link from "next/link";
import MetricCard from "@/components/dashboard/MetricCard";
import PerformanceChart from "@/components/dashboard/PerformanceChart";
import {
  publisherMetrics,
  publisherAnalytics,
  adUnits,
  earningsHistory,
} from "@/lib/mock-data";

const metrics = [
  {
    title: "Total Earned",
    value: `$${publisherMetrics.totalEarned.toLocaleString()}`,
    change: "+18.2%",
    positive: true,
    icon: <DollarCircle size={20} color="#4ade80" variant="Bold" />,
    iconBg: "bg-[#4ade80]/10",
  },
  {
    title: "This Month",
    value: `$${publisherMetrics.thisMonth.toFixed(2)}`,
    change: "+9.4%",
    positive: true,
    icon: <ChartCircle size={20} color="#f7931a" variant="Bold" />,
    iconBg: "bg-[#f7931a]/10",
  },
  {
    title: "Total Impressions",
    value: "1.3M",
    change: "+11.7%",
    positive: true,
    icon: <Eye size={20} color="#a855f7" variant="Bold" />,
    iconBg: "bg-[#a855f7]/10",
  },
  {
    title: "Avg. eCPM",
    value: `$${publisherMetrics.ecpm.toFixed(2)}`,
    change: "-0.1%",
    positive: false,
    icon: <MouseCircle size={20} color="#22d3ee" variant="Bold" />,
    iconBg: "bg-[#22d3ee]/10",
  },
];

export default function PublisherOverviewPage() {
  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <MetricCard key={m.title} {...m} delay={i * 0.08} />
        ))}
      </div>

      {/* Earnings chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="glass rounded-2xl p-6 border border-white/8"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-semibold text-white">
              Earnings Overview
            </h2>
            <p className="text-xs text-white/40 mt-0.5">
              Daily earnings — last 30 days
            </p>
          </div>
          <span className="text-xs text-white/30 px-3 py-1.5 rounded-lg bg-white/5">
            Mar 1 – Apr 3
          </span>
        </div>
        <PerformanceChart
          data={publisherAnalytics}
          lines={[
            { key: "earnings", color: "#4ade80", label: "Earnings ($)" },
            { key: "impressions", color: "#a855f7", label: "Impressions" },
          ]}
        />
      </motion.div>

      {/* Recent activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="glass rounded-2xl border border-white/8 overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
          <h2 className="text-base font-semibold text-white">
            Recent Activity
          </h2>
          <Link
            href="/publisher/earnings"
            className="text-xs text-[#4ade80] hover:underline"
          >
            View all →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {["Date", "Campaign", "Ad Unit", "Impressions", "Earnings"].map(
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
              {earningsHistory.slice(0, 5).map((r, i) => (
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
                  <td className="px-6 py-4 text-[#4ade80] font-semibold">
                    ${r.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Ad units summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="glass rounded-2xl border border-white/8 overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
          <h2 className="text-base font-semibold text-white">Top Ad Units</h2>
          <Link
            href="/publisher/ad-units"
            className="text-xs text-[#4ade80] hover:underline"
          >
            Manage →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {["Ad Unit", "Format", "Impressions", "CTR", "Earnings"].map(
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
              {adUnits.slice(0, 4).map((u, i) => (
                <tr
                  key={u.id}
                  className={`border-b border-white/5 hover:bg-white/3 transition-colors ${i % 2 !== 0 ? "bg-white/1" : ""}`}
                >
                  <td className="px-6 py-4 font-medium text-white">{u.name}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs px-2 py-1 rounded-lg bg-[#a855f7]/10 text-[#a855f7]">
                      {u.format}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-white/60">
                    {(u.impressions / 1000).toFixed(0)}K
                  </td>
                  <td className="px-6 py-4 text-[#22d3ee] font-medium">
                    {u.ctr}%
                  </td>
                  <td className="px-6 py-4 text-[#4ade80] font-semibold">
                    ${u.earnings.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
