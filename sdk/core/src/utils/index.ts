/**
 * Utility functions for StackAds SDK
 */

import { StacksMainnet, StacksTestnet, StacksMocknet } from '@stacks/network';
import type { StacksNetwork } from '@stacks/network';
import { StackAdsSDK } from '../client';
import type { StackAdsConfig } from '../types';

/**
 * Network type
 */
export type NetworkType = 'mainnet' | 'testnet' | 'mocknet';

/**
 * Create StackAds SDK instance with simplified config
 */
export function createStackAdsSDK(
  contractAddress: string,
  network: NetworkType | StacksNetwork = 'testnet'
): StackAdsSDK {
  let stacksNetwork: StacksNetwork;

  if (typeof network === 'string') {
    switch (network) {
      case 'mainnet':
        stacksNetwork = new StacksMainnet();
        break;
      case 'testnet':
        stacksNetwork = new StacksTestnet();
        break;
      case 'mocknet':
        stacksNetwork = new StacksMocknet();
        break;
      default:
        throw new Error(`Invalid network type: ${network}`);
    }
  } else {
    stacksNetwork = network;
  }

  const config: StackAdsConfig = {
    network: stacksNetwork,
    contractAddress,
  };

  return new StackAdsSDK(config);
}

/**
 * Format token amount from micro-tokens to tokens
 */
export function formatTokenAmount(microAmount: bigint | string): string {
  const amount = typeof microAmount === 'string' ? BigInt(microAmount) : microAmount;
  return (Number(amount) / 1_000_000).toFixed(6);
}

/**
 * Parse token amount from tokens to micro-tokens
 */
export function parseTokenAmount(amount: string | number): bigint {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return BigInt(Math.floor(numAmount * 1_000_000));
}

/**
 * Format percentage from basis points
 */
export function formatBasisPoints(bps: number): string {
  return (bps / 100).toFixed(2) + '%';
}

/**
 * Calculate basis points from percentage
 */
export function toBasisPoints(percentage: number): number {
  return Math.floor(percentage * 100);
}

/**
 * Validate Stacks address
 */
export function isValidStacksAddress(address: string): boolean {
  // Basic validation - starts with SP or ST and has correct length
  return /^(SP|ST)[0-9A-Z]{38,41}$/.test(address);
}

/**
 * Shorten address for display
 */
export function shortenAddress(address: string, chars = 4): string {
  if (!address) return '';
  return `${address.substring(0, chars + 2)}...${address.substring(
    address.length - chars
  )}`;
}

/**
 * Format block height to estimated time
 */
export function blockHeightToTime(
  currentBlock: number,
  targetBlock: number,
  blockTime = 600 // 10 minutes in seconds
): string {
  const blockDiff = targetBlock - currentBlock;
  if (blockDiff <= 0) return 'Now';

  const seconds = blockDiff * blockTime;
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  return `${seconds} second${seconds > 1 ? 's' : ''}`;
}

/**
 * Calculate CTR (Click-Through Rate)
 */
export function calculateCTR(impressions: bigint, clicks: bigint): number {
  if (impressions === BigInt(0)) return 0;
  return (Number(clicks) / Number(impressions)) * 100;
}

/**
 * Calculate conversion rate
 */
export function calculateConversionRate(clicks: bigint, conversions: bigint): number {
  if (clicks === BigInt(0)) return 0;
  return (Number(conversions) / Number(clicks)) * 100;
}

/**
 * Calculate ROI (Return on Investment)
 */
export function calculateROI(spent: bigint, revenue: bigint): number {
  if (spent === BigInt(0)) return 0;
  return ((Number(revenue) - Number(spent)) / Number(spent)) * 100;
}

/**
 * Format large numbers with K, M, B suffixes
 */
export function formatLargeNumber(num: number | bigint): string {
  const n = typeof num === 'bigint' ? Number(num) : num;
  
  if (n >= 1_000_000_000) {
    return (n / 1_000_000_000).toFixed(2) + 'B';
  }
  if (n >= 1_000_000) {
    return (n / 1_000_000).toFixed(2) + 'M';
  }
  if (n >= 1_000) {
    return (n / 1_000).toFixed(2) + 'K';
  }
  return n.toFixed(2);
}

/**
 * Delay execution
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry function with exponential backoff
 */
export async function retry<T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  delayMs = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxAttempts) {
        await delay(delayMs * Math.pow(2, attempt - 1));
      }
    }
  }

  throw lastError!;
}
