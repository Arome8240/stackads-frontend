;; StackAds Token (SADS)
;; SIP-010 Fungible Token for StackAds ecosystem

(impl-trait 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard.sip-010-trait)

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-token-owner (err u101))
(define-constant err-insufficient-balance (err u102))
(define-constant err-max-supply-exceeded (err u103))

;; Token configuration
(define-constant token-name "StackAds Token")
(define-constant token-symbol "SADS")
(define-constant token-decimals u6)
(define-constant max-supply u1000000000000000) ;; 1 billion with 6 decimals

;; Data variables
(define-fungible-token stackads-token max-supply)
(define-data-var token-uri (optional (string-utf8 256)) none)

;; SIP-010 Functions

(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
  (begin
    (asserts! (is-eq tx-sender sender) err-not-token-owner)
    (try! (ft-transfer? stackads-token amount sender recipient))
    (match memo to-print (print to-print) 0x)
    (ok true)
  )
)

(define-read-only (get-name)
  (ok token-name)
)

(define-read-only (get-symbol)
  (ok token-symbol)
)

(define-read-only (get-decimals)
  (ok token-decimals)
)

(define-read-only (get-balance (who principal))
  (ok (ft-get-balance stackads-token who))
)

(define-read-only (get-total-supply)
  (ok (ft-get-supply stackads-token))
)

(define-read-only (get-token-uri)
  (ok (var-get token-uri))
)

;; Custom functions

(define-public (mint (amount uint) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (asserts! (<= (+ (ft-get-supply stackads-token) amount) max-supply) err-max-supply-exceeded)
    (ft-mint? stackads-token amount recipient)
  )
)

(define-public (burn (amount uint))
  (begin
    (asserts! (>= (ft-get-balance stackads-token tx-sender) amount) err-insufficient-balance)
    (ft-burn? stackads-token amount tx-sender)
  )
)

(define-public (set-token-uri (new-uri (string-utf8 256)))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (ok (var-set token-uri (some new-uri)))
  )
)

;; Initialize with initial supply
(begin
  (try! (ft-mint? stackads-token u100000000000000 contract-owner)) ;; 100M initial supply
)
