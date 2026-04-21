"use client";
import { motion } from "framer-motion";
import { floating } from "@/lib/animations";

interface OnChainBadgeProps {
  txHash: string;
}

export default function OnChainBadge({ txHash }: OnChainBadgeProps) {
  return (
    <motion.div
      {...floating(-8, 3.5)}
      className="absolute -bottom-4 -left-4 glass rounded-xl px-4 py-3 border border-[#a855f7]/30 hidden sm:block"
    >
      <div className="text-xs text-white/50 mb-0.5">Verified On-Chain</div>
      <div className="text-sm font-semibold text-[#a855f7]">TX: {txHash}</div>
    </motion.div>
  );
}
