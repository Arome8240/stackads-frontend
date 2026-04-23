;; Dispute Resolution
;; Handle disputes between advertisers and publishers

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u900))
(define-constant err-not-found (err u901))
(define-constant err-unauthorized (err u902))
(define-constant err-invalid-status (err u903))
(define-constant err-already-resolved (err u904))
(define-constant err-invalid-evidence (err u905))

;; Dispute status
(define-constant status-open u1)
(define-constant status-under-review u2)
(define-constant status-resolved-advertiser u3)
(define-constant status-resolved-publisher u4)
(define-constant status-resolved-split u5)
(define-constant status-dismissed u6)

;; Dispute types
(define-constant type-payment u1)
(define-constant type-fraud u2)
(define-constant type-quality u3)
(define-constant type-contract u4)

;; Data maps
(define-map disputes
  uint ;; dispute-id
  {
    campaign-id: uint,
    complainant: principal,
    respondent: principal,
    dispute-type: uint,
    amount-disputed: uint,
    description: (string-utf8 512),
    status: uint,
    created-at: uint,
    resolved-at: uint,
    resolution: (optional (string-utf8 512)),
    arbitrator: (optional principal)
  }
)

(define-map dispute-evidence
  { dispute-id: uint, evidence-id: uint }
  {
    submitted-by: principal,
    evidence-uri: (string-utf8 256),
    evidence-hash: (buff 32),
    submitted-at: uint,
    description: (string-utf8 256)
  }
)

(define-map dispute-evidence-count uint uint)

(define-map dispute-votes
  { dispute-id: uint, arbitrator: principal }
  {
    vote: uint, ;; 3=advertiser, 4=publisher, 5=split
    reasoning: (string-utf8 256),
    voted-at: uint
  }
)

(define-data-var dispute-nonce uint u0)

;; Arbitrators
(define-map arbitrators principal bool)
(define-map arbitrator-stats
  principal
  {
    cases-handled: uint,
    cases-resolved: uint,
    reputation: uint
  }
)

;; Read-only functions

(define-read-only (get-dispute (dispute-id uint))
  (map-get? disputes dispute-id)
)

(define-read-only (get-evidence (dispute-id uint) (evidence-id uint))
  (map-get? dispute-evidence { dispute-id: dispute-id, evidence-id: evidence-id })
)

(define-read-only (get-evidence-count (dispute-id uint))
  (default-to u0 (map-get? dispute-evidence-count dispute-id))
)

(define-read-only (get-arbitrator-vote (dispute-id uint) (arbitrator principal))
  (map-get? dispute-votes { dispute-id: dispute-id, arbitrator: arbitrator })
)

(define-read-only (is-arbitrator (who principal))
  (default-to false (map-get? arbitrators who))
)

(define-read-only (get-arbitrator-stats (arbitrator principal))
  (map-get? arbitrator-stats arbitrator)
)

;; Public functions

(define-public (create-dispute
    (campaign-id uint)
    (respondent principal)
    (dispute-type uint)
    (amount-disputed uint)
    (description (string-utf8 512))
  )
  (let
    (
      (dispute-id (+ (var-get dispute-nonce) u1))
      (campaign (unwrap! (contract-call? .ad-treasury get-campaign campaign-id) err-not-found))
    )
    ;; Verify complainant is either advertiser or publisher
    (asserts! (or
      (is-eq tx-sender (get advertiser campaign))
      (contract-call? .ad-registry is-active-publisher tx-sender))
      err-unauthorized)
    
    (asserts! (<= dispute-type u4) err-invalid-status)
    
    (map-set disputes dispute-id {
      campaign-id: campaign-id,
      complainant: tx-sender,
      respondent: respondent,
      dispute-type: dispute-type,
      amount-disputed: amount-disputed,
      description: description,
      status: status-open,
      created-at: block-height,
      resolved-at: u0,
      resolution: none,
      arbitrator: none
    })
    
    (var-set dispute-nonce dispute-id)
    
    (ok dispute-id)
  )
)

(define-public (submit-evidence
    (dispute-id uint)
    (evidence-uri (string-utf8 256))
    (evidence-hash (buff 32))
    (description (string-utf8 256))
  )
  (let
    (
      (dispute (unwrap! (get-dispute dispute-id) err-not-found))
      (evidence-count (get-evidence-count dispute-id))
      (new-evidence-id (+ evidence-count u1))
    )
    ;; Only parties involved can submit evidence
    (asserts! (or
      (is-eq tx-sender (get complainant dispute))
      (is-eq tx-sender (get respondent dispute)))
      err-unauthorized)
    
    (asserts! (< (get status dispute) status-resolved-advertiser) err-already-resolved)
    
    (map-set dispute-evidence
      { dispute-id: dispute-id, evidence-id: new-evidence-id }
      {
        submitted-by: tx-sender,
        evidence-uri: evidence-uri,
        evidence-hash: evidence-hash,
        submitted-at: block-height,
        description: description
      }
    )
    
    (map-set dispute-evidence-count dispute-id new-evidence-id)
    
    (ok new-evidence-id)
  )
)

