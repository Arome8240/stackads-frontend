;; Referral System
;; Incentivize user acquisition through referrals

(use-trait ft-trait 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard.sip-010-trait)

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u1000))
(define-constant err-not-found (err u1001))
(define-constant err-already-referred (err u1002))
(define-constant err-self-referral (err u1003))
(define-constant err-invalid-code (err u1004))
(define-constant err-code-exists (err u1005))
(define-constant err-insufficient-activity (err u1006))

;; Referral tiers
(define-constant tier-bronze u1)
(define-constant tier-silver u2)
(define-constant tier-gold u3)
(define-constant tier-platinum u4)

;; Data maps
(define-map referral-codes
  (string-ascii 20) ;; referral code
  {
    owner: principal,
    created-at: uint,
    active: bool,
    tier: uint
  }
)

(define-map user-referrals
  principal ;; user
  {
    referrer: (optional principal),
    referral-code: (string-ascii 20),
    referred-at: uint,
    total-referrals: uint,
    active-referrals: uint,
    total-earned: uint,
    tier: uint
  }
)

(define-map referral-rewards
  { referrer: principal, referee: principal }
  {
    referrer-reward: uint,
    referee-reward: uint,
    claimed-by-referrer: bool,
    claimed-by-referee: bool,
    created-at: uint
  }
)

;; Tier requirements and rewards
(define-map tier-config
  uint ;; tier
  {
    min-referrals: uint,
    referrer-bonus-bps: uint, ;; basis points (100 = 1%)
    referee-bonus-bps: uint
  }
)

(define-data-var referral-bonus uint u5000000) ;; 5 SADS default bonus
(define-data-var min-activity-threshold uint u10000000) ;; 10 SADS spent to qualify

;; Initialize tier configurations
(map-set tier-config tier-bronze { min-referrals: u0, referrer-bonus-bps: u500, referee-bonus-bps: u250 })
(map-set tier-config tier-silver { min-referrals: u10, referrer-bonus-bps: u750, referee-bonus-bps: u375 })
(map-set tier-config tier-gold { min-referrals: u50, referrer-bonus-bps: u1000, referee-bonus-bps: u500 })
(map-set tier-config tier-platinum { min-referrals: u100, referrer-bonus-bps: u1500, referee-bonus-bps: u750 })

;; Read-only functions

(define-read-only (get-referral-code-info (code (string-ascii 20)))
  (map-get? referral-codes code)
)

(define-read-only (get-user-referral-info (user principal))
  (map-get? user-referrals user)
)

(define-read-only (get-referral-reward (referrer principal) (referee principal))
  (map-get? referral-rewards { referrer: referrer, referee: referee })
)

(define-read-only (get-tier-config (tier uint))
  (map-get? tier-config tier)
)

(define-read-only (calculate-tier (total-referrals uint))
  (if (>= total-referrals u100)
    tier-platinum
    (if (>= total-referrals u50)
      tier-gold
      (if (>= total-referrals u10)
        tier-silver
        tier-bronze
      )
    )
  )
)

(define-read-only (calculate-referral-rewards (referrer-tier uint) (activity-amount uint))
  (match (get-tier-config referrer-tier)
    config
      (ok {
        referrer-reward: (+ (var-get referral-bonus) 
          (/ (* activity-amount (get referrer-bonus-bps config)) u10000)),
        referee-reward: (+ (var-get referral-bonus)
          (/ (* activity-amount (get referee-bonus-bps config)) u10000))
      })
    (err u0)
  )
)

;; Public functions

(define-public (create-referral-code (code (string-ascii 20)))
  (begin
    (asserts! (is-none (get-referral-code-info code)) err-code-exists)
    (asserts! (> (len code) u3) err-invalid-code)
    
    (map-set referral-codes code {
      owner: tx-sender,
      created-at: block-height,
      active: true,
      tier: tier-bronze
    })
    
    ;; Initialize user referral info if not exists
    (if (is-none (get-user-referral-info tx-sender))
      (map-set user-referrals tx-sender {
        referrer: none,
        referral-code: code,
        referred-at: u0,
        total-referrals: u0,
        active-referrals: u0,
        total-earned: u0,
        tier: tier-bronze
      })
      true
    )
    
    (ok true)
  )
)

