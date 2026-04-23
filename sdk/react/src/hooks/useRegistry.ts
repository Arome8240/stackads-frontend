/**
 * React hooks for registry operations
 */

import { useState, useEffect, useCallback } from 'react';
import { useStackAdsSDK } from '../context/StackAdsContext';
import type { Participant, TransactionResult } from '@stackads/sdk-core';

/**
 * Hook to get participant information
 */
export function useParticipant(address?: string) {
  const sdk = useStackAdsSDK();
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchParticipant = useCallback(async () => {
    if (!address) return;

    setLoading(true);
    setError(null);

    try {
      const data = await sdk.registry.getParticipant(address);
      setParticipant(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [sdk, address]);

  useEffect(() => {
    fetchParticipant();
  }, [fetchParticipant]);

  return {
    participant,
    loading,
    error,
    refetch: fetchParticipant,
  };
}

/**
 * Hook to check if address is active publisher
 */
export function useIsPublisher(address?: string) {
  const sdk = useStackAdsSDK();
  const [isPublisher, setIsPublisher] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!address) return;

    const checkPublisher = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await sdk.registry.isActivePublisher(address);
        setIsPublisher(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    checkPublisher();
  }, [sdk, address]);

  return { isPublisher, loading, error };
}

/**
 * Hook to check if address is active advertiser
 */
export function useIsAdvertiser(address?: string) {
  const sdk = useStackAdsSDK();
  const [isAdvertiser, setIsAdvertiser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!address) return;

    const checkAdvertiser = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await sdk.registry.isActiveAdvertiser(address);
        setIsAdvertiser(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    checkAdvertiser();
  }, [sdk, address]);

  return { isAdvertiser, loading, error };
}

/**
 * Hook to register as publisher
 */
export function useRegisterPublisher() {
  const sdk = useStackAdsSDK();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<TransactionResult | null>(null);

  const register = useCallback(
    async (metadataUri: string, senderKey: string) => {
      setLoading(true);
      setError(null);
      setResult(null);

      try {
        const txResult = await sdk.registry.registerPublisher(
          metadataUri,
          senderKey
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

  return {
    register,
    loading,
    error,
    result,
  };
}

/**
 * Hook to register as advertiser
 */
export function useRegisterAdvertiser() {
  const sdk = useStackAdsSDK();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<TransactionResult | null>(null);

  const register = useCallback(
    async (metadataUri: string, senderKey: string) => {
      setLoading(true);
      setError(null);
      setResult(null);

      try {
        const txResult = await sdk.registry.registerAdvertiser(
          metadataUri,
          senderKey
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

  return {
    register,
    loading,
    error,
    result,
  };
}

/**
 * Hook to get registry statistics
 */
export function useRegistryStats() {
  const sdk = useStackAdsSDK();
  const [stats, setStats] = useState<{
    publisherCount: number;
    advertiserCount: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [publisherCount, advertiserCount] = await Promise.all([
        sdk.registry.getPublisherCount(),
        sdk.registry.getAdvertiserCount(),
      ]);

      setStats({ publisherCount, advertiserCount });
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [sdk]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
}

/**
 * Hook to get publisher CTR
 */
export function usePublisherCTR(publisher?: string) {
  const sdk = useStackAdsSDK();
  const [ctr, setCtr] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!publisher) return;

    const fetchCTR = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await sdk.registry.getClickThroughRate(publisher);
        setCtr(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchCTR();
  }, [sdk, publisher]);

  return { ctr, loading, error };
}
