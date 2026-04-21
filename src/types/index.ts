// Campaign types
export type CampaignStatus = "Active" | "Paused" | "Completed";

export type CampaignFormat = "Banner" | "Native" | "Video";

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
  format: CampaignFormat;
}

// Transaction types
export type TransactionType = "Deposit" | "Spend" | "Refund";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  date: string;
  description: string;
  txHash: string;
}

// Analytics types
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

// Toast types
export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastMessage {
  message: string;
  type: ToastType;
}

// Wallet types
export interface WalletState {
  isMiniPay: boolean;
  address: string | undefined;
  isConnected: boolean;
  balance: {
    value: bigint;
    decimals: number;
    formatted: string;
    symbol: string;
  } | undefined;
}
