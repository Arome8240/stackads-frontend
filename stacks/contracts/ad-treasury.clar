;; Ad Treasury
;; Campaign funding and publisher payouts

(use-trait ft-trait 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard.sip-010-trait)

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u400))
(define-constant err-not-found (err u401))
(define-constant err-insufficient-budget (err u402))
(define-constant err-campaign-ended (err u403))
(define-constant err-campaign-paused (err u404))
(define-constant err-unauthorized (err u405))
(define-constant err-invalid-amount (err u406))
(define-constant err-already-exists (err u407))

;; Campaign status
(define-constant status-active u1)
(define-constant status-paused u2)
(define-constant status-ended u3)

;; Data maps
(define-map campaigns
  uint ;; campaign-id
  {
    advertiser: principal,
    budget: uint,
    spent: uint,
    cost-per-impression: uint,
    cost-per-click: uint,
    total-impressions: uint,
    total-clicks: uint,
    status: uint,
    start-block: uint,
    end-block: uint,
    metadata-uri: (string-utf8 256)
  }
)

(define-map publisher-earnings
  { campaign-id: uint, publisher: principal }
  {
    impressions: uint,
    clicks: uint,
    earned: uint,
    claimed: uint
  }
)

(define-map campaign-publishers
  { campaign-id: uint, publisher: principal }
  bool
)

(define-data-var campaign-nonce uint u0)
(define-data-var platform-fee-bps uint u250) ;; 2.5% platform fee

;; Read-only functions

(define-read-only (get-campaign (campaign-id uint))
  (map-get? campaigns campaign-id)
)

(define-read-only (get-publisher-earnings (campaign-id uint) (publisher principal))
  (map-get? publisher-earnings { campaign-id: campaign-id, publisher: publisher })
)

(define-read-only (get-platform-fee-bps)
  (var-get platform-fee-bps)
)

(define-read-only (calculate-platform-fee (amount uint))
  (/ (* amount (var-get platform-fee-bps)) u10000)
)

(define-read-only (get-campaign-remaining-budget (campaign-id uint))
  (match (map-get? campaigns campaign-id)
    campaign (- (get budget campaign) (get spent campaign))
    u0
  )
)

(define-read-only (is-campaign-active (campaign-id uint))
  (match (map-get? campaigns campaign-id)
    campaign
      (and
        (is-eq (get status campaign) status-active)
        (>= block-height (get start-block campaign))
        (< block-height (get end-block campaign))
      )
    false
  )
)

;; Public functions

(define-public (create-campaign
    (budget uint)
    (cost-per-impression uint)
    (cost-per-click uint)
    (duration uint)
    (metadata-uri (string-utf8 256))
  )
  (let
    (
      (campaign-id (+ (var-get campaign-nonce) u1))
      (platform-fee (calculate-platform-fee budget))
      (total-amount (+ budget platform-fee))
    )
    (asserts! (> budget u0) err-invalid-amount)
    
    ;; Check if advertiser is registered
    (asserts! (contract-call? .ad-registry is-active-advertiser tx-sender) err-unauthorized)
    
    ;; Transfer budget + platform fee to contract
    (try! (contract-call? .stackads-token transfer total-amount tx-sender (as-contract tx-sender) none))
    
    ;; Create campaign
    (map-set campaigns campaign-id {
      advertiser: tx-sender,
      budget: budget,
      spent: u0,
      cost-per-impression: cost-per-impression,
      cost-per-click: cost-per-click,
      total-impressions: u0,
      total-clicks: u0,
      status: status-active,
      start-block: block-height,
      end-block: (+ block-height duration),
      metadata-uri: metadata-uri
    })
    
    (var-set campaign-nonce campaign-id)
    
    (ok campaign-id)
  )
)

(define-public (fund-campaign (campaign-id uint) (additional-budget uint))
  (let
    (
      (campaign (unwrap! (map-get? campaigns campaign-id) err-not-found))
      (platform-fee (calculate-platform-fee additional-budget))
      (total-amount (+ additional-budget platform-fee))
    )
    (asserts! (is-eq (get advertiser campaign) tx-sender) err-unauthorized)
    (asserts! (> additional-budget u0) err-invalid-amount)
    
    ;; Transfer additional budget + fee
    (try! (contract-call? .stackads-token transfer total-amount tx-sender (as-contract tx-sender) none))
    
    ;; Update campaign budget
    (map-set campaigns campaign-id (merge campaign {
      budget: (+ (get budget campaign) additional-budget)
    }))
    
    (ok true)
  )
)

