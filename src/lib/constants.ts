// Design tokens
export const COLORS = {
  primary: "#f7931a",
  primaryDark: "#e8820a",
  secondary: "#a855f7",
  accent: "#22d3ee",
  success: "#4ade80",
  error: "#f87171",
  warning: "#fbbf24",
  background: "#07070f",
  backgroundLight: "#0d0d1a",
} as const;

export const SPACING = {
  xs: "0.25rem", // 4px
  sm: "0.5rem", // 8px
  md: "1rem", // 16px
  lg: "1.5rem", // 24px
  xl: "2rem", // 32px
  "2xl": "3rem", // 48px
} as const;

export const BORDER_RADIUS = {
  sm: "0.5rem", // 8px
  md: "0.75rem", // 12px
  lg: "1rem", // 16px
  xl: "1.5rem", // 24px
} as const;

// App constants
export const APP_NAME = "StackAds";
export const APP_DESCRIPTION =
  "Decentralized Ad Network for Web2 & Web3";

// Navigation
export const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Who It's For", href: "#for-who" },
  { label: "Docs", href: "#" },
] as const;

export const DASHBOARD_NAV_ITEMS = [
  { label: "Overview", href: "/dashboard", icon: "Home2" },
  { label: "Campaigns", href: "/dashboard/campaigns", icon: "Chart" },
  { label: "Create Campaign", href: "/dashboard/create", icon: "AddCircle" },
  { label: "Analytics", href: "/dashboard/analytics", icon: "PresentionChart" },
  { label: "Wallet", href: "/dashboard/wallet", icon: "EmptyWallet" },
] as const;

// Animation durations
export const ANIMATION_DURATION = {
  fast: 0.2,
  normal: 0.4,
  slow: 0.6,
} as const;

// Toast auto-dismiss duration (ms)
export const TOAST_DURATION = 3000;

// API endpoints (placeholder for future use)
export const API_ENDPOINTS = {
  campaigns: "/api/campaigns",
  analytics: "/api/analytics",
  wallet: "/api/wallet",
  transactions: "/api/transactions",
} as const;
