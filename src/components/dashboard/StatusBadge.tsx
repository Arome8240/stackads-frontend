import { memo } from "react";
import type { CampaignStatus } from "@/types";

const styles: Record<CampaignStatus, string> = {
  Active: "bg-[#4ade80]/10 text-[#4ade80] border-[#4ade80]/20",
  Paused: "bg-[#f7931a]/10 text-[#f7931a] border-[#f7931a]/20",
  Completed: "bg-white/5 text-white/40 border-white/10",
};

const dots: Record<CampaignStatus, string> = {
  Active: "bg-[#4ade80]",
  Paused: "bg-[#f7931a]",
  Completed: "bg-white/30",
};

export default function StatusBadge({ status }: { status: CampaignStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dots[status]}`} />
      {status}
    </span>
  );
}
