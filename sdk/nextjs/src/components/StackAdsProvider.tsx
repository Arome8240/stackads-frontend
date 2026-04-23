/**
 * Next.js StackAds Provider
 * Client Component wrapper
 */

'use client';

import { StackAdsProvider as ReactProvider, type StackAdsProviderProps } from '@stackads/react';

/**
 * Client-side provider for Next.js App Router
 * Must be used in a Client Component
 */
export function StackAdsProvider({ children, config }: StackAdsProviderProps) {
  return <ReactProvider config={config}>{children}</ReactProvider>;
}
