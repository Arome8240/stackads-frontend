import { writable, derived, get } from 'svelte/store';
import { RegistryClient, PublisherInfo, AdvertiserInfo } from '@stackads/sdk-core';
import { stackAdsConfig } from '../config';

function createRegistryStore() {
  const loading = writable(false);
  const publisherInfo = writable<PublisherInfo | null>(null);
  const advertiserInfo = writable<AdvertiserInfo | null>(null);
  const error = writable<Error | null>(null);

  async function registerPublisher(name: string, website: string, stakeAmount: bigint) {
    const config = get(stackAdsConfig);
    if (!config) throw new Error('StackAds not initialized');

    loading.set(true);
    error.set(null);
    try {
      const client = new RegistryClient(config);
      const txId = await client.registerPublisher(name, website, stakeAmount);
      return txId;
    } catch (e) {
      error.set(e as Error);
      throw e;
    } finally {
      loading.set(false);
    }
  }

  async function getPublisher(address: string) {
    const config = get(stackAdsConfig);
    if (!config) throw new Error('StackAds not initialized');

    loading.set(true);
    error.set(null);
    try {
      const client = new RegistryClient(config);
      const info = await client.getPublisher(address);
      publisherInfo.set(info);
      return info;
    } catch (e) {
      error.set(e as Error);
      throw e;
    } finally {
      loading.set(false);
    }
  }

  async function updatePublisherStats(impressions: number, clicks: number) {
    const config = get(stackAdsConfig);
    if (!config) throw new Error('StackAds not initialized');

    loading.set(true);
    error.set(null);
    try {
      const client = new RegistryClient(config);
      const txId = await client.updatePublisherStats(impressions, clicks);
      return txId;
    } catch (e) {
      error.set(e as Error);
      throw e;
    } finally {
      loading.set(false);
    }
  }

  async function registerAdvertiser(name: string, company: string, stakeAmount: bigint) {
    const config = get(stackAdsConfig);
    if (!config) throw new Error('StackAds not initialized');

    loading.set(true);
    error.set(null);
    try {
      const client = new RegistryClient(config);
      const txId = await client.registerAdvertiser(name, company, stakeAmount);
      return txId;
    } catch (e) {
      error.set(e as Error);
      throw e;
    } finally {
      loading.set(false);
    }
  }

  async function getAdvertiser(address: string) {
    const config = get(stackAdsConfig);
    if (!config) throw new Error('StackAds not initialized');

    loading.set(true);
    error.set(null);
    try {
      const client = new RegistryClient(config);
      const info = await client.getAdvertiser(address);
      advertiserInfo.set(info);
      return info;
    } catch (e) {
      error.set(e as Error);
      throw e;
    } finally {
      loading.set(false);
    }
  }

  async function slashUser(userAddress: string, amount: bigint, reason: string) {
    const config = get(stackAdsConfig);
    if (!config) throw new Error('StackAds not initialized');

    loading.set(true);
    error.set(null);
    try {
      const client = new RegistryClient(config);
      const txId = await client.slashUser(userAddress, amount, reason);
      return txId;
    } catch (e) {
      error.set(e as Error);
      throw e;
    } finally {
      loading.set(false);
    }
  }

  return {
    subscribe: derived(
      [loading, publisherInfo, advertiserInfo, error],
      ([$loading, $publisherInfo, $advertiserInfo, $error]) => ({
        loading: $loading,
        publisherInfo: $publisherInfo,
        advertiserInfo: $advertiserInfo,
        error: $error,
      })
    ).subscribe,
    registerPublisher,
    getPublisher,
    updatePublisherStats,
    registerAdvertiser,
    getAdvertiser,
    slashUser,
  };
}

export const registryStore = createRegistryStore();
