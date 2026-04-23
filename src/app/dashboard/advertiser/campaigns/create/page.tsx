"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useStacks } from "@/providers/StacksProvider";
import { useCampaign, useToken } from "@stackads/react";
import { useRouter } from "next/navigation";

export default function CreateCampaign() {
  const router = useRouter();
  const { address, isConnected } = useStacks();
  const { createCampaign, loading } = useCampaign();
  const { parseAmount } = useToken();

  const [formData, setFormData] = useState({
    name: "",
    budget: "",
    costPerClick: "",
    duration: "30",
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isConnected || !address) {
      setError("Please connect your wallet first");
      return;
    }

    if (!formData.name || !formData.budget || !formData.costPerClick) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      const budgetBigInt = parseAmount(formData.budget);
      const cpcBigInt = parseAmount(formData.costPerClick);
      const durationDays = parseInt(formData.duration);

      const txId = await createCampaign(
        formData.name,
        budgetBigInt,
        cpcBigInt,
        durationDays
      );

      setSuccess(true);

      // Redirect to campaigns page after 2 seconds
      setTimeout(() => {
        router.push("/dashboard/advertiser/campaigns");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to create campaign. Please try again.");
    }
  };

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
          <p className="text-white/60">
            Please connect your Stacks wallet to create a campaign
          </p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-[#4ade80]/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-[#4ade80]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Campaign Created!</h2>
          <p className="text-white/60">
            Redirecting to your campaigns...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-8 border border-white/8"
      >
        <h1 className="text-2xl font-bold mb-2">Create New Campaign</h1>
        <p className="text-white/60 mb-8">
          Launch your advertising campaign on StackAds
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campaign Name */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Campaign Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#f7931a] transition-colors"
              placeholder="Summer Sale 2024"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Budget */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Total Budget (SADS) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                step="0.000001"
                min="1"
                value={formData.budget}
                onChange={(e) =>
                  setFormData({ ...formData, budget: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#f7931a] transition-colors"
                placeholder="50.0"
                required
              />
              <p className="text-xs text-white/40 mt-2">
                Minimum budget: 1 SADS
              </p>
            </div>

            {/* Cost Per Click */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Cost Per Click (SADS) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                step="0.000001"
                min="0.01"
                value={formData.costPerClick}
                onChange={(e) =>
                  setFormData({ ...formData, costPerClick: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#f7931a] transition-colors"
                placeholder="0.1"
                required
              />
              <p className="text-xs text-white/40 mt-2">
                Amount paid per click
              </p>
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Campaign Duration (Days)
            </label>
            <select
              value={formData.duration}
              onChange={(e) =>
                setFormData({ ...formData, duration: e.target.value })
              }
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#f7931a] transition-colors"
            >
              <option value="7">7 Days</option>
              <option value="14">14 Days</option>
              <option value="30">30 Days</option>
              <option value="60">60 Days</option>
              <option value="90">90 Days</option>
            </select>
          </div>

          {/* Campaign Summary */}
          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
            <h3 className="text-sm font-semibold mb-3">Campaign Summary</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-white/40">Estimated Clicks</p>
                <p className="font-medium">
                  {formData.budget && formData.costPerClick
                    ? Math.floor(
                        parseFloat(formData.budget) /
                          parseFloat(formData.costPerClick)
                      ).toLocaleString()
                    : "0"}
                </p>
              </div>
              <div>
                <p className="text-white/40">Duration</p>
                <p className="font-medium">{formData.duration} days</p>
              </div>
              <div>
                <p className="text-white/40">Daily Budget</p>
                <p className="font-medium">
                  {formData.budget && formData.duration
                    ? (
                        parseFloat(formData.budget) /
                        parseInt(formData.duration)
                      ).toFixed(6)
                    : "0"}{" "}
                  SADS
                </p>
              </div>
              <div>
                <p className="text-white/40">Total Cost</p>
                <p className="font-medium text-[#f7931a]">
                  {formData.budget || "0"} SADS
                </p>
              </div>
            </div>
          </div>

          {/* Connected Address */}
          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
            <p className="text-xs text-white/40 mb-1">Connected Address</p>
            <p className="text-sm font-mono">{address}</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-6 py-3 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-[#f7931a] text-white rounded-lg hover:bg-[#f7931a]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? "Creating..." : "Create Campaign"}
            </button>
          </div>
        </form>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-[#f7931a]/10 border border-[#f7931a]/20 rounded-lg">
          <h3 className="text-sm font-semibold mb-2 text-[#f7931a]">
            What happens next?
          </h3>
          <ul className="text-xs text-white/60 space-y-1">
            <li>• Your budget will be locked in the smart contract</li>
            <li>• Campaign will be reviewed and activated</li>
            <li>• Ads will be shown to targeted publishers</li>
            <li>• You'll be charged only for actual clicks</li>
            <li>• Track performance in real-time</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}
