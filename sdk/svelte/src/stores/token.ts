import { writable, derived, get } from 'svelte/store';
import { TokenClient } from '@stackads/sdk-core';
import { stackAdsConfig } from '../config';

function createTokenStore() {
  const loading = writable(false);
  const balance = writable<bigint | null>(null);
  const tokenInfo = writable<{
    name: string;
    symbol: string;
    decimals: number;
    totalSupply: bigint;
  } | null>(null);
  const error = writable<Error | null>(null);

  const formattedBalance = derived([balance, stackAdsConfig], ([$balance, $config]) => {
    if (!$balance || !$config) return '0';
    const client = new TokenClient($config);
    return client.formatAmount($balance);
  });

  async function getBalance(address: string) {
    const config = get(stackAdsConfig);
    if (!config) throw new Error('StackAds not initialized');

    loading.set(true);
    error.set(null);
    try {
      const client = new TokenClient(config);
      const bal = await client.getBalance(address);
      balance.set(bal);
      return bal;
    } catch (e) {
      error.set(e as Error);
      throw e;
    } finally {
      loading.set(false);
    }
  }

  async function transfer(to: string, amount: bigint, memo?: string) {
    const config = get(stackAdsConfig);
    if (!config) throw new Error('StackAds not initialized');

    loading.set(true);
    error.set(null);
    try {
      const client = new TokenClient(config);
      const txId = await client.transfer(to, amount, memo);
      return txId;
    } catch (e) {
      error.set(e as Error);
      throw e;
    } finally {
      loading.set(false);
    }
  }

  async function getTokenInfo() {
    const config = get(stackAdsConfig);
    if (!config) throw new Error('StackAds not initialized');

    loading.set(true);
    error.set(null);
    try {
      const client = new TokenClient(config);
      const info = await client.getTokenInfo();
      tokenInfo.set(info);
      return info;
    } catch (e) {
      error.set(e as Error);
      throw e;
    } finally {
      loading.set(false);
    }
  }

  function formatAmount(amount: bigint): string {
    const config = get(stackAdsConfig);
    if (!config) return '0';
    const client = new TokenClient(config);
    return client.formatAmount(amount);
  }

  function parseAmount(amount: string): bigint {
    const config = get(stackAdsConfig);
    if (!config) throw new Error('StackAds not initialized');
    const client = new TokenClient(config);
    return client.parseAmount(amount);
  }

  return {
    subscribe: derived(
      [loading, balance, tokenInfo, error, formattedBalance],
      ([$loading, $balance, $tokenInfo, $error, $formattedBalance]) => ({
        loading: $loading,
        balance: $balance,
        tokenInfo: $tokenInfo,
        error: $error,
        formattedBalance: $formattedBalance,
      })
    ).subscribe,
    getBalance,
    transfer,
    getTokenInfo,
    formatAmount,
    parseAmount,
  };
}

export const tokenStore = createTokenStore();
