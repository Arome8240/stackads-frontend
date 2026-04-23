/**
 * StackAds React Context
 */

import React, { createContext, useContext, useMemo, type ReactNode } from 'react';
import { StackAdsSDK, type StackAdsConfig } from '@stackads/sdk-core';

interface StackAdsContextValue {
  sdk: StackAdsSDK;
  config: StackAdsConfig;
}

const StackAdsContext = createContext<StackAdsContextValue | null>(null);

export interface StackAdsProviderProps {
  children: ReactNode;
  config: StackAdsConfig;
}

/**
 * StackAds Provider Component
 */
export function StackAdsProvider({ children, config }: StackAdsProviderProps) {
  const sdk = useMemo(() => new StackAdsSDK(config), [config]);

  const value = useMemo(
    () => ({
      sdk,
      config,
    }),
    [sdk, config]
  );

  return (
    <StackAdsContext.Provider value={value}>
      {children}
    </StackAdsContext.Provider>
  );
}

/**
 * Hook to access StackAds SDK
 */
export function useStackAds(): StackAdsContextValue {
  const context = useContext(StackAdsContext);
  
  if (!context) {
    throw new Error('useStackAds must be used within a StackAdsProvider');
  }
  
  return context;
}

/**
 * Hook to access SDK instance directly
 */
export function useStackAdsSDK(): StackAdsSDK {
  const { sdk } = useStackAds();
  return sdk;
}
