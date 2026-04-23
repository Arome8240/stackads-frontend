/**
 * React hooks for token operations
 */

import { useState, useEffect, useCallback } from 'react';
import { useStackAdsSDK } from '../context/StackAdsContext';
import type { TransactionResult } from '@stackads/sdk-core';

/**
 * Hook to get token balance
 */
export function useTokenBalance(address?: string) {
  const sdk = useStackAdsSDK();
  const [balance, setBalance] = useState<bigint | null>(null);
  const [formatted, setFormatted] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchBalance = useCallback(async () => {
    if (!address) return;

    setLoading(true);
    setError(null);

    try {
      const [bal, fmt] = await Promise.all([
        sdk.token.getBalance(address),
        sdk.token.getFormattedBalance(address),
      ]);
      setBalance(bal);
      setFormatted(fmt);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [sdk, address]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  return {
    balance,
    formatted,
    loading,
    error,
    refetch: fetchBalance,
  };
}

/**
 * Hook to get token metadata
 */
export function useTokenMetadata() {
  const sdk = useStackAdsSDK();
  const [metadata, setMetadata] = useState<{
    name: string;
    symbol: string;
    decimals: number;
    totalSupply: bigint;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchMetadata = async () => {
      setLoading(true);
      setError(null);

      try {
        const [name, symbol, decimals, totalSupply] = await Promise.all([
          sdk.token.getName(),
          sdk.token.getSymbol(),
          sdk.token.getDecimals(),
          sdk.token.getTotalSupply(),
        ]);

        setMetadata({ name, symbol, decimals, totalSupply });
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetadata();
  }, [sdk]);

  return { metadata, loading, error };
}

/**
 * Hook to transfer tokens
 */
export function useTokenTransfer() {
  const sdk = useStackAdsSDK();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<TransactionResult | null>(null);

  const transfer = useCallback(
    async (
      amount: bigint | string | number,
      recipient: string,
      senderKey: string,
      memo?: string
    ) => {
      setLoading(true);
      setError(null);
      setResult(null);

      try {
        const txResult = await sdk.token.transfer(
          amount,
          recipient,
          senderKey,
          memo
        );
        setResult(txResult);
        return txResult;
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [sdk]
  );

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setResult(null);
  }, []);

  return {
    transfer,
    loading,
    error,
    result,
    reset,
  };
}

/**
 * Hook to burn tokens
 */
export function useTokenBurn() {
  const sdk = useStackAdsSDK();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<TransactionResult | null>(null);

  const burn = useCallback(
    async (amount: bigint | string | number, senderKey: string) => {
      setLoading(true);
      setError(null);
      setResult(null);

      try {
        const txResult = await sdk.token.burn(amount, senderKey);
        setResult(txResult);
        return txResult;
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [sdk]
  );

  return {
    burn,
    loading,
    error,
    result,
  };
}
