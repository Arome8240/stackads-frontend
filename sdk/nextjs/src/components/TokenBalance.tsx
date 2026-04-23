/**
 * Token Balance Component for Next.js
 */

'use client';

import { useTokenBalance } from '@stackads/react';

export interface TokenBalanceProps {
  address: string;
  showRaw?: boolean;
  className?: string;
  loadingComponent?: React.ReactNode;
  errorComponent?: (error: Error) => React.ReactNode;
}

/**
 * Display token balance with loading and error states
 */
export function TokenBalance({
  address,
  showRaw = false,
  className,
  loadingComponent,
  errorComponent,
}: TokenBalanceProps) {
  const { balance, formatted, loading, error } = useTokenBalance(address);

  if (loading) {
    return <>{loadingComponent || <span>Loading...</span>}</>;
  }

  if (error) {
    return <>{errorComponent ? errorComponent(error) : <span>Error loading balance</span>}</>;
  }

  return (
    <span className={className}>
      {formatted} SADS
      {showRaw && balance && <span className="text-xs ml-2">({balance.toString()})</span>}
    </span>
  );
}
