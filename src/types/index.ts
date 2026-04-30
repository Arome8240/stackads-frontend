// ─── Advertiser types ─────────────────────────────────────────────────────────

export type CampaignStatus = "Active" | "Paused" | "Completed";

export interface Campaign {
  id: string;
  name: string;
  status: CampaignStatus;
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  ctr: number;
  startDate: string;
  endDate: string;
  format: "Banner" | "Native" | "Video";
}

export interface Transaction {
  id: string;
  type: "Deposit" | "Spend" | "Refund";
  amount: number;
  date: string;
  description: string;
  txHash: string;
}

export interface AnalyticsPoint {
  date: string;
  impressions: number;
  clicks: number;
  spend: number;
}

export interface OverviewMetrics {
  totalSpend: number;
  impressions: number;
  clicks: number;
  ctr: number;
}

// ─── Publisher types ───────────────────────────────────────────────────────────

export type AdUnitStatus = "Active" | "Paused";
export type AdUnitFormat = "Banner" | "Native" | "Video";
export type AdUnitSize = "728x90" | "300x250" | "320x50" | "N/A";

export interface AdUnit {
  id: string;
  name: string;
  format: AdUnitFormat;
  size: AdUnitSize;
  placement: string;
  status: AdUnitStatus;
  impressions: number;
  clicks: number;
  ctr: number;
  earnings: number;
  createdAt: string;
}

export interface EarningsRecord {
  id: string;
  date: string;
  campaign: string;
  adUnit: string;
  impressions: number;
  amount: number;
}

export interface PublisherAnalyticsPoint {
  date: string;
  impressions: number;
  clicks: number;
  earnings: number;
  ecpm: number;
}

export interface PublisherMetrics {
  totalEarned: number;
  thisMonth: number;
  impressions: number;
  ecpm: number;
}
