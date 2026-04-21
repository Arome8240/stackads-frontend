"use client";
import { motion } from "framer-motion";
import { floating } from "@/lib/animations";

interface RevenueCardProps {
  revenue: string;
}

export default function RevenueCard({ revenue }: RevenueCardProps) {
  return (
    <motion.div
      {...floating(8, 3)}
      className="absolute -top-4 -right-4 glass rounded-xl px-4 py-3 border border-[#f7931a]/30 hidden sm:block"
    >
      <div className="text-xs text-white/50 mb-0.5">Today&apos;s Revenue</div>
      <div className="text-lg font-bold text-[#f7931a]">{revenue}</div>
    </motion.div>
  );
}
