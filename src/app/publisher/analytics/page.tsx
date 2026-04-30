"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, TrendUp } from "iconsax-react";
import MetricCard from "@/components/dashboard/MetricCard";
import PerformanceChart from "@/components/dashboard/PerformanceChart";
import { publisherAnalytics, publisherMetrics } from "@/lib/mock-data";
import { DollarCircle, Eye, MouseCircle, ChartCircle } from "iconsax-react";

const ranges = ["7D", "30D", "90D", "All"];

const metrics = [
  {
    title: "Total Impressions",
    value: "1.3M",
    change: "+11.7%",
    positive: true,
    icon: <Eye size={20} color="#a855f7" variant="Bold" />,
    iconBg: "bg-[#a855f7]/10",
  },
  {
    title: "Total Clicks",
    value: "48.7K",
    change: "+7.2%",
    positive: true,
    icon: <MouseCircle size={20} color="#22d3ee" variant="Bold" />,
    iconBg: "bg-[#22d3ee]/10",
  },
  {
    title: "Total Earned",
    value: `$${publisherMetrics.totalEarned.toLocaleString()}`,
    change: "+18.2%",
    positive: true,
    icon: <DollarCircle size={20} color="#4ade80" variant="Bold" />,
    iconBg: "bg-[#4ade80]/10",
  },
  {
    title: "Avg. eCPM",
    value: `$${publisherMetrics.ecpm.toFixed(2)}`,
    change: "-0.1%",
    positive: false,
    icon: <ChartCircle size={20} color="#f7931a" variant="Bold" />,
    iconBg: "bg-[#f7931a]/10",
  },
];

export default function PublisherAnalyticsPage() {
  const [range, setRange] = useState("30D");

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h2 className="text-xl font-bold text-white">Analytics</h2>
          <p className="text-sm text-white/40 mt-0.5">
            Performance across all your ad units
          </p>
        </div>
        <div className="flex items-center gap-1 glass rounded-xl p-1 border border-white/8">
          <Calendar size={16} color="#4ade80" className="ml-2" />
          {ranges.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${range === r ? "bg-[#4ade80]/20 text-[#4ade80]" : "text-white/40 hover:text-white"}`}
            >
              {r}
            </button>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <MetricCard key={m.title} {...m} delay={i * 0.08} />
        ))}
      </div>

      {[
        {
          key: "impressions" as const,
          color: "#a855f7",
          label: "Impressions Over Time",
          sub: "Daily impressions across all ad units",
        },
        {
          key: "clicks" as const,
          color: "#22d3ee",
          label: "Clicks Over Time",
          sub: "Daily clicks across all ad units",
        },
        {
          key: "earnings" as const,
          color: "#4ade80",
          label: "Earnings Over Time",
          sub: "Daily revenue in USD",
        },
        {
          key: "ecpm" as const,
          color: "#f7931a",
          label: "eCPM Over Time",
          sub: "Effective cost per 1,000 impressions",
        },
      ].map((chart, i) => (
        <motion.div
          key={chart.key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
          className="glass rounded-2xl p-6 border border-white/8"
        >
          <div className="flex items-center gap-2 mb-1">
            <TrendUp size={18} color={chart.color} variant="Bold" />
            <h3 className="text-base font-semibold text-white">
              {chart.label}
            </h3>
          </div>
          <p className="text-xs text-white/30 mb-6 ml-6">{chart.sub}</p>
          <PerformanceChart
            data={publisherAnalytics}
            lines={[{ key: chart.key, color: chart.color, label: chart.label }]}
            height={220}
          />
        </motion.div>
      ))}
    </div>
  );
}
