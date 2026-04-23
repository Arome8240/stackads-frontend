/**
 * StackAds Next.js SDK
 * 
 * Client-side components and hooks for Next.js App Router
 */

'use client';

// Re-export all React hooks
export * from '@stackads/react';

// Next.js specific components
export { StackAdsProvider } from './components/StackAdsProvider';
export { TokenBalance, type TokenBalanceProps } from './components/TokenBalance';
export { CampaignCard, type CampaignCardProps } from './components/CampaignCard';
export { StakingDashboard, type StakingDashboardProps } from './components/StakingDashboard';

// Re-export core types
export type * from '@stackads/sdk-core';
