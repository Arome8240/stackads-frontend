"use client";
import { Eye, Edit2, PauseCircle } from "iconsax-react";
import StatusBadge from "./StatusBadge";
import type { Campaign } from "@/types";

interface CampaignTableProps {
  campaigns: Campaign[];
  onAction: (action: string, name: string) => void;
}

export default function CampaignTable({
  campaigns,
  onAction,
}: CampaignTableProps) {
  if (campaigns.length === 0) {
    return (
      <div className="px-5 py-16 text-center text-white/30 text-sm">
        No campaigns found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/8">
            {[
              "Campaign Name",
              "Status",
              "Budget",
              "Spent",
              "Impressions",
              "Clicks",
              "CTR",
              "Actions",
            ].map((h) => (
              <th
                key={h}
                className="px-5 py-3.5 text-left text-xs font-medium text-white/30 uppercase tracking-wider whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {campaigns.map((c, i) => (
            <tr
              key={c.id}
              className={`border-b border-white/5 hover:bg-white/3 transition-colors ${i % 2 !== 0 ? "bg-white/1" : ""}`}
            >
              <td className="px-5 py-4">
                <div className="font-medium text-white">{c.name}</div>
                <div className="text-xs text-white/30 mt-0.5">{c.format}</div>
              </td>
              <td className="px-5 py-4">
                <StatusBadge status={c.status} />
              </td>
              <td className="px-5 py-4 text-white/60">
                ${c.budget.toLocaleString()}
              </td>
              <td className="px-5 py-4">
                <div className="text-white/60">
                  ${c.spent.toLocaleString()}
                </div>
                <div className="mt-1 h-1 w-20 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#f7931a]"
                    style={{
                      width: `${Math.round((c.spent / c.budget) * 100)}%`,
                    }}
                  />
                </div>
              </td>
              <td className="px-5 py-4 text-white/60">
                {(c.impressions / 1000).toFixed(0)}K
              </td>
              <td className="px-5 py-4 text-white/60">
                {(c.clicks / 1000).toFixed(1)}K
              </td>
              <td className="px-5 py-4 text-[#4ade80] font-medium">
                {c.ctr}%
              </td>
              <td className="px-5 py-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onAction("view", c.name)}
                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-[#a855f7]/20 flex items-center justify-center transition-colors"
                    title="View"
                  >
                    <Eye size={14} color="#a855f7" />
                  </button>
                  <button
                    onClick={() => onAction("edit", c.name)}
                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-[#22d3ee]/20 flex items-center justify-center transition-colors"
                    title="Edit"
                  >
                    <Edit2 size={14} color="#22d3ee" />
                  </button>
                  {c.status === "Active" && (
                    <button
                      onClick={() => onAction("pause", c.name)}
                      className="w-8 h-8 rounded-lg bg-white/5 hover:bg-[#f7931a]/20 flex items-center justify-center transition-colors"
                      title="Pause"
                    >
                      <PauseCircle size={14} color="#f7931a" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
