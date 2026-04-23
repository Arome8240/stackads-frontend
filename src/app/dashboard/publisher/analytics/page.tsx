"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useStacks } from "@/providers/StacksProvider";
import { useRegistry } from "@stackads/react";
import PerformanceChart from "@/components/dashboard/PerformanceChart";
import MetricCard from "@/components/dashboard/MetricCard";
import { Eye, MouseCircle, DollarCircle, ChartCircle } from "iconsax-react";

export default function PublisherAnalytics() {
  const { address, isConnected } = useStacks();
  const { publisherInfo, getPublisher } = useRegistry();

  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");
  const [analyticsData, setAnalyticsData] = useState<any[]>([]);

  useEffect(() => {
    if (address && isConnected) {
      loadAnalytics();
    }
  }, [address, isConnected, timeRange]);

  const loadAnalytics = async () => {
    if (!address) return;

    try {
      await getPublisher(address);
      
      // Generate mock analytics data based on time range
      const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
      const data = Array.from({ length: days }, (_, i) => ({
        date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
        impressions: Math.floor(Math.random() * 5000) + 1000,
        clicks: Math.floor(Math.random() * 200) + 50,
        revenue: Math.floor(Math.random() * 100) + 20,
      }));
      
      setAnalyticsData(data);
    } catch (error) {
      console.error("Error loading analytics:", error);
    }
  };

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
          <p className="text-white/60">
            Please connect your wallet to view analytics
          </p>
        </div>
      </div>
    );
  }

  if (!publisherInfo) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No Publisher Account</h2>
          <p className="text-white/60">
            Register as a publisher to view analytics
          </p>
        </div>
      </div>
    );
  }

  const totalImpressions = analyticsData.reduce((sum, d) => sum + d.impressions, 0);
  const totalClicks = analyticsData.reduce((sum, d) => sum + d.clicks, 0);
  const totalRevenue = analyticsData.reduce((sum, d) => sum + d.revenue, 0);
  const avgCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

  const metrics = [
    {
      title: "Total Impressions",
      value: totalImpressions >= 1000 
        ? `${(totalImpressions / 1000).toFixed(1)}K` 
        : totalImpressions.toString(),
      change: "+12.5%",
      positive: true,
      icon: <Eye size={20} color="#a855f7" variant="Bold" />,
      iconBg: "bg-[#a855f7]/10",
    },
    {
      title: "Total Clicks",
      value: totalClicks.toString(),
      change: "+8.3%",
      positive: true,
      icon: <MouseCircle size={20} color="#22d3ee" variant="Bold" />,
      iconBg: "bg-[#22d3ee]/10",
    },
    {
      title: "Revenue",
      value: `${totalRevenue.toFixed(2)} SADS`,
      change: "+15.7%",
      positive: true,
      icon: <DollarCircle size={20} color="#f7931a" variant="Bold" />,
      iconBg: "bg-[#f7931a]/10",
    },
    {
      title: "Average CTR",
      value: `${avgCTR.toFixed(2)}%`,
      change: "-0.3%",
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
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-white/60 text-sm mt-1">
            Track your performance and earnings
          </p>
        </div>
        
        {/* Time Range Selector */}
        <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1">
          {(["7d", "30d", "90d"] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                timeRange === range
                  ? "bg-[#f7931a] text-white"
                  : "text-white/60 hover:text-white"
              }`}
            >
              {range === "7d" ? "7 Days" : range === "30d" ? "30 Days" : "90 Days"}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <MetricCard key={m.title} {...m} delay={i * 0.08} />
        ))}
      </div>

      {/* Performance Chart */}
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
            <p className="text-xs text-white/40 mt-0.5">
              Last {timeRange === "7d" ? "7" : timeRange === "30d" ? "30" : "90"} days
            </p>
          </div>
        </div>
        <PerformanceChart
          data={analyticsData}
          lines={[
            { key: "impressions" as const, color: "#a855f7", label: "Impressions" },
            { key: "clicks" as const, color: "#22d3ee", label: "Clicks" },
          ]}
        />
      </motion.div>

      {/* Revenue Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="glass rounded-2xl p-6 border border-white/8"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-semibold text-white">
              Revenue Trend
            </h2>
            <p className="text-xs text-white/40 mt-0.5">
              Daily earnings in SADS
            </p>
          </div>
        </div>
        <PerformanceChart
          data={analyticsData}
          lines={[
            { key: "revenue" as const, color: "#f7931a", label: "Revenue" },
          ]}
        />
      </motion.div>

      {/* Top Performing Placements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="glass rounded-2xl border border-white/8 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-white/8">
          <h2 className="text-base font-semibold text-white">
            Top Performing Placements
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {["Placement", "Impressions", "Clicks", "CTR", "Revenue"].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-3 text-left text-xs font-medium text-white/30 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { name: "Homepage Banner", impressions: 45000, clicks: 1800, revenue: 180 },
                { name: "Sidebar Ad", impressions: 32000, clicks: 960, revenue: 96 },
                { name: "Article Footer", impressions: 28000, clicks: 840, revenue: 84 },
                { name: "Mobile Banner", impressions: 21000, clicks: 630, revenue: 63 },
              ].map((placement, i) => {
                const ctr = (placement.clicks / placement.impressions) * 100;
                return (
                  <tr
                    key={i}
                    className={`border-b border-white/5 hover:bg-white/3 transition-colors ${
                      i % 2 === 0 ? "" : "bg-white/1"
                    }`}
                  >
                    <td className="px-6 py-4 font-medium text-white">
                      {placement.name}
                    </td>
                    <td className="px-6 py-4 text-white/60">
                      {(placement.impressions / 1000).toFixed(1)}K
                    </td>
                    <td className="px-6 py-4 text-white/60">
                      {placement.clicks.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-[#4ade80] font-medium">
                      {ctr.toFixed(2)}%
                    </td>
                    <td className="px-6 py-4 text-[#f7931a] font-medium">
                      {placement.revenue} SADS
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
