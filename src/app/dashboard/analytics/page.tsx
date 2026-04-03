"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, TrendUp } from "iconsax-react";
import PerformanceChart from "@/components/dashboard/PerformanceChart";
import MetricCard from "@/components/dashboard/MetricCard";
import { analyticsData, overviewMetrics } from "@/lib/mock-data";
import { DollarCircle, Eye, MouseCircle, ChartCircle } from "iconsax-react";

const ranges = ["7D", "30D", "90D", "All"];

const metrics = [
  {
    title: "Total Impressions",
    value: "1.2M",
    change: "+8.1%",
    positive: true,
    icon: <Eye size={20} color="#a855f7" variant="Bold" />,
    iconBg: "bg-[#a855f7]/10",
  },
  {
    title: "Total Clicks",
    value: "45K",
    change: "+5.3%",
    positive: true,
    icon: <MouseCircle size={20} color="#22d3ee" variant="Bold" />,
    iconBg: "bg-[#22d3ee]/10",
  },
  {
    title: "Total Spend",
    value: `$${overviewMetrics.totalSpend.toLocaleString()}`,
    change: "+12.4%",
    positive: true,
    icon: <DollarCircle size={20} color="#f7931a" variant="Bold" />,
    iconBg: "bg-[#f7931a]/10",
  },
  {
    title: "Avg. CTR",
    value: `${overviewMetrics.ctr}%`,
    change: "-0.2%",
    positive: false,
    icon: <ChartCircle size={20} color="#4ade80" variant="Bold" />,
    iconBg: "bg-[#4ade80]/10",
  },
];

export default function AnalyticsPage() {
  const [range, setRange] = useState("30D");

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h2 className="text-xl font-bold text-white">Analytics</h2>
          <p className="text-sm text-white/40 mt-0.5">
            Track your campaign performance over time
          </p>
        </div>

        {/* Date range filter */}
        <div className="flex items-center gap-1 glass rounded-xl p-1 border border-white/8">
          <Calendar size={16} color="#f7931a" className="ml-2" />
          {ranges.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                range === r
                  ? "bg-[#f7931a]/20 text-[#f7931a]"
                  : "text-white/40 hover:text-white"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <MetricCard key={m.title} {...m} delay={i * 0.08} />
        ))}
      </div>

      {/* Impressions chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="glass rounded-2xl p-6 border border-white/8"
      >
        <div className="flex items-center gap-2 mb-1">
          <TrendUp size={18} color="#a855f7" variant="Bold" />
          <h3 className="text-base font-semibold text-white">
            Impressions Over Time
          </h3>
        </div>
        <p className="text-xs text-white/30 mb-6 ml-6">
          Daily impressions across all campaigns
        </p>
        <PerformanceChart
          data={analyticsData}
          lines={[
            { key: "impressions", color: "#a855f7", label: "Impressions" },
          ]}
          height={240}
        />
      </motion.div>

      {/* Clicks chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.38 }}
        className="glass rounded-2xl p-6 border border-white/8"
      >
        <div className="flex items-center gap-2 mb-1">
          <TrendUp size={18} color="#22d3ee" variant="Bold" />
          <h3 className="text-base font-semibold text-white">
            Clicks Over Time
          </h3>
        </div>
        <p className="text-xs text-white/30 mb-6 ml-6">
          Daily clicks across all campaigns
        </p>
        <PerformanceChart
          data={analyticsData}
          lines={[{ key: "clicks", color: "#22d3ee", label: "Clicks" }]}
          height={240}
        />
      </motion.div>

      {/* Spend vs performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.46 }}
        className="glass rounded-2xl p-6 border border-white/8"
      >
        <div className="flex items-center gap-2 mb-1">
          <TrendUp size={18} color="#f7931a" variant="Bold" />
          <h3 className="text-base font-semibold text-white">
            Spend vs Performance
          </h3>
        </div>
        <p className="text-xs text-white/30 mb-6 ml-6">
          Daily spend correlated with clicks
        </p>
        <PerformanceChart
          data={analyticsData}
          lines={[
            { key: "spend", color: "#f7931a", label: "Spend ($)" },
            { key: "clicks", color: "#4ade80", label: "Clicks" },
          ]}
          height={240}
        />
      </motion.div>
    </div>
  );
}
