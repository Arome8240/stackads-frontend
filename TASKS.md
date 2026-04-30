# StackAds — Remaining Tasks

Each task must be committed before moving to the next.

---

## Task 1 — Empty State Component

- [ ] Create `src/components/ui/EmptyState.tsx` — reusable illustrated empty state with icon, title, description, optional CTA button
- [ ] Wire into campaigns table (advertiser dashboard)
- [ ] Wire into ad units table (publisher dashboard)
- [ ] Wire into earnings history table (publisher dashboard)

Commit: `feat: add EmptyState component and wire into tables`

---

## Task 2 — Loading Skeleton Component

- [ ] Create `src/components/ui/Skeleton.tsx` — base skeleton block with pulse animation
- [ ] Create `src/components/ui/SkeletonCard.tsx` — metric card skeleton
- [ ] Create `src/components/ui/SkeletonTable.tsx` — table row skeletons
- [ ] Add skeleton loading state to advertiser dashboard overview page
- [ ] Add skeleton loading state to publisher overview page

Commit: `feat: add Skeleton components and loading states to dashboards`

---

## Task 3 — Connect Wallet UI

- [ ] Create `src/components/ui/ConnectWalletButton.tsx` — shows connect button or truncated address when connected, hidden inside MiniPay
- [ ] Wire `useMiniPay` hook into the button
- [ ] Add button to advertiser `DashboardNav`
- [ ] Add button to publisher `PublisherNav`
- [ ] Show connected address + chain in nav when wallet is connected

Commit: `feat: add ConnectWalletButton wired to useMiniPay hook`

---

## Task 4 — Real On-Chain Wallet Balance

- [ ] Update `src/app/dashboard/wallet/page.tsx` to read real balance from `useMiniPay` when connected
- [ ] Fall back to mock data when wallet is not connected
- [ ] Show wallet address and chain name in the balance card
- [ ] Show a "Connect Wallet" prompt when disconnected

Commit: `feat: wire advertiser wallet page to real on-chain balance`

---

## Task 5 — 404 Page

- [ ] Create `src/app/not-found.tsx` — styled 404 page matching dark theme with a back-to-home button

Commit: `feat: add custom 404 not-found page`

---

## Task 6 — Error Boundary Page

- [ ] Create `src/app/error.tsx` — global error boundary page with retry button
- [ ] Create `src/app/dashboard/error.tsx` — dashboard-scoped error boundary
- [ ] Create `src/app/publisher/error.tsx` — publisher-scoped error boundary

Commit: `feat: add error boundary pages for app, dashboard, and publisher`

---

## Task 7 — Onboarding Flow

- [ ] Create `src/app/onboarding/page.tsx` — role selection screen (Advertiser vs Publisher)
- [ ] Create `src/app/onboarding/advertiser/page.tsx` — advertiser signup form (name, company, website, budget range)
- [ ] Create `src/app/onboarding/publisher/page.tsx` — publisher signup form (app name, URL, category, expected traffic)
- [ ] Add "Get Started" CTA on landing page hero that links to `/onboarding`

Commit: `feat: add onboarding flow for advertisers and publishers`

---

## Progress

- [x] Task 1 — Empty State Component
- [x] Task 2 — Loading Skeleton Component
- [x] Task 3 — Connect Wallet UI
- [x] Task 4 — Real On-Chain Wallet Balance
- [x] Task 5 — 404 Page
- [x] Task 6 — Error Boundary Page
- [x] Task 7 — Onboarding Flow
