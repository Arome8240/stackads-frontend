import { ref } from 'vue';
import { RegistryClient, PublisherInfo, AdvertiserInfo } from '@stackads/sdk-core';
import { useStackAds } from './useStackAds';

export function useRegistry() {
  const { config } = useStackAds();
  const client = new RegistryClient(config);

  const loading = ref(false);
  const error = ref<Error | null>(null);

  // Publisher operations
  const publisherInfo = ref<PublisherInfo | null>(null);

  const registerPublisher = async (name: string, website: string, stakeAmount: bigint) => {
    loading.value = true;
    error.value = null;
    try {
      const txId = await client.registerPublisher(name, website, stakeAmount);
      return txId;
    } catch (e) {
      error.value = e as Error;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const getPublisher = async (address: string) => {
    loading.value = true;
    error.value = null;
    try {
      publisherInfo.value = await client.getPublisher(address);
      return publisherInfo.value;
    } catch (e) {
      error.value = e as Error;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const updatePublisherStats = async (impressions: number, clicks: number) => {
    loading.value = true;
    error.value = null;
    try {
      const txId = await client.updatePublisherStats(impressions, clicks);
      return txId;
    } catch (e) {
      error.value = e as Error;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  // Advertiser operations
  const advertiserInfo = ref<AdvertiserInfo | null>(null);

  const registerAdvertiser = async (name: string, company: string, stakeAmount: bigint) => {
    loading.value = true;
    error.value = null;
    try {
      const txId = await client.registerAdvertiser(name, company, stakeAmount);
      return txId;
    } catch (e) {
      error.value = e as Error;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const getAdvertiser = async (address: string) => {
    loading.value = true;
    error.value = null;
    try {
      advertiserInfo.value = await client.getAdvertiser(address);
      return advertiserInfo.value;
    } catch (e) {
      error.value = e as Error;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  // Reputation operations
  const slashUser = async (userAddress: string, amount: bigint, reason: string) => {
    loading.value = true;
    error.value = null;
    try {
      const txId = await client.slashUser(userAddress, amount, reason);
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
    publisherInfo,
    advertiserInfo,
    loading,
    error,

    // Publisher methods
    registerPublisher,
    getPublisher,
    updatePublisherStats,

    // Advertiser methods
    registerAdvertiser,
    getAdvertiser,

    // Reputation methods
    slashUser,
  };
}
