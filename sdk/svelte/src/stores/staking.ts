import { writable, derived, get } from 'svelte/store';
import { StakingClient, StakeInfo } from '@stackads/sdk-core';
import { stackAdsConfig } from '../config';

function createStakingStore() {
  const loading = writable(false);
  const stakeInfo = writable<StakeInfo | null>(null);
  const error = writable<Error | null>(null);

  const formattedStake = derived([stakeInfo, stackAdsConfig], ([$stakeInfo, $config]) => {
    if (!$stakeInfo || !$config) return '0';
    const client = new StakingClient($config);
    return client.formatAmount($stakeInfo.amount);
  });

  async function stake(amount: bigint) {
    const config = get(stackAdsConfig);
    if (!config) throw new Error('StackAds not initialized');

    loading.set(true);
    error.set(null);
    try {
      const client = new StakingClient(config);
      const txId = await client.stake(amount);
      return txId;
    } catch (e) {
      error.set(e as Error);
      throw e;
    } finally {
      loading.set(false);
    }
  }

  async function unstake(amount: bigint) {
    const config = get(stackAdsConfig);
    if (!config) throw new Error('StackAds not initialized');

    loading.set(true);
    error.set(null);
    try {
      const client = new StakingClient(config);
      const txId = await client.unstake(amount);
      return txId;
    } catch (e) {
      error.set(e as Error);
      throw e;
    } finally {
      loading.set(false);
    }
  }

  async function getStakeInfo(address: string) {
    const config = get(stackAdsConfig);
    if (!config) throw new Error('StackAds not initialized');

    loading.set(true);
    error.set(null);
    try {
      const client = new StakingClient(config);
      const info = await client.getStakeInfo(address);
      stakeInfo.set(info);
      return info;
    } catch (e) {
      error.set(e as Error);
      throw e;
    } finally {
      loading.set(false);
    }
  }

  async function claimRewards() {
    const config = get(stackAdsConfig);
    if (!config) throw new Error('StackAds not initialized');

    loading.set(true);
    error.set(null);
    try {
      const client = new StakingClient(config);
      const txId = await client.claimRewards();
      return txId;
    } catch (e) {
      error.set(e as Error);
      throw e;
    } finally {
      loading.set(false);
    }
  }

  async function getPendingRewards(address: string) {
    const config = get(stackAdsConfig);
    if (!config) throw new Error('StackAds not initialized');

    loading.set(true);
    error.set(null);
    try {
      const client = new StakingClient(config);
      const rewards = await client.getPendingRewards(address);
      return rewards;
    } catch (e) {
      error.set(e as Error);
      throw e;
    } finally {
      loading.set(false);
    }
  }

  return {
    subscribe: derived(
      [loading, stakeInfo, error, formattedStake],
      ([$loading, $stakeInfo, $error, $formattedStake]) => ({
        loading: $loading,
        stakeInfo: $stakeInfo,
        error: $error,
        formattedStake: $formattedStake,
      })
    ).subscribe,
    stake,
    unstake,
    getStakeInfo,
    claimRewards,
    getPendingRewards,
  };
}

export const stakingStore = createStakingStore();
