import { writable, derived, get } from 'svelte/store';
import { TreasuryClient, CampaignInfo } from '@stackads/sdk-core';
import { stackAdsConfig } from '../config';

function createCampaignStore() {
  const loading = writable(false);
  const campaignInfo = writable<CampaignInfo | null>(null);
  const campaigns = writable<CampaignInfo[]>([]);
  const error = writable<Error | null>(null);

  async function createCampaign(
    name: string,
    budget: bigint,
    costPerClick: bigint,
    duration: number
  ) {
    const config = get(stackAdsConfig);
    if (!config) throw new Error('StackAds not initialized');

    loading.set(true);
    error.set(null);
    try {
      const client = new TreasuryClient(config);
      const txId = await client.createCampaign(name, budget, costPerClick, duration);
      return txId;
    } catch (e) {
      error.set(e as Error);
      throw e;
    } finally {
      loading.set(false);
    }
  }

  async function getCampaign(campaignId: number) {
    const config = get(stackAdsConfig);
    if (!config) throw new Error('StackAds not initialized');

    loading.set(true);
    error.set(null);
    try {
      const client = new TreasuryClient(config);
      const info = await client.getCampaign(campaignId);
      campaignInfo.set(info);
      return info;
    } catch (e) {
      error.set(e as Error);
      throw e;
    } finally {
      loading.set(false);
    }
  }

  async function fundCampaign(campaignId: number, amount: bigint) {
    const config = get(stackAdsConfig);
    if (!config) throw new Error('StackAds not initialized');

    loading.set(true);
    error.set(null);
    try {
      const client = new TreasuryClient(config);
      const txId = await client.fundCampaign(campaignId, amount);
      return txId;
    } catch (e) {
      error.set(e as Error);
      throw e;
    } finally {
      loading.set(false);
    }
  }

  async function pauseCampaign(campaignId: number) {
    const config = get(stackAdsConfig);
    if (!config) throw new Error('StackAds not initialized');

    loading.set(true);
    error.set(null);
    try {
      const client = new TreasuryClient(config);
      const txId = await client.pauseCampaign(campaignId);
      return txId;
    } catch (e) {
      error.set(e as Error);
      throw e;
    } finally {
      loading.set(false);
    }
  }

  async function resumeCampaign(campaignId: number) {
    const config = get(stackAdsConfig);
    if (!config) throw new Error('StackAds not initialized');

    loading.set(true);
    error.set(null);
    try {
      const client = new TreasuryClient(config);
      const txId = await client.resumeCampaign(campaignId);
      return txId;
    } catch (e) {
      error.set(e as Error);
      throw e;
    } finally {
      loading.set(false);
    }
  }

  async function recordImpression(campaignId: number, publisherAddress: string) {
    const config = get(stackAdsConfig);
    if (!config) throw new Error('StackAds not initialized');

    loading.set(true);
    error.set(null);
    try {
      const client = new TreasuryClient(config);
      const txId = await client.recordImpression(campaignId, publisherAddress);
      return txId;
    } catch (e) {
      error.set(e as Error);
      throw e;
    } finally {
      loading.set(false);
    }
  }

  async function recordClick(campaignId: number, publisherAddress: string) {
    const config = get(stackAdsConfig);
    if (!config) throw new Error('StackAds not initialized');

    loading.set(true);
    error.set(null);
    try {
      const client = new TreasuryClient(config);
      const txId = await client.recordClick(campaignId, publisherAddress);
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
      [loading, campaignInfo, campaigns, error],
      ([$loading, $campaignInfo, $campaigns, $error]) => ({
        loading: $loading,
        campaignInfo: $campaignInfo,
        campaigns: $campaigns,
        error: $error,
      })
    ).subscribe,
    createCampaign,
    getCampaign,
    fundCampaign,
    pauseCampaign,
    resumeCampaign,
    recordImpression,
    recordClick,
  };
}

export const campaignStore = createCampaignStore();
