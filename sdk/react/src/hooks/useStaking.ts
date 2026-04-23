/**
 * React hooks for staking operations
 */

import { useState, useEffect, useCallback } from 'react';
import { useStackAdsSDK } from '../context/StackAdsContext';
import type { StakingInfo, TransactionResult } from '@stackads/sdk-core';

/**
 * Hook to get staking information
 */
export function useStakingInfo(address?: string) {
  const sdk = useStackAdsSDK();
  const [stakingInfo, setStakingInfo] = useState<StakingInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchStakingInfo = useCallback(async () => {
    if (!address) return;

    setLoading(true);
    setError(null);

    try {
      const info = await sdk.staking.getStakingInfo(address);
      setStakingInfo(info);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [sdk, address]);

  useEffect(() => {
    fetchStakingInfo();
  }, [fetchStakingInfo]);

  return {
    stakingInfo,
    loading,
    error,
    refetch: fetchStakingInfo,
  };
}

/**
 * Hook to get staking APY
 */
export function useStakingAPY() {
  const sdk = useStackAdsSDK();
  const [apy, setApy] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchAPY = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await sdk.staking.calculateAPY();
      setApy(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [sdk]);

  useEffect(() => {
    fetchAPY();
  }, [fetchAPY]);

  return {
    apy,
    loading,
    error,
    refetch: fetchAPY,
  };
}

/**
 * Hook to stake tokens
 */
export function useStake() {
  const sdk = useStackAdsSDK();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<TransactionResult | null>(null);

  const stake = useCallback(
    async (amount: bigint | string | number, senderKey: string) => {
      setLoading(true);
      setError(null);
      setResult(null);

      try {
        const txResult = await sdk.staking.stake(amount, senderKey);
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
    stake,
    loading,
    error,
    result,
  };
}

/**
 * Hook to unstake tokens
 */
export function useUnstake() {
  const sdk = useStackAdsSDK();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<TransactionResult | null>(null);

  const unstake = useCallback(
    async (amount: bigint | string | number, senderKey: string) => {
      setLoading(true);
      setError(null);
      setResult(null);

      try {
        const txResult = await sdk.staking.withdraw(amount, senderKey);
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
    unstake,
    loading,
    error,
    result,
  };
}

/**
 * Hook to claim staking rewards
 */
export function useClaimRewards() {
  const sdk = useStackAdsSDK();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<TransactionResult | null>(null);

  const claim = useCallback(
    async (senderKey: string) => {
      setLoading(true);
      setError(null);
      setResult(null);

      try {
        const txResult = await sdk.staking.claimReward(senderKey);
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
    claim,
    loading,
    error,
    result,
  };
}

/**
 * Hook to exit staking (unstake all + claim)
 */
export function useExitStaking() {
  const sdk = useStackAdsSDK();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<TransactionResult | null>(null);

  const exit = useCallback(
    async (senderKey: string) => {
      setLoading(true);
      setError(null);
      setResult(null);

      try {
        const txResult = await sdk.staking.exit(senderKey);
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
    exit,
    loading,
    error,
    result,
  };
}
