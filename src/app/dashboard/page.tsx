"use client";
import { motion } from "framer-motion";
import MetricCard from "@/components/dashboard/MetricCard";
import StatusBadge from "@/components/dashboard/StatusBadge";
import PerformanceChart from "@/components/dashboard/PerformanceChart";
import { campaigns, analyticsData } from "@/lib/mock-data";
import { dashboardMetrics, performanceChartLines } from "@/lib/dashboard-config";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardMetrics.map((m, i) => (
          <MetricCard key={m.title} {...m} delay={i * 0.08} />
        ))}
      </div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="glass rounded-2xl p-6 border border-white/8"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-semibold text-white">
              Performance Overview
            </h2>
            <p className="text-xs text-white/40 mt-0.5">Last 30 days</p>
          </div>
          <span className="text-xs text-white/30 px-3 py-1.5 rounded-lg bg-white/5">
            Mar 1 – Apr 3
          </span>
        </div>
        <PerformanceChart data={analyticsData} lines={performanceChartLines} />
      </motion.div>

      {/* Recent campaigns */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="glass rounded-2xl border border-white/8 overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
          <h2 className="text-base font-semibold text-white">
            Recent Campaigns
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
              {campaigns.slice(0, 4).map((c, i) => (
                <tr
                  key={c.id}
                  className={`border-b border-white/5 hover:bg-white/3 transition-colors ${i % 2 === 0 ? "" : "bg-white/1"}`}
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
    </div>
  );
}
