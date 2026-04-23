import { ref, computed } from 'vue';
import { TokenClient } from '@stackads/sdk-core';
import { useStackAds } from './useStackAds';

export function useToken() {
  const { config } = useStackAds();
  const client = new TokenClient(config);

  const loading = ref(false);
  const error = ref<Error | null>(null);

  // Get token balance
  const balance = ref<bigint | null>(null);
  const getBalance = async (address: string) => {
    loading.value = true;
    error.value = null;
    try {
      balance.value = await client.getBalance(address);
      return balance.value;
    } catch (e) {
      error.value = e as Error;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  // Transfer tokens
  const transfer = async (to: string, amount: bigint, memo?: string) => {
    loading.value = true;
    error.value = null;
    try {
      const txId = await client.transfer(to, amount, memo);
      return txId;
    } catch (e) {
      error.value = e as Error;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  // Get token info
  const tokenInfo = ref<{
    name: string;
    symbol: string;
    decimals: number;
    totalSupply: bigint;
  } | null>(null);

  const getTokenInfo = async () => {
    loading.value = true;
    error.value = null;
    try {
      tokenInfo.value = await client.getTokenInfo();
      return tokenInfo.value;
    } catch (e) {
      error.value = e as Error;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  // Computed formatted balance
  const formattedBalance = computed(() => {
    if (balance.value === null) return '0';
    return client.formatAmount(balance.value);
  });

  return {
    // State
    balance,
    tokenInfo,
    loading,
    error,
    formattedBalance,

    // Methods
    getBalance,
    transfer,
    getTokenInfo,
  };
}
