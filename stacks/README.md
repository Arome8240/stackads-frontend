# StackAds on Stacks

Clarity smart contracts for the StackAds decentralized ad network, deployed on Stacks blockchain.

## Contracts

| Contract | Description |
| --- | --- |
| stackads-token | SIP-010 fungible token for StackAds ecosystem |
| ad-registry | Publisher and advertiser registration with staking |
| staking | Stake SADS tokens to earn rewards |
| ad-treasury | Campaign funding and publisher payouts |
| governance | Token-weighted voting for protocol upgrades |
| vesting | Token vesting schedules for team and investors |

## Token Details

| Property | Value |
| --- | --- |
| Name | StackAds Token |
| Symbol | SADS |
| Decimals | 6 |
| Max Supply | 1,000,000,000 SADS |
| Network | Stacks Mainnet / Testnet |

## Setup

```bash
cd stacks
npm install
```

## Commands

```bash
# Check contracts
npm run check

# Test contracts
npm run test

# Deploy to testnet
npm run deploy:testnet

# Deploy to mainnet
npm run deploy:mainnet
```

## Get Testnet STX

1. Go to https://explorer.hiro.so/sandbox/faucet
2. Paste your wallet address
3. Receive test STX

## Architecture

```
stackads-token (SIP-010)
├── Transfer
├── Mint (owner only)
└── Burn

ad-registry
├── Register publisher/advertiser
├── Stake SADS tokens
├── Update reputation
└── Slash bad actors

staking
├── Stake SADS
├── Earn rewards
└── Withdraw

ad-treasury
├── Fund campaigns
├── Record impressions/clicks
└── Payout publishers

governance
├── Create proposals
├── Vote with SADS
└── Execute proposals

vesting
├── Create vesting schedules
├── Claim vested tokens
└── Revoke unvested tokens
```

## Development

Contracts are written in Clarity, Stacks' smart contract language. Clarity is decidable and non-Turing complete, making it more secure and predictable than Solidity.

Key differences from Solidity:
- No loops (use map/fold)
- No recursion
- All state changes are explicit
- Built-in overflow protection
- Post-conditions for security
