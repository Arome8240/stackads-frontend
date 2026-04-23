import { App, Plugin } from 'vue';
import { StackAdsConfig } from '@stackads/sdk-core';

export interface StackAdsPluginOptions {
  config: StackAdsConfig;
}

export const StackAdsSymbol = Symbol('stackads');

export const StackAdsPlugin: Plugin = {
  install(app: App, options: StackAdsPluginOptions) {
    if (!options?.config) {
      throw new Error('StackAds config is required');
    }

    app.provide(StackAdsSymbol, options.config);
  },
};
