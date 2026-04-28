# Publisher Dashboard

## Overview

A dedicated dashboard for publishers (developers and app owners) who have integrated the StackAds SDK into their Web2 or Web3 apps. Publishers use this dashboard to monitor ad revenue, manage their ad units, view performance analytics, and withdraw earnings.

This is separate from the existing Advertiser Dashboard (`/dashboard`). The publisher dashboard lives at `/publisher`.

---

## Requirements

### 1. Layout & Navigation

- Reuse the existing `Sidebar`, `DashboardNav`, and `Toast` components
- Add a new sidebar config for publisher routes:
  - Overview → `/publisher`
  - Ad Units → `/publisher/ad-units`
  - Analytics → `/publisher/analytics`
  - Earnings → `/publisher/earnings`
  - Settings → `/publisher/settings`
- Add a `publisher/layout.tsx` that wraps all publisher pages

---

### 2. Overview Page (`/publisher`)

Metric cards:

- Total Earned (lifetime)
- This Month's Earnings
- Total Impressions Served
- Average eCPM (effective cost per mille)

Charts:

- Daily earnings over the last 30 days (line chart)
- Impressions by ad unit (bar or line chart)

Recent activity table:

- Date, Ad Unit, Impressions, Clicks, CTR, Earnings

---

### 3. Ad Units Page (`/publisher/ad-units`)

Table of registered ad units with:

- Ad Unit Name
- Format (Banner / Native / Video)
- Status (Active / Paused)
- Placement (e.g. "Homepage Hero", "Sidebar")
- Impressions (total)
- Earnings (total)
- Actions: View, Edit, Pause/Resume

"Add Ad Unit" button opens a form (inline or separate page) with:

- Ad Unit Name
- Format selector
- Placement label
- Size (for banner: 728x90, 300x250, 320x50)

---

### 4. Analytics Page (`/publisher/analytics`)

- Date range filter (7D / 30D / 90D / All)
- Charts:
  - Impressions over time
  - Clicks over time
  - Earnings over time
  - eCPM over time
- Breakdown table by ad unit

---

### 5. Earnings Page (`/publisher/earnings`)

- Current withdrawable balance
- "Withdraw" button (mock flow with toast confirmation)
- Minimum withdrawal threshold indicator
- Earnings history table:
  - Date, Source (campaign name), Ad Unit, Amount
- Cumulative earnings chart

---

### 6. Settings Page (`/publisher/settings`)

- Publisher profile:
  - App/Site name
  - Website URL
  - Category (DeFi, NFT, Gaming, News, etc.)
  - Description
- SDK integration snippet (read-only code block with copy button)
- Notification preferences (mock toggles)
- Danger zone: Deactivate account

---

## Mock Data

Extend `src/lib/mock-data.ts` with:

- `adUnits`: array of ad unit objects
- `publisherEarnings`: daily earnings data points
- `publisherMetrics`: overview stats (totalEarned, thisMonth, impressions, eCPM)
- `earningsHistory`: transaction-style records

---

## Design Requirements

- Match existing dark theme and design system exactly
- Use same color palette: orange (`#f7931a`), purple (`#a855f7`), green (`#4ade80`)
- Reuse `MetricCard`, `PerformanceChart`, `StatusBadge`, `Toast` components
- Framer Motion fade-in animations on all sections
- Fully responsive (mobile sidebar drawer same as advertiser dashboard)
- Tailwind v4 conventions (`bg-linear-to-*`, `shrink-0`, etc.)
- All iconsax icons must have explicit `color` prop

---

## Tasks

- [ ] Extend `src/lib/mock-data.ts` with publisher mock data
- [ ] Create `src/components/dashboard/PublisherSidebar.tsx`
- [ ] Create `src/app/publisher/layout.tsx`
- [ ] Build `src/app/publisher/page.tsx` — Overview
- [ ] Build `src/app/publisher/ad-units/page.tsx` — Ad Units
- [ ] Build `src/app/publisher/analytics/page.tsx` — Analytics
- [ ] Build `src/app/publisher/earnings/page.tsx` — Earnings
- [ ] Build `src/app/publisher/settings/page.tsx` — Settings
- [ ] Run `getDiagnostics` on all new files and fix all errors/warnings
