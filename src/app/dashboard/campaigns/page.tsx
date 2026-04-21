"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  AddCircle,
  Eye,
  Edit2,
  PauseCircle,
  SearchNormal1,
} from "iconsax-react";
import CampaignTable from "@/components/dashboard/CampaignTable";
import Toast from "@/components/dashboard/Toast";
import type { ToastType } from "@/components/dashboard/Toast";
import { campaigns } from "@/lib/mock-data";
import { useSearch } from "@/hooks/useSearch";
import { useToast } from "@/hooks/useToast";

export default function CampaignsPage() {
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  const filtered = campaigns.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleAction = (action: string, name: string) => {
    const messages: Record<string, { message: string; type: ToastType }> = {
      pause: { message: `"${name}" has been paused.`, type: "info" },
      edit: { message: `Opening editor for "${name}"...`, type: "info" },
      view: { message: `Loading campaign details...`, type: "info" },
    };
    setToast(messages[action]);
  };

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
          <h2 className="text-xl font-bold text-white">All Campaigns</h2>
          <p className="text-sm text-white/40 mt-0.5">
            {campaigns.length} campaigns total
          </p>
        </div>
        <Link
          href="/dashboard/create"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-[#f7931a] to-[#e8820a] text-black text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <AddCircle size={18} color="#000" variant="Bold" />
          New Campaign
        </Link>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="relative"
      >
        <SearchNormal1
          size={16}
          color="#ffffff40"
          className="absolute left-4 top-1/2 -translate-y-1/2"
        />
        <input
          type="text"
          placeholder="Search campaigns..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-80 pl-10 pr-4 py-2.5 rounded-xl glass border border-white/10 bg-transparent text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#f7931a]/50 transition-colors"
        />
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="glass rounded-2xl border border-white/8 overflow-hidden"
      >
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
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-16 text-center text-white/30 text-sm"
                  >
                    No campaigns found.
                  </td>
                </tr>
              ) : (
                filtered.map((c, i) => (
                  <tr
                    key={c.id}
                    className={`border-b border-white/5 hover:bg-white/3 transition-colors ${i % 2 !== 0 ? "bg-white/1" : ""}`}
                  >
                    <td className="px-5 py-4">
                      <div className="font-medium text-white">{c.name}</div>
                      <div className="text-xs text-white/30 mt-0.5">
                        {c.format}
                      </div>
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
                          onClick={() => handleAction("view", c.name)}
                          className="w-8 h-8 rounded-lg bg-white/5 hover:bg-[#a855f7]/20 flex items-center justify-center transition-colors"
                          title="View"
                        >
                          <Eye size={14} color="#a855f7" />
                        </button>
                        <button
                          onClick={() => handleAction("edit", c.name)}
                          className="w-8 h-8 rounded-lg bg-white/5 hover:bg-[#22d3ee]/20 flex items-center justify-center transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={14} color="#22d3ee" />
                        </button>
                        {c.status === "Active" && (
                          <button
                            onClick={() => handleAction("pause", c.name)}
                            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-[#f7931a]/20 flex items-center justify-center transition-colors"
                            title="Pause"
                          >
                            <PauseCircle size={14} color="#f7931a" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
