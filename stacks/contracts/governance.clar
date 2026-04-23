;; Governance Contract
;; Token-weighted voting for protocol upgrades

(use-trait ft-trait 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard.sip-010-trait)

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u500))
(define-constant err-not-found (err u501))
(define-constant err-already-voted (err u502))
(define-constant err-voting-closed (err u503))
(define-constant err-voting-active (err u504))
(define-constant err-insufficient-votes (err u505))
(define-constant err-already-executed (err u506))
(define-constant err-execution-failed (err u507))
(define-constant err-invalid-params (err u508))

;; Proposal states
(define-constant state-pending u1)
(define-constant state-active u2)
(define-constant state-defeated u3)
(define-constant state-succeeded u4)
(define-constant state-executed u5)
(define-constant state-cancelled u6)

;; Governance parameters
(define-data-var voting-period uint u1440) ;; ~10 days in blocks (10 min blocks)
(define-data-var voting-delay uint u144) ;; ~1 day delay before voting starts
(define-data-var proposal-threshold uint u1000000000) ;; 1000 SADS to create proposal
(define-data-var quorum-votes uint u10000000000) ;; 10,000 SADS quorum
(define-data-var proposal-nonce uint u0)

;; Data maps
(define-map proposals
  uint ;; proposal-id
  {
    proposer: principal,
    description: (string-utf8 256),
    for-votes: uint,
    against-votes: uint,
    abstain-votes: uint,
    start-block: uint,
    end-block: uint,
    state: uint,
    executed: bool,
    metadata-uri: (string-utf8 256)
  }
)

(define-map votes
  { proposal-id: uint, voter: principal }
  {
    support: uint, ;; 0=against, 1=for, 2=abstain
    votes: uint,
    voted: bool
  }
)

(define-map voter-snapshots
  { proposal-id: uint, voter: principal }
  uint ;; voting power at proposal creation
)

;; Read-only functions

(define-read-only (get-proposal (proposal-id uint))
  (map-get? proposals proposal-id)
)

(define-read-only (get-vote (proposal-id uint) (voter principal))
  (map-get? votes { proposal-id: proposal-id, voter: voter })
)

(define-read-only (get-voting-power (voter principal))
  (unwrap-panic (contract-call? .stackads-token get-balance voter))
)

(define-read-only (get-voting-period)
  (var-get voting-period)
)

(define-read-only (get-voting-delay)
  (var-get voting-delay)
)

(define-read-only (get-proposal-threshold)
  (var-get proposal-threshold)
)

(define-read-only (get-quorum-votes)
  (var-get quorum-votes)
)

(define-read-only (get-proposal-state (proposal-id uint))
  (match (map-get? proposals proposal-id)
    proposal
      (let
        (
          (current-block block-height)
          (start (get start-block proposal))
          (end (get end-block proposal))
        )
        (if (get executed proposal)
          state-executed
          (if (< current-block start)
            state-pending
            (if (>= current-block end)
              (if (and
                    (>= (get for-votes proposal) (var-get quorum-votes))
                    (> (get for-votes proposal) (get against-votes proposal)))
                state-succeeded
                state-defeated)
              state-active)
          )
        )
      )
    u0
  )
)

(define-read-only (has-voted (proposal-id uint) (voter principal))
  (match (map-get? votes { proposal-id: proposal-id, voter: voter })
    vote (get voted vote)
    false
  )
)

;; Public functions

(define-public (propose (description (string-utf8 256)) (metadata-uri (string-utf8 256)))
  (let
    (
      (proposal-id (+ (var-get proposal-nonce) u1))
      (proposer-balance (get-voting-power tx-sender))
      (start-block (+ block-height (var-get voting-delay)))
      (end-block (+ start-block (var-get voting-period)))
    )
    (asserts! (>= proposer-balance (var-get proposal-threshold)) err-insufficient-votes)
    
    ;; Create proposal
    (map-set proposals proposal-id {
      proposer: tx-sender,
      description: description,
      for-votes: u0,
      against-votes: u0,
      abstain-votes: u0,
      start-block: start-block,
      end-block: end-block,
      state: state-pending,
      executed: false,
      metadata-uri: metadata-uri
    })
    
    (var-set proposal-nonce proposal-id)
    
    (ok proposal-id)
  )
)

(define-public (cast-vote (proposal-id uint) (support uint))
  (let
    (
      (proposal (unwrap! (map-get? proposals proposal-id) err-not-found))
      (voter-power (get-voting-power tx-sender))
      (current-state (get-proposal-state proposal-id))
    )
    (asserts! (is-eq current-state state-active) err-voting-closed)
    (asserts! (not (has-voted proposal-id tx-sender)) err-already-voted)
    (asserts! (<= support u2) err-invalid-params)
    (asserts! (> voter-power u0) err-insufficient-votes)
    
    ;; Record vote
    (map-set votes
      { proposal-id: proposal-id, voter: tx-sender }
      {
        support: support,
        votes: voter-power,
        voted: true
      }
    )
    
    ;; Update proposal vote counts
    (map-set proposals proposal-id
      (if (is-eq support u1)
        (merge proposal { for-votes: (+ (get for-votes proposal) voter-power) })
        (if (is-eq support u0)
          (merge proposal { against-votes: (+ (get against-votes proposal) voter-power) })
          (merge proposal { abstain-votes: (+ (get abstain-votes proposal) voter-power) })
        )
      )
    )
    
    (ok true)
  )
)

(define-public (execute-proposal (proposal-id uint))
  (let
    (
      (proposal (unwrap! (map-get? proposals proposal-id) err-not-found))
      (current-state (get-proposal-state proposal-id))
    )
    (asserts! (is-eq current-state state-succeeded) err-execution-failed)
    (asserts! (not (get executed proposal)) err-already-executed)
    
    ;; Mark as executed
    (map-set proposals proposal-id (merge proposal { executed: true }))
    
    ;; Note: Actual execution logic would be implemented based on proposal type
    ;; This could involve calling other contracts or updating parameters
    
    (ok true)
  )
)

(define-public (cancel-proposal (proposal-id uint))
  (let
    (
      (proposal (unwrap! (map-get? proposals proposal-id) err-not-found))
    )
    (asserts! (is-eq (get proposer proposal) tx-sender) err-owner-only)
    (asserts! (< (get-proposal-state proposal-id) state-defeated) err-voting-closed)
    
    (ok (map-set proposals proposal-id (merge proposal { state: state-cancelled })))
  )
)

;; Admin functions

(define-public (set-voting-period (new-period uint))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (asserts! (> new-period u0) err-invalid-params)
    (ok (var-set voting-period new-period))
  )
)

(define-public (set-voting-delay (new-delay uint))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (ok (var-set voting-delay new-delay))
  )
)

(define-public (set-proposal-threshold (new-threshold uint))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (asserts! (> new-threshold u0) err-invalid-params)
    (ok (var-set proposal-threshold new-threshold))
  )
)

(define-public (set-quorum-votes (new-quorum uint))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (asserts! (> new-quorum u0) err-invalid-params)
    (ok (var-set quorum-votes new-quorum))
  )
)

;; Helper functions

(define-read-only (get-proposal-votes (proposal-id uint))
  (match (map-get? proposals proposal-id)
    proposal
      (ok {
        for: (get for-votes proposal),
        against: (get against-votes proposal),
        abstain: (get abstain-votes proposal)
      })
    err-not-found
  )
)

(define-read-only (get-voter-receipt (proposal-id uint) (voter principal))
  (map-get? votes { proposal-id: proposal-id, voter: voter })
)
