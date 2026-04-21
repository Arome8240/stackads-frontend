import { DollarCircle, Eye, MouseCircle, ChartCircle } from "iconsax-react";
import { overviewMetrics } from "./mock-data";

export const dashboardMetrics = [
  {
    title: "Total Spend",
    value: `${overviewMetrics.totalSpend.toLocaleString()}`,
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

export const performanceChartLines = [
  { key: "impressions", color: "#a855f7", label: "Impressions" },
  { key: "clicks", color: "#f7931a", label: "Clicks" },
] as const;
