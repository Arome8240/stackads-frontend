"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useStacks } from "@/providers/StacksProvider";
import { useToken, useStaking } from "@stackads/react";
import MetricCard from "@/components/dashboard/MetricCard";
import { 
  Wallet3, 
  Send2, 
  ReceiveSquare, 
  ArrowSwapHorizontal,
  DocumentCopy 
} from "iconsax-react";

export default function WalletPage() {
  const { address, isConnected } = useStacks();
  const { 
    balance, 
    getBalance, 
    formattedBalance, 
    transfer, 
    loading: tokenLoading 
  } = useToken();
  const { 
    stakeInfo, 
    getStakeInfo, 
    formattedStake,
    stake,
    unstake,
    claimRewards,
    loading: stakingLoading 
  } = useStaking();

  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showStakeModal, setShowStakeModal] = useState(false);
  const [transferData, setTransferData] = useState({
    to: "",
    amount: "",
    memo: "",
  });
  const [stakeAmount, setStakeAmount] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (address && isConnected) {
      loadWalletData();
    }
  }, [address, isConnected]);

  const loadWalletData = async () => {
    if (!address) return;
    try {
      await Promise.all([
        getBalance(address),
        getStakeInfo(address),
      ]);
    } catch (error) {
      console.error("Error loading wallet data:", error);
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const amountBigInt = BigInt(Math.floor(parseFloat(transferData.amount) * 1_000_000));
      await transfer(transferData.to, amountBigInt, transferData.memo);
      setShowTransferModal(false);
      setTransferData({ to: "", amount: "", memo: "" });
      await loadWalletData();
    } catch (error) {
      console.error("Transfer failed:", error);
    }
  };

  const handleStake = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const amountBigInt = BigInt(Math.floor(parseFloat(stakeAmount) * 1_000_000));
      await stake(amountBigInt);
      setShowStakeModal(false);
      setStakeAmount("");
      await loadWalletData();
    } catch (error) {
      console.error("Staking failed:", error);
    }
  };

  const handleUnstake = async () => {
    if (!stakeInfo) return;
    try {
      await unstake(stakeInfo.amount);
      await loadWalletData();
    } catch (error) {
      console.error("Unstaking failed:", error);
    }
  };

  const handleClaimRewards = async () => {
    try {
      await claimRewards();
      await loadWalletData();
    } catch (error) {
      console.error("Claim failed:", error);
    }
  };

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
          <p className="text-white/60">
            Please connect your Stacks wallet to view your wallet
          </p>
        </div>
      </div>
    );
  }

  const metrics = [
    {
      title: "Available Balance",
      value: `${formattedBalance} SADS`,
      change: "",
      positive: true,
      icon: <Wallet3 size={20} color="#f7931a" variant="Bold" />,
      iconBg: "bg-[#f7931a]/10",
    },
    {
      title: "Staked Amount",
      value: `${formattedStake} SADS`,
      change: "",
      positive: true,
      icon: <ArrowSwapHorizontal size={20} color="#a855f7" variant="Bold" />,
      iconBg: "bg-[#a855f7]/10",
    },
    {
      title: "Pending Rewards",
      value: stakeInfo ? `${(Number(stakeInfo.rewards) / 1_000_000).toFixed(6)} SADS` : "0 SADS",
      change: "",
      positive: true,
      icon: <ReceiveSquare size={20} color="#4ade80" variant="Bold" />,
      iconBg: "bg-[#4ade80]/10",
    },
    {
      title: "Total Value",
      value: balance && stakeInfo 
        ? `${((Number(balance) + Number(stakeInfo.amount)) / 1_000_000).toFixed(6)} SADS`
        : `${formattedBalance} SADS`,
      change: "",
      positive: true,
      icon: <Send2 size={20} color="#22d3ee" variant="Bold" />,
      iconBg: "bg-[#22d3ee]/10",
    },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Wallet</h1>
        <p className="text-white/60 text-sm mt-1">
          Manage your SADS tokens and staking
        </p>
      </div>

      {/* Wallet Address */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6 border border-white/8"
      >
        <p className="text-sm text-white/40 mb-2">Your Wallet Address</p>
        <div className="flex items-center gap-3">
          <p className="text-lg font-mono text-white flex-1">{address}</p>
          <button
            onClick={copyAddress}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            title="Copy address"
          >
            <DocumentCopy size={20} color={copied ? "#4ade80" : "#f7931a"} />
          </button>
        </div>
        {copied && (
          <p className="text-xs text-[#4ade80] mt-2">Address copied!</p>
        )}
      </motion.div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <MetricCard key={m.title} {...m} delay={i * 0.08} />
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-2xl p-6 border border-white/8"
      >
        <h2 className="text-base font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => setShowTransferModal(true)}
            className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 text-left"
          >
            <Send2 size={24} color="#f7931a" className="mb-2" />
            <p className="text-sm font-medium">Send SADS</p>
            <p className="text-xs text-white/40 mt-1">Transfer tokens</p>
          </button>
          
          <button
            onClick={() => setShowStakeModal(true)}
            className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 text-left"
          >
            <ArrowSwapHorizontal size={24} color="#a855f7" className="mb-2" />
            <p className="text-sm font-medium">Stake</p>
            <p className="text-xs text-white/40 mt-1">Earn rewards</p>
          </button>
          
          <button
            onClick={handleUnstake}
            disabled={!stakeInfo || stakeInfo.amount === 0n || stakingLoading}
            className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 text-left disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ReceiveSquare size={24} color="#22d3ee" className="mb-2" />
            <p className="text-sm font-medium">Unstake</p>
            <p className="text-xs text-white/40 mt-1">Withdraw stake</p>
          </button>
          
          <button
            onClick={handleClaimRewards}
            disabled={!stakeInfo || stakeInfo.rewards === 0n || stakingLoading}
            className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 text-left disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Wallet3 size={24} color="#4ade80" className="mb-2" />
            <p className="text-sm font-medium">Claim Rewards</p>
            <p className="text-xs text-white/40 mt-1">Get staking rewards</p>
          </button>
        </div>
      </motion.div>

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass rounded-2xl border border-white/8 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-white/8">
          <h2 className="text-base font-semibold">Recent Transactions</h2>
        </div>
        <div className="p-6 text-center text-white/60">
          <p className="text-sm">No recent transactions</p>
        </div>
      </motion.div>

      {/* Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-2xl p-6 border border-white/8 max-w-md w-full"
          >
            <h3 className="text-xl font-bold mb-4">Send SADS</h3>
            <form onSubmit={handleTransfer} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Recipient Address
                </label>
                <input
                  type="text"
                  value={transferData.to}
                  onChange={(e) =>
                    setTransferData({ ...transferData, to: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#f7931a]"
                  placeholder="ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Amount (SADS)
                </label>
                <input
                  type="number"
                  step="0.000001"
                  min="0"
                  value={transferData.amount}
                  onChange={(e) =>
                    setTransferData({ ...transferData, amount: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#f7931a]"
                  placeholder="0.0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Memo (Optional)
                </label>
                <input
                  type="text"
                  value={transferData.memo}
                  onChange={(e) =>
                    setTransferData({ ...transferData, memo: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#f7931a]"
                  placeholder="Payment for services"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowTransferModal(false)}
                  className="flex-1 px-4 py-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={tokenLoading}
                  className="flex-1 px-4 py-3 bg-[#f7931a] text-white rounded-lg hover:bg-[#f7931a]/90 transition-colors disabled:opacity-50"
                >
                  {tokenLoading ? "Sending..." : "Send"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Stake Modal */}
      {showStakeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-2xl p-6 border border-white/8 max-w-md w-full"
          >
            <h3 className="text-xl font-bold mb-4">Stake SADS</h3>
            <form onSubmit={handleStake} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Amount to Stake (SADS)
                </label>
                <input
                  type="number"
                  step="0.000001"
                  min="0"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#f7931a]"
                  placeholder="0.0"
                  required
                />
                <p className="text-xs text-white/40 mt-2">
                  Available: {formattedBalance} SADS
                </p>
              </div>
              <div className="p-4 bg-[#a855f7]/10 border border-[#a855f7]/20 rounded-lg">
                <p className="text-xs text-white/60">
                  Staking locks your tokens and earns you rewards. You can unstake at any time.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowStakeModal(false)}
                  className="flex-1 px-4 py-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={stakingLoading}
                  className="flex-1 px-4 py-3 bg-[#a855f7] text-white rounded-lg hover:bg-[#a855f7]/90 transition-colors disabled:opacity-50"
                >
                  {stakingLoading ? "Staking..." : "Stake"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
