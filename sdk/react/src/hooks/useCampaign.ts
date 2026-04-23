/**
 * React hooks for campaign operations
 */

import { useState, useEffect, useCallback } from 'react';
import { useStackAdsSDK } from '../context/StackAdsContext';
import type { Campaign, TransactionResult } from '@stackads/sdk-core';

/**
 * Hook to get campaign details
 */
export function useCampaign(campaignId?: number) {
  const sdk = useStackAdsSDK();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchCampaign = useCallback(async () => {
    if (campaignId === undefined) return;

    setLoading(true);
    setError(null);

    try {
      const data = await sdk.treasury.getCampaign(campaignId);
      setCampaign(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [sdk, campaignId]);

  useEffect(() => {
    fetchCampaign();
  }, [fetchCampaign]);

  return {
    campaign,
    loading,
    error,
    refetch: fetchCampaign,
  };
}

/**
 * Hook to get campaign metrics
 */
export function useCampaignMetrics(campaignId?: number) {
  const sdk = useStackAdsSDK();
  const [metrics, setMetrics] = useState<{
    ctr: number;
    averageCpc: number;
    budgetUsed: number;
    remainingBudget: bigint;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchMetrics = useCallback(async () => {
    if (campaignId === undefined) return;

    setLoading(true);
    setError(null);

    try {
      const data = await sdk.treasury.getCampaignMetrics(campaignId);
      setMetrics(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [sdk, campaignId]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return {
    metrics,
    loading,
    error,
    refetch: fetchMetrics,
  };
}

/**
 * Hook to create campaign
 */
export function useCreateCampaign() {
  const sdk = useStackAdsSDK();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<TransactionResult | null>(null);

  const createCampaign = useCallback(
    async (
      budget: bigint | string | number,
      costPerImpression: bigint | string | number,
      costPerClick: bigint | string | number,
      duration: number,
      metadataUri: string,
      senderKey: string
    ) => {
      setLoading(true);
      setError(null);
      setResult(null);

      try {
        const txResult = await sdk.treasury.createCampaign(
          budget,
          costPerImpression,
          costPerClick,
          duration,
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
    createCampaign,
    loading,
    error,
    result,
  };
}

/**
 * Hook to pause/resume campaign
 */
export function useCampaignControl() {
  const sdk = useStackAdsSDK();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const pause = useCallback(
    async (campaignId: number, senderKey: string) => {
      setLoading(true);
      setError(null);

      try {
        const result = await sdk.treasury.pauseCampaign(campaignId, senderKey);
        return result;
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [sdk]
  );

  const resume = useCallback(
    async (campaignId: number, senderKey: string) => {
      setLoading(true);
      setError(null);

      try {
        const result = await sdk.treasury.resumeCampaign(campaignId, senderKey);
        return result;
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [sdk]
  );

  const end = useCallback(
    async (campaignId: number, senderKey: string) => {
      setLoading(true);
      setError(null);

      try {
        const result = await sdk.treasury.endCampaign(campaignId, senderKey);
        return result;
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
    pause,
    resume,
    end,
    loading,
    error,
  };
}

/**
 * Hook to get publisher earnings
 */
export function usePublisherEarnings(campaignId?: number, publisher?: string) {
  const sdk = useStackAdsSDK();
  const [earnings, setEarnings] = useState<{
    impressions: bigint;
    clicks: bigint;
    earned: bigint;
    claimed: bigint;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchEarnings = useCallback(async () => {
    if (campaignId === undefined || !publisher) return;

    setLoading(true);
    setError(null);

    try {
      const data = await sdk.treasury.getPublisherEarnings(
        campaignId,
        publisher
      );
      setEarnings(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [sdk, campaignId, publisher]);

  useEffect(() => {
    fetchEarnings();
  }, [fetchEarnings]);

  return {
    earnings,
    loading,
    error,
    refetch: fetchEarnings,
  };
}

/**
 * Hook to claim earnings
 */
export function useClaimEarnings() {
  const sdk = useStackAdsSDK();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<TransactionResult | null>(null);

  const claim = useCallback(
    async (campaignId: number, senderKey: string) => {
      setLoading(true);
      setError(null);
      setResult(null);

      try {
        const txResult = await sdk.treasury.claimEarnings(
          campaignId,
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
    claim,
    loading,
    error,
    result,
  };
}
