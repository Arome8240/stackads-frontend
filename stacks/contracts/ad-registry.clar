;; Ad Registry
;; Publisher and advertiser registration with staking

(use-trait ft-trait 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard.sip-010-trait)

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u200))
(define-constant err-already-registered (err u201))
(define-constant err-not-registered (err u202))
(define-constant err-not-active (err u203))
(define-constant err-insufficient-stake (err u204))
(define-constant err-invalid-reputation (err u205))

;; Stake requirements (in micro-tokens, 6 decimals)
(define-data-var publisher-stake-required uint u100000000) ;; 100 SADS
(define-data-var advertiser-stake-required uint u500000000) ;; 500 SADS

;; Participant types
(define-constant type-publisher u1)
(define-constant type-advertiser u2)

;; Status types
(define-constant status-unregistered u0)
(define-constant status-active u1)
(define-constant status-suspended u2)
(define-constant status-slashed u3)

;; Data maps
(define-map participants
  principal
  {
    participant-type: uint,
    status: uint,
    staked-amount: uint,
    reputation-score: uint,
    metadata-uri: (string-utf8 256),
    registered-at: uint,
    total-impressions: uint,
    total-clicks: uint
  }
)

(define-map publisher-list uint principal)
(define-map advertiser-list uint principal)
(define-data-var publisher-count uint u0)
(define-data-var advertiser-count uint u0)

;; Public functions

(define-public (register-publisher (metadata-uri (string-utf8 256)))
  (let
    (
      (stake-required (var-get publisher-stake-required))
    )
    (try! (register-participant tx-sender type-publisher metadata-uri stake-required))
    (map-set publisher-list (var-get publisher-count) tx-sender)
    (var-set publisher-count (+ (var-get publisher-count) u1))
    (ok true)
  )
)

(define-public (register-advertiser (metadata-uri (string-utf8 256)))
  (let
    (
      (stake-required (var-get advertiser-stake-required))
    )
    (try! (register-participant tx-sender type-advertiser metadata-uri stake-required))
    (map-set advertiser-list (var-get advertiser-count) tx-sender)
    (var-set advertiser-count (+ (var-get advertiser-count) u1))
    (ok true)
  )
)

(define-public (unregister)
  (let
    (
      (participant (unwrap! (map-get? participants tx-sender) err-not-registered))
      (refund (get staked-amount participant))
    )
    (asserts! (is-eq (get status participant) status-active) err-not-active)
    (map-set participants tx-sender (merge participant {
      status: status-unregistered,
      staked-amount: u0
    }))
    (if (> refund u0)
      (as-contract (try! (contract-call? .stackads-token transfer refund tx-sender (as-contract tx-sender) none)))
      true
    )
    (ok refund)
  )
)

(define-public (update-metadata (new-uri (string-utf8 256)))
  (let
    (
      (participant (unwrap! (map-get? participants tx-sender) err-not-registered))
    )
    (asserts! (is-eq (get status participant) status-active) err-not-active)
    (ok (map-set participants tx-sender (merge participant { metadata-uri: new-uri })))
  )
)

;; Admin functions

(define-public (update-reputation (participant principal) (new-score uint))
  (let
    (
      (participant-data (unwrap! (map-get? participants participant) err-not-registered))
    )
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (asserts! (<= new-score u1000) err-invalid-reputation)
    (ok (map-set participants participant (merge participant-data { reputation-score: new-score })))
  )
)

(define-public (record-stats (publisher principal) (impressions uint) (clicks uint))
  (let
    (
      (participant (unwrap! (map-get? participants publisher) err-not-registered))
    )
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (ok (map-set participants publisher (merge participant {
      total-impressions: (+ (get total-impressions participant) impressions),
      total-clicks: (+ (get total-clicks participant) clicks)
    })))
  )
)

(define-public (suspend (participant principal) (reason (string-utf8 256)))
  (let
    (
      (participant-data (unwrap! (map-get? participants participant) err-not-registered))
    )
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (asserts! (is-eq (get status participant-data) status-active) err-not-active)
    (ok (map-set participants participant (merge participant-data { status: status-suspended })))
  )
)

(define-public (reinstate (participant principal))
  (let
    (
      (participant-data (unwrap! (map-get? participants participant) err-not-registered))
    )
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (ok (map-set participants participant (merge participant-data { status: status-active })))
  )
)

(define-public (slash (participant principal) (bps uint) (reason (string-utf8 256)))
  (let
    (
      (participant-data (unwrap! (map-get? participants participant) err-not-registered))
      (slash-amount (/ (* (get staked-amount participant-data) bps) u10000))
    )
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (map-set participants participant (merge participant-data {
      staked-amount: (- (get staked-amount participant-data) slash-amount),
      status: status-slashed,
      reputation-score: u0
    }))
    (if (> slash-amount u0)
      (as-contract (try! (contract-call? .stackads-token transfer slash-amount tx-sender contract-owner none)))
      true
    )
    (ok slash-amount)
  )
)

(define-public (set-publisher-stake-required (amount uint))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (ok (var-set publisher-stake-required amount))
  )
)

(define-public (set-advertiser-stake-required (amount uint))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (ok (var-set advertiser-stake-required amount))
  )
)

;; Read-only functions

(define-read-only (get-participant (who principal))
  (map-get? participants who)
)

(define-read-only (is-active-publisher (who principal))
  (match (map-get? participants who)
    participant (and (is-eq (get status participant) status-active) (is-eq (get participant-type participant) type-publisher))
    false
  )
)

(define-read-only (is-active-advertiser (who principal))
  (match (map-get? participants who)
    participant (and (is-eq (get status participant) status-active) (is-eq (get participant-type participant) type-advertiser))
    false
  )
)

(define-read-only (get-publisher-count)
  (var-get publisher-count)
)

(define-read-only (get-advertiser-count)
  (var-get advertiser-count)
)

(define-read-only (get-click-through-rate (publisher principal))
  (match (map-get? participants publisher)
    participant
      (if (is-eq (get total-impressions participant) u0)
        u0
        (/ (* (get total-clicks participant) u10000) (get total-impressions participant))
      )
    u0
  )
)

;; Private functions

(define-private (register-participant (who principal) (participant-type uint) (metadata-uri (string-utf8 256)) (stake-required uint))
  (begin
    (asserts! (is-none (map-get? participants who)) err-already-registered)
    (try! (contract-call? .stackads-token transfer stake-required who (as-contract tx-sender) none))
    (ok (map-set participants who {
      participant-type: participant-type,
      status: status-active,
      staked-amount: stake-required,
      reputation-score: u500,
      metadata-uri: metadata-uri,
      registered-at: block-height,
      total-impressions: u0,
      total-clicks: u0
    }))
  )
)