(define-public (assign-arbitrator (dispute-id uint) (arbitrator principal))
  (let
    (
      (dispute (unwrap! (get-dispute dispute-id) err-not-found))
    )
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (asserts! (is-arbitrator arbitrator) err-unauthorized)
    (asserts! (is-eq (get status dispute) status-open) err-invalid-status)
    
    ;; Update arbitrator stats
    (match (get-arbitrator-stats arbitrator)
      stats (map-set arbitrator-stats arbitrator
        (merge stats { cases-handled: (+ (get cases-handled stats) u1) }))
      (map-set arbitrator-stats arbitrator {
        cases-handled: u1,
        cases-resolved: u0,
        reputation: u500
      })
    )
    
    (ok (map-set disputes dispute-id
      (merge dispute {
        status: status-under-review,
        arbitrator: (some arbitrator)
      })
    ))
  )
)

(define-public (vote-on-dispute
    (dispute-id uint)
    (vote uint)
    (reasoning (string-utf8 256))
  )
  (let
    (
      (dispute (unwrap! (get-dispute dispute-id) err-not-found))
    )
    (asserts! (is-arbitrator tx-sender) err-unauthorized)
    (asserts! (is-eq (get status dispute) status-under-review) err-invalid-status)
    (asserts! (and (>= vote u3) (<= vote u5)) err-invalid-status)
    
    (ok (map-set dispute-votes
      { dispute-id: dispute-id, arbitrator: tx-sender }
      {
        vote: vote,
        reasoning: reasoning,
        voted-at: block-height
      }
    ))
  )
)

(define-public (resolve-dispute
    (dispute-id uint)
    (resolution-status uint)
    (resolution-text (string-utf8 512))
  )
  (let
    (
      (dispute (unwrap! (get-dispute dispute-id) err-not-found))
      (amount (get amount-disputed dispute))
    )
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (asserts! (is-eq (get status dispute) status-under-review) err-invalid-status)
    (asserts! (and (>= resolution-status u3) (<= resolution-status u6)) err-invalid-status)
    
    ;; Update dispute
    (map-set disputes dispute-id
      (merge dispute {
        status: resolution-status,
        resolved-at: block-height,
        resolution: (some resolution-text)
      })
    )
    
    ;; Update arbitrator stats
    (match (get arbitrator dispute)
      arb (match (get-arbitrator-stats arb)
        stats (map-set arbitrator-stats arb
          (merge stats { cases-resolved: (+ (get cases-resolved stats) u1) }))
        true)
      true
    )
    
    ;; Handle refunds based on resolution
    (if (is-eq resolution-status status-resolved-advertiser)
      ;; Refund to advertiser
      (try! (contract-call? .ad-treasury withdraw-platform-fees amount))
      (if (is-eq resolution-status status-resolved-publisher)
        ;; Pay to publisher
        true ;; Payment already processed
        (if (is-eq resolution-status status-resolved-split)
          ;; Split 50/50
          true ;; Would implement split logic
          true
        )
      )
    )
    
    (ok true)
  )
)

(define-public (appeal-resolution (dispute-id uint) (appeal-reason (string-utf8 512)))
  (let
    (
      (dispute (unwrap! (get-dispute dispute-id) err-not-found))
    )
    (asserts! (or
      (is-eq tx-sender (get complainant dispute))
      (is-eq tx-sender (get respondent dispute)))
      err-unauthorized)
    
    (asserts! (>= (get status dispute) status-resolved-advertiser) err-invalid-status)
    
    ;; Reset to under review for appeal
    (ok (map-set disputes dispute-id
      (merge dispute { status: status-under-review })
    ))
  )
)

;; Admin functions

(define-public (add-arbitrator (arbitrator principal))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (map-set arbitrators arbitrator true)
    (ok true)
  )
)

(define-public (remove-arbitrator (arbitrator principal))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (map-delete arbitrators arbitrator)
    (ok true)
  )
)

(define-public (update-arbitrator-reputation (arbitrator principal) (new-reputation uint))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (asserts! (<= new-reputation u1000) err-invalid-evidence)
    
    (match (get-arbitrator-stats arbitrator)
      stats (ok (map-set arbitrator-stats arbitrator
        (merge stats { reputation: new-reputation })))
      err-not-found
    )
  )
)

;; Helper functions

(define-read-only (get-dispute-summary (dispute-id uint))
  (match (get-dispute dispute-id)
    dispute
      (ok {
        type: (get dispute-type dispute),
        amount: (get amount-disputed dispute),
        status: (get status dispute),
        evidence-count: (get-evidence-count dispute-id),
        age: (- block-height (get created-at dispute))
      })
    err-not-found
  )
)
