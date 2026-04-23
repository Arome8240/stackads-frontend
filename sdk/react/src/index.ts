/**
 * StackAds React SDK
 * 
 * React hooks and components for StackAds
 */

// Context and Provider
export {
  StackAdsProvider,
  useStackAds,
  useStackAdsSDK,
  type StackAdsProviderProps,
} from './context/StackAdsContext';

// Token hooks
export {
  useTokenBalance,
  useTokenMetadata,
  useTokenTransfer,
  useTokenBurn,
} from './hooks/useToken';

// Registry hooks
export {
  useParticipant,
  useIsPublisher,
  useIsAdvertiser,
  useRegisterPublisher,
  useRegisterAdvertiser,
  useRegistryStats,
  usePublisherCTR,
} from './hooks/useRegistry';

// Staking hooks
export {
  useStakingInfo,
  useStakingAPY,
  useStake,
  useUnstake,
  useClaimRewards,
  useExitStaking,
} from './hooks/useStaking';

// Campaign hooks
export {
  useCampaign,
  useCampaignMetrics,
  useCreateCampaign,
  useCampaignControl,
  usePublisherEarnings,
  useClaimEarnings,
} from './hooks/useCampaign';

// Re-export core types
export type * from '@stackads/sdk-core';
