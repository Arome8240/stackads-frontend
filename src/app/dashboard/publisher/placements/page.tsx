"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { useStacks } from "@/providers/StacksProvider";
import { AddCircle, Edit2, Trash, Code, Eye } from "iconsax-react";
import Link from "next/link";

interface Placement {
  id: string;
  name: string;
  format: string;
  size: string;
  location: string;
  status: "active" | "paused";
  impressions: number;
  clicks: number;
  revenue: number;
}

export default function PublisherPlacements() {
  const { isConnected } = useStacks();
  
  const [placements, setPlacements] = useState<Placement[]>([
    {
      id: "1",
      name: "Homepage Banner",
      format: "Display",
      size: "728x90",
      location: "Header",
      status: "active",
      impressions: 45000,
      clicks: 1800,
      revenue: 180,
    },
    {
      id: "2",
      name: "Sidebar Ad",
      format: "Display",
      size: "300x250",
      location: "Sidebar",
      status: "active",
      impressions: 32000,
      clicks: 960,
      revenue: 96,
    },
    {
      id: "3",
      name: "Article Footer",
      format: "Native",
      size: "Responsive",
      location: "Content",
      status: "paused",
      impressions: 28000,
      clicks: 840,
      revenue: 84,
    },
  ]);

  const [showCodeModal, setShowCodeModal] = useState(false);
  const [selectedPlacement, setSelectedPlacement] = useState<Placement | null>(null);

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
          <p className="text-white/60">
            Please connect your wallet to manage placements
          </p>
        </div>
      </div>
    );
  }

  const handleShowCode = (placement: Placement) => {
    setSelectedPlacement(placement);
    setShowCodeModal(true);
  };

  const integrationCode = selectedPlacement
    ? `<!-- StackAds Placement: ${selectedPlacement.name} -->
<div id="stackads-${selectedPlacement.id}" data-placement="${selectedPlacement.id}"></div>
<script src="https://cdn.stackads.io/sdk.js"></script>
<script>
  StackAds.init({
    placementId: '${selectedPlacement.id}',
    publisherId: 'YOUR_PUBLISHER_ID'
  });
</script>`
    : "";

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Ad Placements</h1>
          <p className="text-white/60 text-sm mt-1">
            Manage your ad slots and integration
          </p>
        </div>
        <Link
          href="/dashboard/publisher/placements/create"
          className="px-4 py-2 bg-[#f7931a] text-white rounded-lg hover:bg-[#f7931a]/90 transition-colors text-sm font-medium flex items-center gap-2"
        >
          <AddCircle size={18} />
          Create Placement
        </Link>
      </div>

      {/* Placements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {placements.map((placement, i) => {
          const ctr = (placement.clicks / placement.impressions) * 100;
          
          return (
            <motion.div
              key={placement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-6 border border-white/8"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-white">{placement.name}</h3>
                  <p className="text-xs text-white/40 mt-1">
                    {placement.format} • {placement.size}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    placement.status === "active"
                      ? "bg-[#4ade80]/10 text-[#4ade80]"
                      : "bg-white/10 text-white/60"
                  }`}
                >
                  {placement.status}
                </span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-white/40 mb-1">Impressions</p>
                  <p className="text-lg font-semibold">
                    {(placement.impressions / 1000).toFixed(1)}K
                  </p>
                </div>
                <div>
                  <p className="text-xs text-white/40 mb-1">Clicks</p>
                  <p className="text-lg font-semibold">{placement.clicks}</p>
                </div>
                <div>
                  <p className="text-xs text-white/40 mb-1">CTR</p>
                  <p className="text-lg font-semibold text-[#4ade80]">
                    {ctr.toFixed(2)}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-white/40 mb-1">Revenue</p>
                  <p className="text-lg font-semibold text-[#f7931a]">
                    {placement.revenue} SADS
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="mb-4 p-3 bg-white/5 rounded-lg">
                <p className="text-xs text-white/40 mb-1">Location</p>
                <p className="text-sm font-medium">{placement.location}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleShowCode(placement)}
                  className="flex-1 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
                >
                  <Code size={16} />
                  Get Code
                </button>
                <button className="px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                  <Edit2 size={16} />
                </button>
                <button className="px-3 py-2 bg-white/5 hover:bg-red-500/10 rounded-lg transition-colors">
                  <Trash size={16} color="#ef4444" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Integration Guide */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass rounded-2xl p-6 border border-white/8"
      >
        <h2 className="text-base font-semibold mb-4">Integration Guide</h2>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-[#f7931a]/10 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-[#f7931a]">1</span>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1">Create a Placement</h3>
              <p className="text-sm text-white/60">
                Define where and how ads will appear on your site
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-[#f7931a]/10 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-[#f7931a]">2</span>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1">Get Integration Code</h3>
              <p className="text-sm text-white/60">
                Copy the code snippet for your placement
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-[#f7931a]/10 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-[#f7931a]">3</span>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1">Add to Your Site</h3>
              <p className="text-sm text-white/60">
                Paste the code where you want ads to appear
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-[#f7931a]/10 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-[#f7931a]">4</span>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1">Start Earning</h3>
              <p className="text-sm text-white/60">
                Ads will be served automatically and you'll earn revenue
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Code Modal */}
      {showCodeModal && selectedPlacement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-2xl p-6 border border-white/8 max-w-2xl w-full"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Integration Code</h3>
              <button
                onClick={() => setShowCodeModal(false)}
                className="text-white/60 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-white/60 mb-2">
                Placement: <span className="text-white font-medium">{selectedPlacement.name}</span>
              </p>
              <p className="text-sm text-white/60">
                Copy and paste this code into your website where you want the ad to appear.
              </p>
            </div>

            <div className="relative">
              <pre className="bg-black/40 p-4 rounded-lg overflow-x-auto text-sm">
                <code className="text-[#4ade80]">{integrationCode}</code>
              </pre>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(integrationCode);
                }}
                className="absolute top-2 right-2 px-3 py-1.5 bg-[#f7931a] text-white rounded-lg hover:bg-[#f7931a]/90 transition-colors text-xs"
              >
                Copy Code
              </button>
            </div>

            <div className="mt-4 p-4 bg-[#f7931a]/10 border border-[#f7931a]/20 rounded-lg">
              <p className="text-xs text-white/60">
                <strong className="text-[#f7931a]">Note:</strong> Replace YOUR_PUBLISHER_ID with your actual publisher ID from your account settings.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
