# Frontend Refactor Tasks

## Project Overview
Next.js 16.2.2 app with TypeScript, Tailwind CSS 4, Framer Motion, Wagmi/Viem for Web3, and React Query. The app has a landing page and a dashboard for managing ad campaigns on the Stacks blockchain.

---

## 1. Codebase Cleanup

### 1.1 Remove Unused Files & Imports
- [ ] Audit all components for unused imports (especially icon imports)
- [ ] Remove unused public assets (file.svg, globe.svg, window.svg, vercel.svg)
- [ ] Check for unused utility functions in `/lib`
- [ ] Remove any dead code paths in components

### 1.2 Standardize Naming Conventions
- [ ] Ensure all component files use PascalCase consistently
- [ ] Standardize prop interface naming (e.g., `MetricCardProps` pattern)
- [ ] Ensure hook files use camelCase with `use` prefix
- [ ] Standardize CSS class naming (currently mixing approaches)

### 1.3 Component Decomposition
- [ ] **Hero.tsx** - Extract floating cards into separate components (`RevenueCard`, `OnChainBadge`)
- [ ] **Dashboard page.tsx** - Extract metrics array into separate config file
- [ ] **Campaigns page.tsx** - Extract table into `CampaignTable` component
- [ ] **Navbar.tsx** - Extract mobile menu into `MobileMenu` component
- [ ] Landing page sections - Consider extracting stat cards and feature cards into reusable components

### 1.4 Extract Reusable Logic
- [ ] Create `useToast` hook to replace inline toast state management
- [ ] Create `useSearch` hook for search/filter logic (used in campaigns page)
- [ ] Extract animation variants into `/lib/animations.ts` (fadeUp is duplicated)
- [ ] Create utility functions for number formatting (toLocaleString is repeated)

---

## 2. Performance Optimization

### 2.1 Identify & Fix Unnecessary Re-renders
- [ ] **Navbar.tsx** - Memoize scroll handler and menu toggle
- [ ] **Sidebar.tsx** - Memoize navigation items array
- [ ] **Dashboard pages** - Wrap metric cards in `React.memo`
- [ ] **PerformanceChart** - Ensure chart doesn't re-render on parent updates

### 2.2 Apply Memoization
- [ ] Wrap `MetricCard` with `React.memo`
- [ ] Wrap `StatusBadge` with `React.memo`
- [ ] Use `useMemo` for filtered campaigns in campaigns page
- [ ] Use `useCallback` for event handlers passed to child components
- [ ] Memoize animation variants in motion components

### 2.3 Implement Lazy Loading
- [ ] Lazy load dashboard routes (`/analytics`, `/wallet`, `/create`)
- [ ] Lazy load `PerformanceChart` component (recharts is heavy)
- [ ] Consider lazy loading landing page sections below fold
- [ ] Implement dynamic imports for icon components if bundle size is large

### 2.4 Optimize API Calls & Data Fetching
- [ ] Replace mock data with actual API calls using React Query
- [ ] Implement proper loading states for data fetching
- [ ] Add error boundaries for failed data fetches
- [ ] Consider implementing optimistic updates for campaign actions
- [ ] Add request deduplication for balance queries in `useMiniPay`

### 2.5 Reduce Bundle Size
- [ ] Analyze bundle with Next.js analyzer
- [ ] Tree-shake unused Framer Motion features
- [ ] Consider replacing `iconsax-react` with selective imports or lighter alternative
- [ ] Ensure recharts is code-split properly
- [ ] Review if all wagmi/viem features are needed

---

## 3. State Management Refactor

### 3.1 Simplify Complex State Logic
- [ ] **Navbar** - Simplify scroll state management (consider debouncing)
- [ ] **Campaigns page** - Consolidate search and toast state
- [ ] Consider using `useReducer` for complex form state in create campaign page

### 3.2 Remove Prop Drilling
- [ ] Create `ToastContext` to avoid passing toast handlers through props
- [ ] Consider `ThemeContext` if dark mode toggle is planned
- [ ] Evaluate if dashboard layout needs shared state context

