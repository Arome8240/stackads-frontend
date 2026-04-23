import { inject } from 'vue';
import { StackAdsConfig } from '@stackads/sdk-core';
import { StackAdsSymbol } from '../plugin';

export function useStackAds() {
  const config = inject<StackAdsConfig>(StackAdsSymbol);

  if (!config) {
    throw new Error(
      'StackAds config not found. Did you install the StackAdsPlugin?'
    );
  }

  return { config };
}
