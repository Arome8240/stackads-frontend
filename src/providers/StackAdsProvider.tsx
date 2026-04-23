"use client";
import { ReactNode } from "react";
import { StackAdsProvider as SDKProvider } from "@stackads/react";
import { StacksProvider } from "./StacksProvider";

const STACKADS_CONFIG = {
  network: "testnet" as const,
  contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
  contractName: "stackads-token",
};

export function StackAdsAppProvider({ children }: { children: ReactNode }) {
  return (
    <StacksProvider>
      <SDKProvider config={STACKADS_CONFIG}>
        {children}
      </SDKProvider>
    </StacksProvider>
  );
}
