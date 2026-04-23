;; Staking Contract
;; Stake SADS tokens to earn rewards

(use-trait ft-trait 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard.sip-010-trait)

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u300))
(define-constant err-insufficient-balance (err u301))
(define-constant err-below-minimum (err u302))
(define-constant err-no-rewards (err u303))
(define-constant err-zero-amount (err u304))
(define-constant err-zero-duration (err u305))
(define-constant err-zero-rate (err u306))

(define-constant min-stake u1000000) ;; 1 SADS minimum

;; Data variables
(define-data-var reward-rate uint u0) ;; reward tokens per block
(define-data-var rewards-duration uint u0) ;; current reward period length in blocks
(define-data-var period-finish uint u0) ;; block height when current period ends
(define-data-var last-update-time uint u0)
(define-data-var reward-per-token-stored uint u0)
(define-data-var total-supply uint u0)

;; Data maps
(define-map user-reward-per-token-paid principal uint)
(define-map rewards principal uint)
(define-map balances principal uint)

;; Read-only functions

(define-read-only (get-balance (account principal))
  (default-to u0 (map-get? balances account))
)

(define-read-only (get-total-supply)
  (var-get total-supply)
)

(define-read-only (get-reward-rate)
  (var-get reward-rate)
)

(define-read-only (get-period-finish)
  (var-get period-finish)
)

(define-read-only (last-time-reward-applicable)
  (if (< block-height (var-get period-finish))
    block-height
    (var-get period-finish)
  )
)

(define-read-only (reward-per-token)
  (let
    (
      (total (var-get total-supply))
    )
    (if (is-eq total u0)
      (var-get reward-per-token-stored)
      (+ (var-get reward-per-token-stored)
         (/ (* (- (last-time-reward-applicable) (var-get last-update-time))
               (* (var-get reward-rate) u1000000))
            total))
    )
  )
)

(define-read-only (earned (account principal))
  (let
    (
      (user-balance (get-balance account))
      (user-paid (default-to u0 (map-get? user-reward-per-token-paid account)))
      (user-rewards (default-to u0 (map-get? rewards account)))
    )
    (+ (/ (* user-balance (- (reward-per-token) user-paid)) u1000000)
       user-rewards)
  )
)

(define-read-only (get-reward-for-duration)
  (* (var-get reward-rate) (var-get rewards-duration))
)

;; Private functions

(define-private (update-reward (account principal))
  (begin
    (var-set reward-per-token-stored (reward-per-token))
    (var-set last-update-time (last-time-reward-applicable))
    (if (not (is-eq account contract-owner))
      (begin
        (map-set rewards account (earned account))
        (map-set user-reward-per-token-paid account (var-get reward-per-token-stored))
        true
      )
      true
    )
  )
)

;; Public functions

(define-public (stake (amount uint))
  (begin
    (asserts! (>= amount min-stake) err-below-minimum)
    (update-reward tx-sender)
    
    ;; Transfer tokens from user to contract
    (try! (contract-call? .stackads-token transfer amount tx-sender (as-contract tx-sender) none))
    
    ;; Update balances
    (var-set total-supply (+ (var-get total-supply) amount))
    (map-set balances tx-sender (+ (get-balance tx-sender) amount))
    
    (ok true)
  )
)

(define-public (withdraw (amount uint))
  (begin
    (asserts! (> amount u0) err-zero-amount)
    (asserts! (>= (get-balance tx-sender) amount) err-insufficient-balance)
    (update-reward tx-sender)
    
    ;; Update balances
    (var-set total-supply (- (var-get total-supply) amount))
    (map-set balances tx-sender (- (get-balance tx-sender) amount))
    
    ;; Transfer tokens from contract to user
    (as-contract (try! (contract-call? .stackads-token transfer amount tx-sender (as-contract tx-sender) none)))
    
    (ok true)
  )
)

(define-public (claim-reward)
  (let
    (
      (reward (earned tx-sender))
    )
    (asserts! (> reward u0) err-no-rewards)
    (update-reward tx-sender)
    
    ;; Reset user rewards
    (map-set rewards tx-sender u0)
    
    ;; Transfer reward tokens
    (as-contract (try! (contract-call? .stackads-token transfer reward tx-sender (as-contract tx-sender) none)))
    
    (ok reward)
  )
)

(define-public (exit)
  (let
    (
      (staked (get-balance tx-sender))
      (reward (earned tx-sender))
    )
    (update-reward tx-sender)
    
    ;; Withdraw staked tokens
    (if (> staked u0)
      (begin
        (var-set total-supply (- (var-get total-supply) staked))
        (map-set balances tx-sender u0)
        (as-contract (try! (contract-call? .stackads-token transfer staked tx-sender (as-contract tx-sender) none)))
      )
      true
    )
    
    ;; Claim rewards
    (if (> reward u0)
      (begin
        (map-set rewards tx-sender u0)
        (as-contract (try! (contract-call? .stackads-token transfer reward tx-sender (as-contract tx-sender) none)))
      )
      true
    )
    
    (ok { staked: staked, reward: reward })
  )
)

;; Owner functions

(define-public (notify-reward-amount (reward uint) (duration uint))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (asserts! (> duration u0) err-zero-duration)
    (asserts! (> reward u0) err-zero-amount)
    (update-reward contract-owner)
    
    (var-set rewards-duration duration)
    
    ;; Calculate new reward rate
    (if (>= block-height (var-get period-finish))
      (var-set reward-rate (/ reward duration))
      (let
        (
          (remaining (- (var-get period-finish) block-height))
          (leftover (* remaining (var-get reward-rate)))
        )
        (var-set reward-rate (/ (+ reward leftover) duration))
      )
    )
    
    (asserts! (> (var-get reward-rate) u0) err-zero-rate)
    
    (var-set last-update-time block-height)
    (var-set period-finish (+ block-height duration))
    
    ;; Transfer reward tokens to contract
    (try! (contract-call? .stackads-token transfer reward tx-sender (as-contract tx-sender) none))
    
    (ok true)
  )
)

(define-public (recover-erc20 (token-contract <ft-trait>) (amount uint))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    ;; Note: In production, add check to prevent recovering staking/reward token
    (as-contract (contract-call? token-contract transfer amount tx-sender contract-owner none))
  )
)
