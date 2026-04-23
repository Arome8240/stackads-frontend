import { ref } from 'vue';
import { TreasuryClient, CampaignInfo } from '@stackads/sdk-core';
import { useStackAds } from './useStackAds';

export function useCampaign() {
  const { config } = useStackAds();
  const client = new TreasuryClient(config);

  const loading = ref(false);
  const error = ref<Error | null>(null);

  // Campaign info
  const campaignInfo = ref<CampaignInfo | null>(null);
  const campaigns = ref<CampaignInfo[]>([]);

  const createCampaign = async (
    name: string,
    budget: bigint,
    costPerClick: bigint,
    duration: number
  ) => {
    loading.value = true;
    error.value = null;
    try {
      const txId = await client.createCampaign(name, budget, costPerClick, duration);
      return txId;
    } catch (e) {
      error.value = e as Error;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const getCampaign = async (campaignId: number) => {
    loading.value = true;
    error.value = null;
    try {
      campaignInfo.value = await client.getCampaign(campaignId);
      return campaignInfo.value;
    } catch (e) {
      error.value = e as Error;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const fundCampaign = async (campaignId: number, amount: bigint) => {
    loading.value = true;
    error.value = null;
    try {
      const txId = await client.fundCampaign(campaignId, amount);
      return txId;
    } catch (e) {
      error.value = e as Error;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const pauseCampaign = async (campaignId: number) => {
    loading.value = true;
    error.value = null;
    try {
      const txId = await client.pauseCampaign(campaignId);
      return txId;
    } catch (e) {
      error.value = e as Error;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const resumeCampaign = async (campaignId: number) => {
    loading.value = true;
    error.value = null;
    try {
      const txId = await client.resumeCampaign(campaignId);
      return txId;
    } catch (e) {
      error.value = e as Error;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const recordImpression = async (campaignId: number, publisherAddress: string) => {
    loading.value = true;
    error.value = null;
    try {
      const txId = await client.recordImpression(campaignId, publisherAddress);
      return txId;
    } catch (e) {
      error.value = e as Error;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const recordClick = async (campaignId: number, publisherAddress: string) => {
    loading.value = true;
    error.value = null;
    try {
      const txId = await client.recordClick(campaignId, publisherAddress);
      return txId;
    } catch (e) {
      error.value = e as Error;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  return {
    // State
    campaignInfo,
    campaigns,
    loading,
    error,

    // Methods
    createCampaign,
    getCampaign,
    fundCampaign,
    pauseCampaign,
    resumeCampaign,
    recordImpression,
    recordClick,
  };
}
