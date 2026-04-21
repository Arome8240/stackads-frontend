"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { AddCircle, SearchNormal1 } from "iconsax-react";
import CampaignTable from "@/components/dashboard/CampaignTable";
import Toast from "@/components/dashboard/Toast";
import { campaigns } from "@/lib/mock-data";
import { useSearch } from "@/hooks/useSearch";
import { useToast } from "@/hooks/useToast";

export default function CampaignsPage() {
  const { searchQuery, setSearchQuery, filteredItems } = useSearch(campaigns, [
    "name",
  ]);
  const { toast, showInfo, hideToast } = useToast();

  const handleAction = (action: string, name: string) => {
    const messages: Record<string, string> = {
      pause: `"${name}" has been paused.`,
      edit: `Opening editor for "${name}"...`,
      view: `Loading campaign details...`,
    };
    showInfo(messages[action]);
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
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
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
        <CampaignTable campaigns={filteredItems} onAction={handleAction} />
      </motion.div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </div>
  );
}
