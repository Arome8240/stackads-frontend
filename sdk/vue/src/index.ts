// Plugin
export { StackAdsPlugin, StackAdsSymbol } from './plugin';
export type { StackAdsPluginOptions } from './plugin';

// Composables
export {
  useStackAds,
  useToken,
  useRegistry,
  useStaking,
  useCampaign,
} from './composables';

// Re-export core types
export type {
  StackAdsConfig,
  PublisherInfo,
  AdvertiserInfo,
  StakeInfo,
  CampaignInfo,
  TransactionResult,
} from '@stackads/sdk-core';