(define-public (record-ad-event
    (campaign-id uint)
    (publisher principal)
    (impressions uint)
    (clicks uint)
  )
  (let
    (
      (campaign (unwrap! (map-get? campaigns campaign-id) err-not-found))
      (cost-impressions (* impressions (get cost-per-impression campaign)))
      (cost-clicks (* clicks (get cost-per-click campaign)))
      (total-cost (+ cost-impressions cost-clicks))
      (current-earnings (default-to
        { impressions: u0, clicks: u0, earned: u0, claimed: u0 }
        (map-get? publisher-earnings { campaign-id: campaign-id, publisher: publisher })
      ))
    )
    ;; Only owner (oracle) can record events
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (asserts! (is-campaign-active campaign-id) err-campaign-ended)
    (asserts! (contract-call? .ad-registry is-active-publisher publisher) err-unauthorized)
    (asserts! (<= total-cost (- (get budget campaign) (get spent campaign))) err-insufficient-budget)
    
    ;; Update campaign stats
    (map-set campaigns campaign-id (merge campaign {
      spent: (+ (get spent campaign) total-cost),
      total-impressions: (+ (get total-impressions campaign) impressions),
      total-clicks: (+ (get total-clicks campaign) clicks)
    }))
    
    ;; Update publisher earnings
    (map-set publisher-earnings
      { campaign-id: campaign-id, publisher: publisher }
      {
        impressions: (+ (get impressions current-earnings) impressions),
        clicks: (+ (get clicks current-earnings) clicks),
        earned: (+ (get earned current-earnings) total-cost),
        claimed: (get claimed current-earnings)
      }
    )
    
    ;; Track publisher participation
    (map-set campaign-publishers { campaign-id: campaign-id, publisher: publisher } true)
    
    ;; Update registry stats
    (try! (contract-call? .ad-registry record-stats publisher impressions clicks))
    
    (ok total-cost)
  )
)

(define-public (claim-earnings (campaign-id uint))
  (let
    (
      (earnings (unwrap! (map-get? publisher-earnings { campaign-id: campaign-id, publisher: tx-sender }) err-not-found))
      (unclaimed (- (get earned earnings) (get claimed earnings)))
    )
    (asserts! (> unclaimed u0) err-invalid-amount)
    
    ;; Update claimed amount
    (map-set publisher-earnings
      { campaign-id: campaign-id, publisher: tx-sender }
      (merge earnings { claimed: (get earned earnings) })
    )
    
    ;; Transfer earnings to publisher
    (as-contract (try! (contract-call? .stackads-token transfer unclaimed tx-sender (as-contract tx-sender) none)))
    
    (ok unclaimed)
  )
)

(define-public (pause-campaign (campaign-id uint))
  (let
    (
      (campaign (unwrap! (map-get? campaigns campaign-id) err-not-found))
    )
    (asserts! (is-eq (get advertiser campaign) tx-sender) err-unauthorized)
    (asserts! (is-eq (get status campaign) status-active) err-campaign-paused)
    
    (ok (map-set campaigns campaign-id (merge campaign { status: status-paused })))
  )
)

(define-public (resume-campaign (campaign-id uint))
  (let
    (
      (campaign (unwrap! (map-get? campaigns campaign-id) err-not-found))
    )
    (asserts! (is-eq (get advertiser campaign) tx-sender) err-unauthorized)
    (asserts! (is-eq (get status campaign) status-paused) err-campaign-ended)
    
    (ok (map-set campaigns campaign-id (merge campaign { status: status-active })))
  )
)

(define-public (end-campaign (campaign-id uint))
  (let
    (
      (campaign (unwrap! (map-get? campaigns campaign-id) err-not-found))
      (unspent (- (get budget campaign) (get spent campaign)))
    )
    (asserts! (is-eq (get advertiser campaign) tx-sender) err-unauthorized)
    
    ;; Update campaign status
    (map-set campaigns campaign-id (merge campaign { status: status-ended }))
    
    ;; Refund unspent budget
    (if (> unspent u0)
      (as-contract (try! (contract-call? .stackads-token transfer unspent tx-sender (get advertiser campaign) none)))
      true
    )
    
    (ok unspent)
  )
)

;; Admin functions

(define-public (set-platform-fee (new-fee-bps uint))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (asserts! (<= new-fee-bps u1000) err-invalid-amount) ;; Max 10%
    (ok (var-set platform-fee-bps new-fee-bps))
  )
)

(define-public (withdraw-platform-fees (amount uint))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (as-contract (contract-call? .stackads-token transfer amount tx-sender contract-owner none))
  )
)

(define-public (emergency-pause-campaign (campaign-id uint))
  (let
    (
      (campaign (unwrap! (map-get? campaigns campaign-id) err-not-found))
    )
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (ok (map-set campaigns campaign-id (merge campaign { status: status-paused })))
  )
)
