/**
 * Campaign Card Component for Next.js
 */

'use client';

import { useCampaign, useCampaignMetrics } from '@stackads/react';

export interface CampaignCardProps {
  campaignId: number;
  className?: string;
  showMetrics?: boolean;
}

/**
 * Display campaign information in a card
 */
export function CampaignCard({
  campaignId,
  className,
  showMetrics = true,
}: CampaignCardProps) {
  const { campaign, loading: campaignLoading } = useCampaign(campaignId);
  const { metrics, loading: metricsLoading } = useCampaignMetrics(campaignId);

  if (campaignLoading) {
    return <div className={className}>Loading campaign...</div>;
  }

  if (!campaign) {
    return <div className={className}>Campaign not found</div>;
  }

  const statusText = {
    1: 'Active',
    2: 'Paused',
    3: 'Ended',
  }[campaign.status] || 'Unknown';

  return (
    <div className={className}>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Campaign #{campaignId}</h3>
          <span
            className={`px-2 py-1 rounded text-sm ${
              campaign.status === 1
                ? 'bg-green-100 text-green-800'
                : campaign.status === 2
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {statusText}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-gray-600">Budget:</span>
            <span className="ml-2 font-medium">{campaign.budget.toString()}</span>
          </div>
          <div>
            <span className="text-gray-600">Spent:</span>
            <span className="ml-2 font-medium">{campaign.spent.toString()}</span>
          </div>
          <div>
            <span className="text-gray-600">Impressions:</span>
            <span className="ml-2 font-medium">{campaign.totalImpressions.toString()}</span>
          </div>
          <div>
            <span className="text-gray-600">Clicks:</span>
            <span className="ml-2 font-medium">{campaign.totalClicks.toString()}</span>
          </div>
        </div>

        {showMetrics && !metricsLoading && metrics && (
          <div className="border-t pt-2 mt-2">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-600">CTR:</span>
                <span className="ml-2 font-medium">{metrics.ctr.toFixed(2)}%</span>
              </div>
              <div>
                <span className="text-gray-600">Budget Used:</span>
                <span className="ml-2 font-medium">{metrics.budgetUsed.toFixed(2)}%</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