### 3.3 Normalize Global vs Local State
- [ ] Move wallet connection state to context (currently in `useMiniPay`)
- [ ] Keep UI state (modals, toasts) local to components
- [ ] Campaign data should be managed by React Query cache
- [ ] User preferences (if any) should be in localStorage + context

### 3.4 Consider State Management Library
- [ ] Evaluate if Zustand is needed for global UI state
- [ ] React Query already handles server state well
- [ ] Keep local UI state in components unless shared across routes

---

## 4. UI/UX Improvements

### 4.1 Ensure Consistent Spacing & Layout
- [ ] Audit all components for consistent padding/margin (mixing p-5, p-6, px-6 py-4)
- [ ] Standardize card border radius (mixing rounded-xl, rounded-2xl)
- [ ] Create design tokens file for spacing, colors, shadows
- [ ] Ensure consistent gap spacing in flex/grid layouts

### 4.2 Improve Responsiveness
- [ ] Test all dashboard pages on mobile (table overflow issues likely)
- [ ] Improve mobile navigation in dashboard (sidebar is hidden)
- [ ] Make campaign table horizontally scrollable with sticky columns
- [ ] Test landing page on tablet breakpoints
- [ ] Ensure all CTAs are touch-friendly (min 44px height)

### 4.3 Add Loading, Error & Empty States
- [ ] Add skeleton loaders for dashboard metrics
- [ ] Add loading state for campaign table
- [ ] Improve empty state in campaigns table (currently just text)
- [ ] Add error boundaries for each dashboard route
- [ ] Add retry mechanisms for failed data fetches

### 4.4 Improve Accessibility
- [ ] Add proper ARIA labels to all interactive elements
- [ ] Ensure keyboard navigation works in dashboard sidebar
- [ ] Add focus visible states to all buttons/links
- [ ] Ensure color contrast meets WCAG AA standards
- [ ] Add screen reader text for icon-only buttons
- [ ] Test with keyboard-only navigation
- [ ] Add skip-to-content link

---

## 5. Testing

### 5.1 Add Unit Tests for Key Components
- [ ] Test `MetricCard` rendering with different props
- [ ] Test `StatusBadge` with all status types
- [ ] Test `useMiniPay` hook logic
- [ ] Test utility functions (when created)
- [ ] Test `Toast` component auto-dismiss behavior

### 5.2 Add Integration Tests
- [ ] Test dashboard navigation flow
- [ ] Test campaign search/filter functionality
- [ ] Test wallet connection flow (mock MiniPay)
- [ ] Test campaign action handlers (pause, edit, view)

### 5.3 Mock API Requests
- [ ] Set up MSW (Mock Service Worker) for API mocking
- [ ] Create mock handlers for campaign endpoints
- [ ] Create mock handlers for wallet/balance endpoints
- [ ] Ensure tests don't make real network requests

### 5.4 Improve Test Coverage
- [ ] Aim for 70%+ coverage on critical paths
- [ ] Focus on business logic and user interactions
- [ ] Don't over-test presentational components
- [ ] Add visual regression tests for key pages (optional)

---

## 6. Developer Experience

### 6.1 Improve TypeScript Types
- [ ] Create shared types file (`/types/index.ts`)
- [ ] Add proper return types to all functions
- [ ] Remove `any` types (check `useMiniPay` window.ethereum)
- [ ] Add stricter type checking for mock data
- [ ] Consider using Zod for runtime validation

### 6.2 Enforce Linting & Formatting
- [ ] Add ESLint configuration (currently missing)
- [ ] Add Prettier configuration
- [ ] Set up pre-commit hooks with Husky
- [ ] Add lint-staged for faster pre-commit checks
- [ ] Configure VSCode settings for auto-format on save

### 6.3 Improve Folder Structure
- [ ] Create `/components/ui` for reusable UI components
- [ ] Create `/components/features` for feature-specific components
- [ ] Move dashboard components to `/components/dashboard` (already done ✓)
- [ ] Create `/lib/utils` for utility functions
- [ ] Create `/lib/constants` for app constants
- [ ] Create `/types` folder for shared TypeScript types
- [ ] Consider `/hooks` subfolder organization by feature

