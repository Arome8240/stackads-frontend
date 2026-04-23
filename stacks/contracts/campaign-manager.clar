;; Campaign Manager
;; Advanced campaign management with targeting and optimization

(use-trait ft-trait 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard.sip-010-trait)

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u700))
(define-constant err-not-found (err u701))
(define-constant err-unauthorized (err u702))
(define-constant err-invalid-params (err u703))
(define-constant err-campaign-ended (err u704))

;; Campaign types
(define-constant type-cpc u1) ;; Cost per click
(define-constant type-cpm u2) ;; Cost per mille (1000 impressions)
(define-constant type-cpa u3) ;; Cost per action

;; Targeting options
(define-map campaign-targeting
  uint ;; campaign-id
  {
    geo-locations: (list 10 (string-ascii 2)), ;; Country codes
    device-types: (list 5 uint), ;; 1=mobile, 2=desktop, 3=tablet
    min-reputation: uint,
    max-daily-budget: uint,
    time-restrictions: (list 7 uint) ;; Days of week (0-6)
  }
)

;; Campaign creatives
(define-map campaign-creatives
  { campaign-id: uint, creative-id: uint }
  {
    creative-uri: (string-utf8 256),
    creative-type: (string-ascii 20), ;; banner, video, native
    width: uint,
    height: uint,
    active: bool,
    impressions: uint,
    clicks: uint
  }
)

(define-map campaign-creative-count uint uint)

;; A/B testing
(define-map ab-tests
  uint ;; campaign-id
  {
    enabled: bool,
    variant-a-id: uint,
    variant-b-id: uint,
    variant-a-weight: uint, ;; 0-100
    variant-b-weight: uint, ;; 0-100
    variant-a-conversions: uint,
    variant-b-conversions: uint
  }
)

;; Performance tracking
(define-map campaign-performance
  { campaign-id: uint, date: uint }
  {
    impressions: uint,
    clicks: uint,
    conversions: uint,
    spend: uint,
    revenue: uint
  }
)

;; Read-only functions

(define-read-only (get-campaign-targeting (campaign-id uint))
  (map-get? campaign-targeting campaign-id)
)

(define-read-only (get-campaign-creative (campaign-id uint) (creative-id uint))
  (map-get? campaign-creatives { campaign-id: campaign-id, creative-id: creative-id })
)

(define-read-only (get-creative-count (campaign-id uint))
  (default-to u0 (map-get? campaign-creative-count campaign-id))
)

(define-read-only (get-ab-test (campaign-id uint))
  (map-get? ab-tests campaign-id)
)

(define-read-only (get-campaign-performance (campaign-id uint) (date uint))
  (map-get? campaign-performance { campaign-id: campaign-id, date: date })
)

(define-read-only (calculate-ctr (impressions uint) (clicks uint))
  (if (is-eq impressions u0)
    u0
    (/ (* clicks u10000) impressions) ;; Returns CTR in basis points
  )
)

(define-read-only (calculate-conversion-rate (clicks uint) (conversions uint))
  (if (is-eq clicks u0)
    u0
    (/ (* conversions u10000) clicks) ;; Returns conversion rate in basis points
  )
)

;; Public functions

(define-public (set-campaign-targeting
    (campaign-id uint)
    (geo-locations (list 10 (string-ascii 2)))
    (device-types (list 5 uint))
    (min-reputation uint)
    (max-daily-budget uint)
    (time-restrictions (list 7 uint))
  )
  (begin
    ;; Verify campaign ownership through ad-treasury
    (asserts! (is-campaign-owner campaign-id tx-sender) err-unauthorized)
    
    (ok (map-set campaign-targeting campaign-id {
      geo-locations: geo-locations,
      device-types: device-types,
      min-reputation: min-reputation,
      max-daily-budget: max-daily-budget,
      time-restrictions: time-restrictions
    }))
  )
)

(define-public (add-campaign-creative
    (campaign-id uint)
    (creative-uri (string-utf8 256))
    (creative-type (string-ascii 20))
    (width uint)
    (height uint)
  )
  (let
    (
      (creative-count (get-creative-count campaign-id))
      (new-creative-id (+ creative-count u1))
    )
    (asserts! (is-campaign-owner campaign-id tx-sender) err-unauthorized)
    
    (map-set campaign-creatives
      { campaign-id: campaign-id, creative-id: new-creative-id }
      {
        creative-uri: creative-uri,
        creative-type: creative-type,
        width: width,
        height: height,
        active: true,
        impressions: u0,
        clicks: u0
      }
    )
    
    (map-set campaign-creative-count campaign-id new-creative-id)
    
    (ok new-creative-id)
  )
)

