/**
 * Server-side utilities for Next.js
 * Use in API routes and Server Components
 */

import { StackAdsSDK, type StackAdsConfig } from '@stackads/sdk-core';
import { cache } from 'react';

/**
 * Create a cached SDK instance for server-side use
 * This ensures the same instance is reused across Server Components
 */
export const getStackAdsSDK = cache((config: StackAdsConfig) => {
  return new StackAdsSDK(config);
});

/**
 * Server-side token operations
 */
export async function getTokenBalance(
  sdk: StackAdsSDK,
  address: string
): Promise<{ balance: bigint; formatted: string }> {
  const [balance, formatted] = await Promise.all([
    sdk.token.getBalance(address),
    sdk.token.getFormattedBalance(address),
  ]);

  return { balance, formatted };
}

/**
 * Server-side participant lookup
 */
export async function getParticipant(sdk: StackAdsSDK, address: string) {
  return sdk.registry.getParticipant(address);
}

/**
 * Server-side campaign lookup
 */
export async function getCampaign(sdk: StackAdsSDK, campaignId: number) {
  return sdk.treasury.getCampaign(campaignId);
}

/**
 * Server-side campaign metrics
 */
export async function getCampaignMetrics(
  sdk: StackAdsSDK,
  campaignId: number
) {
  return sdk.treasury.getCampaignMetrics(campaignId);
}

/**
 * Server-side staking info
 */
export async function getStakingInfo(sdk: StackAdsSDK, address: string) {
  return sdk.staking.getStakingInfo(address);
}

/**
 * Server-side APY calculation
 */
export async function getStakingAPY(sdk: StackAdsSDK) {
  return sdk.staking.calculateAPY();
}

/**
 * Batch fetch multiple balances (useful for leaderboards, etc.)
 */
export async function getBatchBalances(
  sdk: StackAdsSDK,
  addresses: string[]
): Promise<Map<string, bigint>> {
  const balances = await Promise.all(
    addresses.map((addr) => sdk.token.getBalance(addr))
  );

  return new Map(addresses.map((addr, i) => [addr, balances[i]]));
}

/**
 * Get platform statistics
 */
export async function getPlatformStats(sdk: StackAdsSDK) {
  const [publisherCount, advertiserCount, totalSupply] = await Promise.all([
    sdk.registry.getPublisherCount(),
    sdk.registry.getAdvertiserCount(),
    sdk.token.getTotalSupply(),
  ]);

  return {
    publisherCount,
    advertiserCount,
    totalSupply,
  };
}

/**
 * Validate transaction result
 */
export function isTransactionSuccess(txId: string): boolean {
  return txId.length > 0;
}

/**
 * Format error for API response
 */
export function formatError(error: unknown): {
  message: string;
  code?: string;
} {
  if (error instanceof Error) {
    return {
      message: error.message,
      code: 'code' in error ? (error as any).code : undefined,
    };
  }
  return { message: 'Unknown error occurred' };
}
