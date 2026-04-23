"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useStacks } from "@/providers/StacksProvider";
import { useCampaign } from "@stackads/react";
import StatusBadge from "@/components/dashboard/StatusBadge";
import Link from "next/link";
import { AddCircle, Edit2, Pause, Play, Trash } from "iconsax-react";

export default function AdvertiserCampaigns() {
  const { address, isConnected } = useStacks();
  const { campaigns, loading, pauseCampaign, resumeCampaign } = useCampaign();

  const [filter, setFilter] = useState<"all" | "active" | "paused" | "completed">("all");

  useEffect(() => {
    if (address && isConnected) {
      // Load campaigns - this would be done automatically by the hook
    }
  }, [address, isConnected]);

  const handlePause = async (campaignId: number) => {
    try {
      await pauseCampaign(campaignId);
      // Refresh campaigns list
    } catch (error) {
      console.error("Error pausing campaign:", error);
    }
  };

  const handleResume = async (campaignId: number) => {
    try {
      await resumeCampaign(campaignId);
      // Refresh campaigns list
    } catch (error) {
      console.error("Error resuming campaign:", error);
    }
  };

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
          <p className="text-white/60">
            Please connect your wallet to view campaigns
          </p>
        </div>
      </div>
    );
  }

  const filteredCampaigns = campaigns.filter((c) => {
    if (filter === "all") return true;
    if (filter === "active") return c.active;
    if (filter === "paused") return !c.active;
    // For completed, check if budget is exhausted or duration ended
    return false;
  });

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Campaigns</h1>
          <p className="text-white/60 text-sm mt-1">
            Manage your advertising campaigns
          </p>
        </div>
        <Link
          href="/dashboard/advertiser/campaigns/create"
          className="px-4 py-2 bg-[#f7931a] text-white rounded-lg hover:bg-[#f7931a]/90 transition-colors text-sm font-medium flex items-center gap-2"
        >
          <AddCircle size={18} />
          Create Campaign
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        {(["all", "active", "paused", "completed"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f
                ? "bg-[#f7931a] text-white"
                : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Campaigns List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f7931a]"></div>
        </div>
      ) : filteredCampaigns.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-12 border border-white/8 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
            <AddCircle size={32} color="#f7931a" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No campaigns yet</h3>
          <p className="text-white/60 mb-6">
            Create your first campaign to start advertising
          </p>
          <Link
            href="/dashboard/advertiser/campaigns/create"
            className="inline-block px-6 py-3 bg-[#f7931a] text-white rounded-lg hover:bg-[#f7931a]/90 transition-colors"
          >
            Create Campaign
          </Link>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl border border-white/8 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  {[
                    "Campaign",
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
                      className="px-6 py-3 text-left text-xs font-medium text-white/30 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredCampaigns.map((campaign, i) => {
                  const ctr =
                    campaign.impressions > 0
                      ? (campaign.clicks / campaign.impressions) * 100
                      : 0;
                  const spentPercentage =
                    (Number(campaign.spent) / Number(campaign.budget)) * 100;

                  return (
                    <tr
                      key={i}
                      className={`border-b border-white/5 hover:bg-white/3 transition-colors ${
                        i % 2 === 0 ? "" : "bg-white/1"
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-white">{campaign.name}</p>
                          <p className="text-xs text-white/40 mt-1">
                            ID: {i + 1}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge
                          status={campaign.active ? "active" : "paused"}
                        />
                      </td>
                      <td className="px-6 py-4 text-white/60">
                        {(Number(campaign.budget) / 1_000_000).toFixed(2)} SADS
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-white/60">
                            {(Number(campaign.spent) / 1_000_000).toFixed(2)} SADS
                          </p>
                          <div className="w-full bg-white/5 rounded-full h-1.5 mt-1">
                            <div
                              className="bg-[#f7931a] h-1.5 rounded-full"
                              style={{ width: `${Math.min(spentPercentage, 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-white/60">
                        {campaign.impressions >= 1000
                          ? `${(campaign.impressions / 1000).toFixed(1)}K`
                          : campaign.impressions}
                      </td>
                      <td className="px-6 py-4 text-white/60">
                        {campaign.clicks}
                      </td>
                      <td className="px-6 py-4 text-[#4ade80] font-medium">
                        {ctr.toFixed(2)}%
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              campaign.active
                                ? handlePause(i + 1)
                                : handleResume(i + 1)
                            }
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                            title={campaign.active ? "Pause" : "Resume"}
                          >
                            {campaign.active ? (
                              <Pause size={16} color="#f7931a" />
                            ) : (
                              <Play size={16} color="#4ade80" />
                            )}
                          </button>
                          <button
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={16} color="#22d3ee" />
                          </button>
                          <button
                            className="p-2 rounded-lg bg-white/5 hover:bg-red-500/10 transition-colors"
                            title="Delete"
                          >
                            <Trash size={16} color="#ef4444" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Campaign Stats Summary */}
      {filteredCampaigns.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-6 border border-white/8"
        >
          <h3 className="text-sm font-semibold mb-4">Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-white/40 mb-1">Total Campaigns</p>
              <p className="text-2xl font-bold">{filteredCampaigns.length}</p>
            </div>
            <div>
              <p className="text-xs text-white/40 mb-1">Total Budget</p>
              <p className="text-2xl font-bold text-[#f7931a]">
                {(
                  filteredCampaigns.reduce(
                    (sum, c) => sum + Number(c.budget),
                    0
                  ) / 1_000_000
                ).toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-xs text-white/40 mb-1">Total Spent</p>
              <p className="text-2xl font-bold text-[#a855f7]">
                {(
                  filteredCampaigns.reduce(
                    (sum, c) => sum + Number(c.spent),
                    0
                  ) / 1_000_000
                ).toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-xs text-white/40 mb-1">Avg CTR</p>
              <p className="text-2xl font-bold text-[#4ade80]">
                {(
                  filteredCampaigns.reduce((sum, c) => {
                    const ctr =
                      c.impressions > 0 ? (c.clicks / c.impressions) * 100 : 0;
                    return sum + ctr;
                  }, 0) / filteredCampaigns.length
                ).toFixed(2)}
                %
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
