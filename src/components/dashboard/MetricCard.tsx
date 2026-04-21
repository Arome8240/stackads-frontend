"use client";
import { motion } from "framer-motion";
import { TrendUp, TrendDown } from "iconsax-react";
import { memo } from "react";

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  positive: boolean;
  icon: React.ReactNode;
  iconBg: string;
  delay?: number;
}

function MetricCard({
  title,
  value,
  change,
  positive,
  icon,
  iconBg,
  delay = 0,
}: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="glass rounded-2xl p-5 border border-white/8 card-hover"
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}
        >
          {icon}
        </div>
        <span
          className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
            positive
              ? "bg-[#4ade80]/10 text-[#4ade80]"
              : "bg-red-500/10 text-red-400"
          }`}
        >
          {positive ? (
            <TrendUp size={12} color="#4ade80" />
          ) : (
            <TrendDown size={12} color="#f87171" />
          )}
          {change}
        </span>
      </div>
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      <p className="text-xs text-white/40">{title}</p>
    </motion.div>
  );
}

export default memo(MetricCard);