### 6.4 Add Documentation
- [ ] Add JSDoc comments to complex functions
- [ ] Document component props with TSDoc
- [ ] Create README for component library
- [ ] Document environment variables needed
- [ ] Add inline comments for complex business logic
- [ ] Document Web3 integration setup

---

## 7. Final Review & Validation

### 7.1 Ensure No Breaking Changes
- [ ] Test all user flows end-to-end
- [ ] Verify wallet connection still works
- [ ] Verify all dashboard routes render correctly
- [ ] Check that animations still work smoothly
- [ ] Ensure mobile experience is not degraded

### 7.2 Performance Comparison
- [ ] Run Lighthouse audit before refactor (baseline)
- [ ] Run Lighthouse audit after refactor
- [ ] Compare bundle sizes before/after
- [ ] Measure Time to Interactive (TTI)
- [ ] Check for any performance regressions

### 7.3 Validate Critical User Flows
- [ ] Landing page → Dashboard navigation
- [ ] Campaign creation flow (when implemented)
- [ ] Campaign management (view, edit, pause)
- [ ] Wallet connection and balance display
- [ ] Mobile navigation and responsiveness

### 7.4 Document Technical Debt Resolved
- [ ] List all performance improvements made
- [ ] Document new patterns established
- [ ] Note any remaining technical debt
- [ ] Create follow-up tickets for future work

---

## Execution Strategy

### Recommended Order of Execution

**Phase 1: Foundation (Week 1)**
1. Set up linting, formatting, and pre-commit hooks (6.2)
2. Create shared types and constants files (6.1, 6.3)
3. Extract reusable logic into hooks and utilities (1.4)
4. Standardize naming conventions (1.2)

**Phase 2: Component Refactor (Week 2)**
5. Decompose large components (1.3)
6. Apply memoization to prevent re-renders (2.1, 2.2)
7. Remove unused code and imports (1.1)
8. Improve folder structure (6.3)

**Phase 3: Performance & UX (Week 3)**
9. Implement lazy loading (2.3)
10. Add loading, error, and empty states (4.3)
11. Improve responsiveness (4.2)
12. Ensure consistent spacing and design tokens (4.1)

**Phase 4: State & Data (Week 4)**
13. Set up React Query for data fetching (2.4)
14. Create context providers for shared state (3.2)
15. Normalize state management patterns (3.3)

**Phase 5: Testing & Accessibility (Week 5)**
16. Add unit tests for critical components (5.1)
17. Add integration tests for user flows (5.2)
18. Improve accessibility (4.4)
19. Set up MSW for API mocking (5.3)

**Phase 6: Final Polish (Week 6)**
20. Bundle size optimization (2.5)
21. Add documentation (6.4)
22. Performance audit and comparison (7.2)
23. Final validation and testing (7.1, 7.3)

### Tasks That Can Be Parallelized

- **Linting setup** (6.2) can run parallel to **type improvements** (6.1)
- **Component decomposition** (1.3) can run parallel to **hook extraction** (1.4)
- **Memoization** (2.2) can run parallel to **lazy loading** (2.3)
- **Unit tests** (5.1) can be written as components are refactored
- **Accessibility improvements** (4.4) can run parallel to **responsive fixes** (4.2)

### Risky Areas to Be Careful With

⚠️ **Web3 Integration** - The `useMiniPay` hook and wagmi setup are critical. Test thoroughly after any changes.

⚠️ **Framer Motion Animations** - Refactoring animated components can break transitions. Test all animations.

⚠️ **Next.js 16.2.2** - This is a newer version. Check Next.js docs before making routing or data fetching changes.

⚠️ **Mock Data Replacement** - When replacing mock data with real APIs, ensure backward compatibility during transition.

⚠️ **Tailwind CSS 4** - New version may have breaking changes. Verify all utility classes still work.

---

## Constraints

✅ **Incremental refactoring** - Make small, testable changes
✅ **No full rewrites** - Improve existing code, don't start from scratch
✅ **Maintain functionality** - All features must continue working
✅ **Avoid over-engineering** - Keep solutions simple and pragmatic
✅ **Test as you go** - Don't wait until the end to test changes
