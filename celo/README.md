# ER2o Token — StackAds on Celo

ERC20 utility token for the StackAds decentralized ad network, deployed on Celo.

## Token Details

| Property     | Value                    |
| ------------ | ------------------------ |
| Name         | ER2o                     |
| Symbol       | ER2O                     |
| Decimals     | 18                       |
| Max Supply   | 1,000,000,000 ER2O       |
| Initial Mint | 100,000,000 ER2O         |
| Network      | Celo Mainnet / Alfajores |

## Features

- ERC20 standard transfers
- Burnable by token holders
- Owner-controlled minting (capped at max supply)
- EIP-2612 Permit (gasless approvals)

## Setup

```bash
cd celo
npm install
cp .env.example .env
# Fill in PRIVATE_KEY and CELOSCAN_API_KEY in .env
```

## Commands

```bash
# Compile contracts
npm run compile

# Run tests
npm run test

# Deploy to Alfajores testnet
npm run deploy:testnet

# Deploy to Celo mainnet
npm run deploy:mainnet

# Verify on testnet (replace ADDRESS and OWNER)
npx hardhat verify --network celoAlfajores <ADDRESS> "<OWNER_ADDRESS>" "100000000"
```

## Get Testnet CELO

1. Go to https://faucet.celo.org/alfajores
2. Paste your wallet address
3. Receive test CELO

## Contract Architecture

```
ER2o
├── ERC20          (standard token)
├── ERC20Burnable  (burn + burnFrom)
├── ERC20Permit    (EIP-2612 gasless approvals)
└── Ownable        (mint access control)
```
