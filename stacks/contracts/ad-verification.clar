;; Ad Verification
;; Fraud detection and ad quality verification

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u800))
(define-constant err-not-found (err u801))
(define-constant err-already-verified (err u802))
(define-constant err-verification-failed (err u803))
(define-constant err-invalid-proof (err u804))

;; Verification status
(define-constant status-pending u1)
(define-constant status-verified u2)
(define-constant status-rejected u3)
(define-constant status-flagged u4)

;; Fraud types
(define-constant fraud-click u1)
(define-constant fraud-impression u2)
(define-constant fraud-conversion u3)
(define-constant fraud-bot u4)

;; Data maps
(define-map ad-verifications
  { campaign-id: uint, publisher: principal, timestamp: uint }
  {
    impressions: uint,
    clicks: uint,
    conversions: uint,
    status: uint,
    fraud-score: uint, ;; 0-1000 (0=clean, 1000=definite fraud)
    verified-by: (optional principal),
    verified-at: uint,
    proof-hash: (buff 32)
  }
)

(define-map fraud-reports
  uint ;; report-id
  {
    campaign-id: uint,
    publisher: principal,
    fraud-type: uint,
    severity: uint, ;; 1-10
    description: (string-utf8 256),
    reported-by: principal,
    reported-at: uint,
    resolved: bool
  }
)

(define-data-var report-nonce uint u0)

;; Trusted verifiers
(define-map trusted-verifiers principal bool)

;; Fraud thresholds
(define-data-var fraud-threshold uint u700) ;; Score above this triggers review
(define-data-var auto-reject-threshold uint u900) ;; Score above this auto-rejects

;; Read-only functions

(define-read-only (get-verification (campaign-id uint) (publisher principal) (timestamp uint))
  (map-get? ad-verifications { campaign-id: campaign-id, publisher: publisher, timestamp: timestamp })
)

(define-read-only (get-fraud-report (report-id uint))
  (map-get? fraud-reports report-id)
)

(define-read-only (is-trusted-verifier (verifier principal))
  (default-to false (map-get? trusted-verifiers verifier))
)

(define-read-only (get-fraud-threshold)
  (var-get fraud-threshold)
)

(define-read-only (calculate-fraud-score
    (impressions uint)
    (clicks uint)
    (conversions uint)
    (publisher-reputation uint)
  )
  (let
    (
      ;; Calculate CTR (click-through rate)
      (ctr (if (> impressions u0) (/ (* clicks u10000) impressions) u0))
      ;; Calculate conversion rate
      (cvr (if (> clicks u0) (/ (* conversions u10000) clicks) u0))
      ;; Suspicious patterns
      (suspicious-ctr (if (> ctr u1000) u200 u0)) ;; CTR > 10% is suspicious
      (suspicious-cvr (if (> cvr u5000) u200 u0)) ;; CVR > 50% is suspicious
      (low-reputation (if (< publisher-reputation u300) u300 u0))
      ;; Perfect ratios are suspicious
      (perfect-ratio (if (is-eq (mod clicks u10) u0) u100 u0))
    )
    (+ suspicious-ctr suspicious-cvr low-reputation perfect-ratio)
  )
)

;; Public functions

(define-public (submit-verification
    (campaign-id uint)
    (publisher principal)
    (impressions uint)
    (clicks uint)
    (conversions uint)
    (proof-hash (buff 32))
  )
  (let
    (
      (timestamp block-height)
      (publisher-data (unwrap! (contract-call? .ad-registry get-participant publisher) err-not-found))
      (fraud-score (calculate-fraud-score 
        impressions 
        clicks 
        conversions 
        (get reputation-score publisher-data)))
      (status (if (>= fraud-score (var-get auto-reject-threshold))
        status-rejected
        (if (>= fraud-score (var-get fraud-threshold))
          status-flagged
          status-pending)))
    )
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    
    (ok (map-set ad-verifications
      { campaign-id: campaign-id, publisher: publisher, timestamp: timestamp }
      {
        impressions: impressions,
        clicks: clicks,
        conversions: conversions,
        status: status,
        fraud-score: fraud-score,
        verified-by: none,
        verified-at: u0,
        proof-hash: proof-hash
      }
    ))
  )
)

(define-public (verify-ad-data
    (campaign-id uint)
    (publisher principal)
    (timestamp uint)
    (approved bool)
  )
  (let
    (
      (verification (unwrap! (get-verification campaign-id publisher timestamp) err-not-found))
    )
    (asserts! (is-trusted-verifier tx-sender) err-owner-only)
    (asserts! (is-eq (get status verification) status-pending) err-already-verified)
    
    (ok (map-set ad-verifications
      { campaign-id: campaign-id, publisher: publisher, timestamp: timestamp }
      (merge verification {
        status: (if approved status-verified status-rejected),
        verified-by: (some tx-sender),
        verified-at: block-height
      })
    ))
  )
)

(define-public (report-fraud
    (campaign-id uint)
    (publisher principal)
    (fraud-type uint)
    (severity uint)
    (description (string-utf8 256))
  )
  (let
    (
      (report-id (+ (var-get report-nonce) u1))
    )
    (asserts! (<= severity u10) err-invalid-proof)
    (asserts! (<= fraud-type u4) err-invalid-proof)
    
    (map-set fraud-reports report-id {
      campaign-id: campaign-id,
      publisher: publisher,
      fraud-type: fraud-type,
      severity: severity,
      description: description,
      reported-by: tx-sender,
      reported-at: block-height,
      resolved: false
    })
    
    (var-set report-nonce report-id)
    
    (ok report-id)
  )
)

(define-public (resolve-fraud-report
    (report-id uint)
    (action-taken (string-utf8 256))
  )
  (let
    (
      (report (unwrap! (get-fraud-report report-id) err-not-found))
    )
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    
    (ok (map-set fraud-reports report-id
      (merge report { resolved: true })
    ))
  )
)

;; Admin functions

(define-public (add-trusted-verifier (verifier principal))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (ok (map-set trusted-verifiers verifier true))
  )
)

(define-public (remove-trusted-verifier (verifier principal))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (ok (map-delete trusted-verifiers verifier))
  )
)

(define-public (set-fraud-threshold (new-threshold uint))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (asserts! (<= new-threshold u1000) err-invalid-proof)
    (ok (var-set fraud-threshold new-threshold))
  )
)

(define-public (set-auto-reject-threshold (new-threshold uint))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (asserts! (<= new-threshold u1000) err-invalid-proof)
    (ok (var-set auto-reject-threshold new-threshold))
  )
)

;; Helper functions

(define-read-only (get-publisher-fraud-history (publisher principal))
  ;; In production, this would aggregate fraud reports
  ;; For now, returns a simple check
  (ok { has-reports: false, total-reports: u0 })
)

(define-read-only (is-verification-approved (campaign-id uint) (publisher principal) (timestamp uint))
  (match (get-verification campaign-id publisher timestamp)
    verification (is-eq (get status verification) status-verified)
    false
  )
)

(define-read-only (get-verification-status (campaign-id uint) (publisher principal) (timestamp uint))
  (match (get-verification campaign-id publisher timestamp)
    verification (ok (get status verification))
    err-not-found
  )
)
