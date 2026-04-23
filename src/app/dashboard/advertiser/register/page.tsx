"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useStacks } from "@/providers/StacksProvider";
import { useRegistry, useToken } from "@stackads/react";
import { useRouter } from "next/navigation";

export default function AdvertiserRegister() {
  const router = useRouter();
  const { address, isConnected } = useStacks();
  const { registerAdvertiser, loading } = useRegistry();
  const { parseAmount } = useToken();

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    stakeAmount: "10",
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

    if (!formData.name || !formData.company) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const stakeAmountBigInt = parseAmount(formData.stakeAmount);

      const txId = await registerAdvertiser(
        formData.name,
        formData.company,
        stakeAmountBigInt
      );

      setSuccess(true);

      // Redirect to advertiser dashboard after 2 seconds
      setTimeout(() => {
        router.push("/dashboard/advertiser");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to register. Please try again.");
    }
  };

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
          <p className="text-white/60">
            Please connect your Stacks wallet to register as an advertiser
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
          <h2 className="text-2xl font-bold mb-2">Registration Successful!</h2>
          <p className="text-white/60">
            Redirecting to your advertiser dashboard...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-8 border border-white/8"
      >
        <h1 className="text-2xl font-bold mb-2">Register as Advertiser</h1>
        <p className="text-white/60 mb-8">
          Start advertising on StackAds platform
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Your Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#f7931a] transition-colors"
              placeholder="John Doe"
              required
            />
          </div>

          {/* Company */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Company Name
            </label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) =>
                setFormData({ ...formData, company: e.target.value })
              }
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#f7931a] transition-colors"
              placeholder="Acme Corporation"
              required
            />
          </div>

          {/* Stake Amount */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Stake Amount (SADS)
            </label>
            <input
              type="number"
              step="0.000001"
              min="10"
              value={formData.stakeAmount}
              onChange={(e) =>
                setFormData({ ...formData, stakeAmount: e.target.value })
              }
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#f7931a] transition-colors"
              required
            />
            <p className="text-xs text-white/40 mt-2">
              Minimum stake: 10 SADS. This helps maintain platform quality and
              can be unstaked later.
            </p>
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
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-[#f7931a] text-white rounded-lg hover:bg-[#f7931a]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? "Registering..." : "Register as Advertiser"}
          </button>
        </form>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-[#f7931a]/10 border border-[#f7931a]/20 rounded-lg">
          <h3 className="text-sm font-semibold mb-2 text-[#f7931a]">
            What happens next?
          </h3>
          <ul className="text-xs text-white/60 space-y-1">
            <li>• Your stake will be locked in the smart contract</li>
            <li>• You'll get access to the advertiser dashboard</li>
            <li>• Create campaigns and upload ad creatives</li>
            <li>• Target specific audiences and publishers</li>
            <li>• Track campaign performance in real-time</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}
