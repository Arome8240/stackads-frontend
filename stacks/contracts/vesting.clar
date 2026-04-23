;; Vesting Contract
;; Token vesting schedules for team and investors

(use-trait ft-trait 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard.sip-010-trait)

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u600))
(define-constant err-not-found (err u601))
(define-constant err-already-exists (err u602))
(define-constant err-no-tokens-due (err u603))
(define-constant err-invalid-params (err u604))
(define-constant err-not-revocable (err u605))
(define-constant err-already-revoked (err u606))

;; Data maps
(define-map vesting-schedules
  principal ;; beneficiary
  {
    total-amount: uint,
    released-amount: uint,
    start-block: uint,
    cliff-duration: uint, ;; blocks until cliff
    vesting-duration: uint, ;; total vesting period in blocks
    revocable: bool,
    revoked: bool,
    revoked-at: uint
  }
)

(define-map schedule-exists principal bool)

;; Read-only functions

(define-read-only (get-vesting-schedule (beneficiary principal))
  (map-get? vesting-schedules beneficiary)
)

(define-read-only (has-schedule (beneficiary principal))
  (default-to false (map-get? schedule-exists beneficiary))
)

(define-read-only (compute-releasable-amount (beneficiary principal))
  (match (map-get? vesting-schedules beneficiary)
    schedule
      (let
        (
          (current-block block-height)
          (start (get start-block schedule))
          (cliff (get cliff-duration schedule))
          (duration (get vesting-duration schedule))
          (total (get total-amount schedule))
          (released (get released-amount schedule))
        )
        (if (get revoked schedule)
          ;; If revoked, calculate up to revocation time
          (let
            (
              (revoked-at (get revoked-at schedule))
              (vested-at-revocation (compute-vested-amount-at-block schedule revoked-at))
            )
            (if (> vested-at-revocation released)
              (- vested-at-revocation released)
              u0
            )
          )
          ;; Normal vesting calculation
          (if (< current-block (+ start cliff))
            u0 ;; Before cliff
            (let
              (
                (vested (compute-vested-amount-at-block schedule current-block))
              )
              (if (> vested released)
                (- vested released)
                u0
              )
            )
          )
        )
      )
    u0
  )
)

(define-private (compute-vested-amount-at-block (schedule (tuple (total-amount uint) (released-amount uint) (start-block uint) (cliff-duration uint) (vesting-duration uint) (revocable bool) (revoked bool) (revoked-at uint))) (at-block uint))
  (let
    (
      (start (get start-block schedule))
      (duration (get vesting-duration schedule))
      (total (get total-amount schedule))
    )
    (if (>= at-block (+ start duration))
      total ;; Fully vested
      (if (< at-block (+ start (get cliff-duration schedule)))
        u0 ;; Before cliff
        ;; Linear vesting
        (/ (* total (- at-block start)) duration)
      )
    )
  )
)

(define-read-only (get-vested-amount (beneficiary principal))
  (match (map-get? vesting-schedules beneficiary)
    schedule
      (if (get revoked schedule)
        (compute-vested-amount-at-block schedule (get revoked-at schedule))
        (compute-vested-amount-at-block schedule block-height)
      )
    u0
  )
)

(define-read-only (get-withdrawable-amount (beneficiary principal))
  (compute-releasable-amount beneficiary)
)

;; Public functions

(define-public (create-vesting-schedule
    (beneficiary principal)
    (total-amount uint)
    (cliff-duration uint)
    (vesting-duration uint)
    (revocable bool)
  )
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (asserts! (not (has-schedule beneficiary)) err-already-exists)
    (asserts! (> total-amount u0) err-invalid-params)
    (asserts! (> vesting-duration u0) err-invalid-params)
    (asserts! (<= cliff-duration vesting-duration) err-invalid-params)
    
    ;; Transfer tokens to contract
    (try! (contract-call? .stackads-token transfer total-amount tx-sender (as-contract tx-sender) none))
    
    ;; Create vesting schedule
    (map-set vesting-schedules beneficiary {
      total-amount: total-amount,
      released-amount: u0,
      start-block: block-height,
      cliff-duration: cliff-duration,
      vesting-duration: vesting-duration,
      revocable: revocable,
      revoked: false,
      revoked-at: u0
    })
    
    (map-set schedule-exists beneficiary true)
    
    (ok true)
  )
)

