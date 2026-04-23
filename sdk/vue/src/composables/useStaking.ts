import { ref, computed } from 'vue';
import { StakingClient, StakeInfo } from '@stackads/sdk-core';
import { useStackAds } from './useStackAds';

export function useStaking() {
  const { config } = useStackAds();
  const client = new StakingClient(config);

  const loading = ref(false);
  const error = ref<Error | null>(null);

  // Stake info
  const stakeInfo = ref<StakeInfo | null>(null);

  const stake = async (amount: bigint) => {
    loading.value = true;
    error.value = null;
    try {
      const txId = await client.stake(amount);
      return txId;
    } catch (e) {
      error.value = e as Error;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const unstake = async (amount: bigint) => {
    loading.value = true;
    error.value = null;
    try {
      const txId = await client.unstake(amount);
      return txId;
    } catch (e) {
      error.value = e as Error;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const getStakeInfo = async (address: string) => {
    loading.value = true;
    error.value = null;
    try {
      stakeInfo.value = await client.getStakeInfo(address);
      return stakeInfo.value;
    } catch (e) {
      error.value = e as Error;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const claimRewards = async () => {
    loading.value = true;
    error.value = null;
    try {
      const txId = await client.claimRewards();
      return txId;
    } catch (e) {
      error.value = e as Error;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const getPendingRewards = async (address: string) => {
    loading.value = true;
    error.value = null;
    try {
      const rewards = await client.getPendingRewards(address);
      return rewards;
    } catch (e) {
      error.value = e as Error;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  // Computed values
  const stakedAmount = computed(() => stakeInfo.value?.amount || 0n);
  const formattedStake = computed(() => {
    if (!stakeInfo.value) return '0';
    return client.formatAmount(stakeInfo.value.amount);
  });

  return {
    // State
    stakeInfo,
    loading,
    error,
    stakedAmount,
    formattedStake,

    // Methods
    stake,
    unstake,
    getStakeInfo,
    claimRewards,
    getPendingRewards,
  };
}
