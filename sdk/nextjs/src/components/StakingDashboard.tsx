/**
 * Staking Dashboard Component for Next.js
 */

'use client';

import { useStakingInfo, useStakingAPY } from '@stackads/react';
import { formatTokenAmount } from '@stackads/sdk-core';

export interface StakingDashboardProps {
  address: string;
  className?: string;
}

/**
 * Display comprehensive staking information
 */
export function StakingDashboard({ address, className }: StakingDashboardProps) {
  const { stakingInfo, loading: infoLoading } = useStakingInfo(address);
  const { apy, loading: apyLoading } = useStakingAPY();

  if (infoLoading || apyLoading) {
    return <div className={className}>Loading staking info...</div>;
  }

  return (
    <div className={className}>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Your Staking</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded">
              <div className="text-sm text-gray-600">Staked Balance</div>
              <div className="text-2xl font-bold">
                {stakingInfo ? formatTokenAmount(stakingInfo.balance) : '0'} SADS
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded">
              <div className="text-sm text-gray-600">Earned Rewards</div>
              <div className="text-2xl font-bold">
                {stakingInfo ? formatTokenAmount(stakingInfo.earned) : '0'} SADS
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Pool Statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-purple-50 p-4 rounded">
              <div className="text-sm text-gray-600">Current APY</div>
              <div className="text-2xl font-bold">{apy?.toFixed(2) || '0'}%</div>
            </div>
            <div className="bg-orange-50 p-4 rounded">
              <div className="text-sm text-gray-600">Total Staked</div>
              <div className="text-2xl font-bold">
                {stakingInfo ? formatTokenAmount(stakingInfo.totalSupply) : '0'} SADS
              </div>
            </div>
          </div>
        </div>

        {stakingInfo && stakingInfo.rewardRate > BigInt(0) && (
          <div className="bg-gray-50 p-4 rounded">
            <div className="text-sm text-gray-600">Reward Rate</div>
            <div className="text-lg font-medium">
              {formatTokenAmount(stakingInfo.rewardRate)} SADS per block
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
