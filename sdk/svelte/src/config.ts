import { writable } from 'svelte/store';
import type { StackAdsConfig } from '@stackads/sdk-core';

export const stackAdsConfig = writable<StackAdsConfig | null>(null);

export function initStackAds(config: StackAdsConfig) {
  stackAdsConfig.set(config);
}
