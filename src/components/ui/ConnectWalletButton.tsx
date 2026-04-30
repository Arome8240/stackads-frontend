"use client";
import { useEffect, useState } from "react";
import { Wallet, LogoutCurve } from "iconsax-react";
import { useMiniPay } from "@/hooks/useMiniPay";

function truncate(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export default function ConnectWalletButton() {
  const { isMiniPay, address, isConnected, connect, disconnect } = useMiniPay();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  // Inside MiniPay the wallet is auto-connected — hide the button entirely
  if (isMiniPay && isConnected) return null;

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl glass border border-white/10 text-xs font-mono text-white/60">
          <span className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse" />
          {truncate(address)}
        </div>
        <button
          onClick={() => disconnect()}
          className="w-8 h-8 rounded-xl glass border border-white/10 flex items-center justify-center text-white/50 hover:text-red-400 transition-colors"
          title="Disconnect wallet"
        >
          <LogoutCurve size={15} color="currentColor" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connect}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-linear-to-r from-[#f7931a] to-[#e8820a] text-black text-xs font-semibold hover:opacity-90 transition-opacity"
    >
      <Wallet size={15} color="#000" variant="Bold" />
      Connect Wallet
    </button>
  );
}