(define-public (release)
  (let
    (
      (schedule (unwrap! (map-get? vesting-schedules tx-sender) err-not-found))
      (releasable (compute-releasable-amount tx-sender))
    )
    (asserts! (> releasable u0) err-no-tokens-due)
    
    ;; Update released amount
    (map-set vesting-schedules tx-sender
      (merge schedule {
        released-amount: (+ (get released-amount schedule) releasable)
      })
    )
    
    ;; Transfer tokens to beneficiary
    (as-contract (try! (contract-call? .stackads-token transfer releasable tx-sender (as-contract tx-sender) none)))
    
    (ok releasable)
  )
)

(define-public (release-for (beneficiary principal))
  (let
    (
      (schedule (unwrap! (map-get? vesting-schedules beneficiary) err-not-found))
      (releasable (compute-releasable-amount beneficiary))
    )
    (asserts! (> releasable u0) err-no-tokens-due)
    
    ;; Update released amount
    (map-set vesting-schedules beneficiary
      (merge schedule {
        released-amount: (+ (get released-amount schedule) releasable)
      })
    )
    
    ;; Transfer tokens to beneficiary
    (as-contract (try! (contract-call? .stackads-token transfer releasable tx-sender beneficiary none)))
    
    (ok releasable)
  )
)

(define-public (revoke (beneficiary principal))
  (let
    (
      (schedule (unwrap! (map-get? vesting-schedules beneficiary) err-not-found))
      (releasable (compute-releasable-amount beneficiary))
      (unvested (- (get total-amount schedule) (get-vested-amount beneficiary)))
    )
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (asserts! (get revocable schedule) err-not-revocable)
    (asserts! (not (get revoked schedule)) err-already-revoked)
    
    ;; Release any vested tokens first
    (if (> releasable u0)
      (begin
        (map-set vesting-schedules beneficiary
          (merge schedule {
            released-amount: (+ (get released-amount schedule) releasable)
          })
        )
        (as-contract (try! (contract-call? .stackads-token transfer releasable tx-sender beneficiary none)))
      )
      true
    )
    
    ;; Mark as revoked
    (map-set vesting-schedules beneficiary
      (merge schedule {
        revoked: true,
        revoked-at: block-height
      })
    )
    
    ;; Return unvested tokens to owner
    (if (> unvested u0)
      (as-contract (try! (contract-call? .stackads-token transfer unvested tx-sender contract-owner none)))
      true
    )
    
    (ok unvested)
  )
)

;; Admin functions

(define-public (update-beneficiary (old-beneficiary principal) (new-beneficiary principal))
  (let
    (
      (schedule (unwrap! (map-get? vesting-schedules old-beneficiary) err-not-found))
    )
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (asserts! (not (has-schedule new-beneficiary)) err-already-exists)
    
    ;; Copy schedule to new beneficiary
    (map-set vesting-schedules new-beneficiary schedule)
    (map-set schedule-exists new-beneficiary true)
    
    ;; Remove old beneficiary
    (map-delete vesting-schedules old-beneficiary)
    (map-delete schedule-exists old-beneficiary)
    
    (ok true)
  )
)

;; Helper functions

(define-read-only (get-schedule-info (beneficiary principal))
  (match (map-get? vesting-schedules beneficiary)
    schedule
      (ok {
        total: (get total-amount schedule),
        released: (get released-amount schedule),
        vested: (get-vested-amount beneficiary),
        releasable: (compute-releasable-amount beneficiary),
        start: (get start-block schedule),
        cliff: (get cliff-duration schedule),
        duration: (get vesting-duration schedule),
        revocable: (get revocable schedule),
        revoked: (get revoked schedule)
      })
    err-not-found
  )
)