(define-public (use-referral-code (code (string-ascii 20)))
  (let
    (
      (code-info (unwrap! (get-referral-code-info code) err-not-found))
      (referrer (get owner code-info))
    )
    (asserts! (not (is-eq tx-sender referrer)) err-self-referral)
    (asserts! (is-none (get-user-referral-info tx-sender)) err-already-referred)
    (asserts! (get active code-info) err-invalid-code)
    
    ;; Create referral relationship
    (map-set user-referrals tx-sender {
      referrer: (some referrer),
      referral-code: code,
      referred-at: block-height,
      total-referrals: u0,
      active-referrals: u0,
      total-earned: u0,
      tier: tier-bronze
    })
    
    ;; Update referrer stats
    (match (get-user-referral-info referrer)
      referrer-info
        (let
          (
            (new-total (+ (get total-referrals referrer-info) u1))
            (new-tier (calculate-tier new-total))
          )
          (map-set user-referrals referrer
            (merge referrer-info {
              total-referrals: new-total,
              active-referrals: (+ (get active-referrals referrer-info) u1),
              tier: new-tier
            })
          )
          ;; Update code tier
          (map-set referral-codes code
            (merge code-info { tier: new-tier }))
        )
      true
    )
    
    (ok true)
  )
)

(define-public (record-referral-activity (user principal) (activity-amount uint))
  (let
    (
      (user-info (unwrap! (get-user-referral-info user) err-not-found))
    )
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (asserts! (>= activity-amount (var-get min-activity-threshold)) err-insufficient-activity)
    
    ;; Process referral rewards if user was referred
    (match (get referrer user-info)
      referrer
        (let
          (
            (referrer-info (unwrap! (get-user-referral-info referrer) err-not-found))
            (rewards (unwrap! (calculate-referral-rewards (get tier referrer-info) activity-amount) err-not-found))
          )
          ;; Create reward record
          (map-set referral-rewards
            { referrer: referrer, referee: user }
            {
              referrer-reward: (get referrer-reward rewards),
              referee-reward: (get referee-reward rewards),
              claimed-by-referrer: false,
              claimed-by-referee: false,
              created-at: block-height
            }
          )
          (ok true)
        )
      (ok false) ;; No referrer, no rewards
    )
  )
)

(define-public (claim-referral-rewards (referee principal))
  (let
    (
      (reward-info (unwrap! (get-referral-reward tx-sender referee) err-not-found))
      (amount (get referrer-reward reward-info))
    )
    (asserts! (not (get claimed-by-referrer reward-info)) err-already-referred)
    (asserts! (> amount u0) err-insufficient-activity)
    
    ;; Mark as claimed
    (map-set referral-rewards
      { referrer: tx-sender, referee: referee }
      (merge reward-info { claimed-by-referrer: true })
    )
    
    ;; Update total earned
    (match (get-user-referral-info tx-sender)
      user-info
        (map-set user-referrals tx-sender
          (merge user-info { total-earned: (+ (get total-earned user-info) amount) }))
      true
    )
    
    ;; Transfer rewards
    (as-contract (try! (contract-call? .stackads-token transfer amount tx-sender (as-contract tx-sender) none)))
    
    (ok amount)
  )
)

(define-public (claim-referee-bonus (referrer principal))
  (let
    (
      (reward-info (unwrap! (get-referral-reward referrer tx-sender) err-not-found))
      (amount (get referee-reward reward-info))
    )
    (asserts! (not (get claimed-by-referee reward-info)) err-already-referred)
    (asserts! (> amount u0) err-insufficient-activity)
    
    ;; Mark as claimed
    (map-set referral-rewards
      { referrer: referrer, referee: tx-sender }
      (merge reward-info { claimed-by-referee: true })
    )
    
    ;; Transfer rewards
    (as-contract (try! (contract-call? .stackads-token transfer amount tx-sender (as-contract tx-sender) none)))
    
    (ok amount)
  )
)

;; Admin functions

(define-public (set-referral-bonus (new-bonus uint))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (ok (var-set referral-bonus new-bonus))
  )
)

(define-public (set-activity-threshold (new-threshold uint))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (ok (var-set min-activity-threshold new-threshold))
  )
)

(define-public (update-tier-config
    (tier uint)
    (min-referrals uint)
    (referrer-bonus-bps uint)
    (referee-bonus-bps uint)
  )
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (ok (map-set tier-config tier {
      min-referrals: min-referrals,
      referrer-bonus-bps: referrer-bonus-bps,
      referee-bonus-bps: referee-bonus-bps
    }))
  )
)

(define-public (deactivate-referral-code (code (string-ascii 20)))
  (let
    (
      (code-info (unwrap! (get-referral-code-info code) err-not-found))
    )
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (ok (map-set referral-codes code
      (merge code-info { active: false })
    ))
  )
)

;; Helper functions

(define-read-only (get-referral-stats (user principal))
  (match (get-user-referral-info user)
    info
      (ok {
        total-referrals: (get total-referrals info),
        active-referrals: (get active-referrals info),
        total-earned: (get total-earned info),
        tier: (get tier info),
        tier-name: (if (is-eq (get tier info) tier-platinum)
          "Platinum"
          (if (is-eq (get tier info) tier-gold)
            "Gold"
            (if (is-eq (get tier info) tier-silver)
              "Silver"
              "Bronze"
            )
          )
        )
      })
    err-not-found
  )
)
