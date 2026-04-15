"use client";
import { useEffect, useState } from "react";
import { useConnect, useAccount, useDisconnect, useBalance } from "wagmi";
import { injected } from "wagmi/connectors";
import { celo } from "wagmi/chains";

/**
 * Detects MiniPay and auto-connects.
 * Returns wallet state and helpers.
 */
export function useMiniPay() {
  const [isMiniPay, setIsMiniPay] = useState(false);
  const { connect } = useConnect();
  const { address, isConnected, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({
    address,
    chainId: celo.id,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ethereum = (window as any).ethereum;
    if (ethereum?.isMiniPay) {
      setIsMiniPay(true);
      // Auto-connect — MiniPay injects the wallet automatically
      connect({ connector: injected({ target: "metaMask" }) });
    }
  }, [connect]);

  return {
    isMiniPay,
    address,
    isConnected,
    chain,
    balance,
    disconnect,
    /** Manually trigger connect (for non-MiniPay fallback) */
    connect: () => connect({ connector: injected({ target: "metaMask" }) }),
  };
}