(define-public (toggle-creative
    (campaign-id uint)
    (creative-id uint)
    (active bool)
  )
  (let
    (
      (creative (unwrap! (get-campaign-creative campaign-id creative-id) err-not-found))
    )
    (asserts! (is-campaign-owner campaign-id tx-sender) err-unauthorized)
    
    (ok (map-set campaign-creatives
      { campaign-id: campaign-id, creative-id: creative-id }
      (merge creative { active: active })
    ))
  )
)

(define-public (setup-ab-test
    (campaign-id uint)
    (variant-a-id uint)
    (variant-b-id uint)
    (variant-a-weight uint)
    (variant-b-weight uint)
  )
  (begin
    (asserts! (is-campaign-owner campaign-id tx-sender) err-unauthorized)
    (asserts! (is-some (get-campaign-creative campaign-id variant-a-id)) err-not-found)
    (asserts! (is-some (get-campaign-creative campaign-id variant-b-id)) err-not-found)
    (asserts! (is-eq (+ variant-a-weight variant-b-weight) u100) err-invalid-params)
    
    (ok (map-set ab-tests campaign-id {
      enabled: true,
      variant-a-id: variant-a-id,
      variant-b-id: variant-b-id,
      variant-a-weight: variant-a-weight,
      variant-b-weight: variant-b-weight,
      variant-a-conversions: u0,
      variant-b-conversions: u0
    }))
  )
)

(define-public (record-creative-impression
    (campaign-id uint)
    (creative-id uint)
  )
  (let
    (
      (creative (unwrap! (get-campaign-creative campaign-id creative-id) err-not-found))
    )
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    
    (ok (map-set campaign-creatives
      { campaign-id: campaign-id, creative-id: creative-id }
      (merge creative { impressions: (+ (get impressions creative) u1) })
    ))
  )
)

(define-public (record-creative-click
    (campaign-id uint)
    (creative-id uint)
  )
  (let
    (
      (creative (unwrap! (get-campaign-creative campaign-id creative-id) err-not-found))
    )
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    
    (ok (map-set campaign-creatives
      { campaign-id: campaign-id, creative-id: creative-id }
      (merge creative { clicks: (+ (get clicks creative) u1) })
    ))
  )
)

(define-public (record-conversion
    (campaign-id uint)
    (variant-id uint)
  )
  (let
    (
      (ab-test (unwrap! (get-ab-test campaign-id) err-not-found))
    )
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (asserts! (get enabled ab-test) err-invalid-params)
    
    (ok (map-set ab-tests campaign-id
      (if (is-eq variant-id (get variant-a-id ab-test))
        (merge ab-test { variant-a-conversions: (+ (get variant-a-conversions ab-test) u1) })
        (merge ab-test { variant-b-conversions: (+ (get variant-b-conversions ab-test) u1) })
      )
    ))
  )
)

(define-public (record-daily-performance
    (campaign-id uint)
    (date uint)
    (impressions uint)
    (clicks uint)
    (conversions uint)
    (spend uint)
    (revenue uint)
  )
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    
    (ok (map-set campaign-performance
      { campaign-id: campaign-id, date: date }
      {
        impressions: impressions,
        clicks: clicks,
        conversions: conversions,
        spend: spend,
        revenue: revenue
      }
    ))
  )
)

;; Helper functions

(define-private (is-campaign-owner (campaign-id uint) (caller principal))
  (match (contract-call? .ad-treasury get-campaign campaign-id)
    campaign (is-eq (get advertiser campaign) caller)
    false
  )
)

(define-read-only (get-creative-performance (campaign-id uint) (creative-id uint))
  (match (get-campaign-creative campaign-id creative-id)
    creative
      (ok {
        impressions: (get impressions creative),
        clicks: (get clicks creative),
        ctr: (calculate-ctr (get impressions creative) (get clicks creative))
      })
    err-not-found
  )
)

(define-read-only (get-ab-test-results (campaign-id uint))
  (match (get-ab-test campaign-id)
    test
      (ok {
        variant-a-conversions: (get variant-a-conversions test),
        variant-b-conversions: (get variant-b-conversions test),
        variant-a-rate: (calculate-conversion-rate 
          (get variant-a-weight test) 
          (get variant-a-conversions test)),
        variant-b-rate: (calculate-conversion-rate 
          (get variant-b-weight test) 
          (get variant-b-conversions test))
      })
    err-not-found
  )
)
