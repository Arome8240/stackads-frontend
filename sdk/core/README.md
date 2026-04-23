# @stackads/sdk-core

Core SDK for interacting with StackAds smart contracts on Stacks blockchain.

## Installation

```bash
npm install @stackads/sdk-core
# or
yarn add @stackads/sdk-core
# or
pnpm add @stackads/sdk-core
```

## Quick Start

```typescript
import { createStackAdsSDK } from '@stackads/sdk-core';

// Initialize SDK
const sdk = createStackAdsSDK(
  'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM', // Contract address
  'testnet' // or 'mainnet', 'mocknet'
);

// Get token balance
const balance = await sdk.token.getBalance('ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM');
console.log('Balance:', balance);

// Transfer tokens
const result = await sdk.token.transfer(
  100, // amount in SADS
  'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG', // recipient
  'your-private-key'
);
console.log('Transaction ID:', result.txId);
```

## Features

### Token Operations

```typescript
// Get token info
const name = await sdk.token.getName();
const symbol = await sdk.token.getSymbol();
const decimals = await sdk.token.getDecimals();
const totalSupply = await sdk.token.getTotalSupply();

// Get balance
const balance = await sdk.token.getBalance(address);
const formattedBalance = await sdk.token.getFormattedBalance(address);

// Transfer tokens
await sdk.token.transfer(amount, recipient, senderKey, memo);

// Burn tokens
await sdk.token.burn(amount, senderKey);

// Mint tokens (owner only)
await sdk.token.mint(amount, recipient, ownerKey);
```

### Registry Operations

```typescript
// Register as publisher
await sdk.registry.registerPublisher('ipfs://metadata-uri', senderKey);

// Register as advertiser
await sdk.registry.registerAdvertiser('ipfs://metadata-uri', senderKey);

// Get participant info
const participant = await sdk.registry.getParticipant(address);

// Check status
const isPublisher = await sdk.registry.isActivePublisher(address);
const isAdvertiser = await sdk.registry.isActiveAdvertiser(address);

// Get metrics
const ctr = await sdk.registry.getClickThroughRate(publisherAddress);
```

### Staking Operations

```typescript
// Stake tokens
await sdk.staking.stake(100, senderKey);

// Get staking info
const info = await sdk.staking.getStakingInfo(address);
console.log('Staked:', info.balance);
console.log('Earned:', info.earned);

// Calculate APY
const apy = await sdk.staking.calculateAPY();
console.log('Current APY:', apy + '%');

// Claim rewards
await sdk.staking.claimReward(senderKey);

// Withdraw
await sdk.staking.withdraw(50, senderKey);

// Exit (withdraw all + claim)
await sdk.staking.exit(senderKey);
```

### Campaign Operations

```typescript
// Create campaign
await sdk.treasury.createCampaign(
  1000, // budget in SADS
  0.001, // cost per impression
  0.01, // cost per click
  1440, // duration in blocks (~10 days)
  'ipfs://campaign-metadata',
  senderKey
);

// Get campaign details
const campaign = await sdk.treasury.getCampaign(campaignId);

// Get campaign metrics
const metrics = await sdk.treasury.getCampaignMetrics(campaignId);
console.log('CTR:', metrics.ctr + '%');
console.log('Budget used:', metrics.budgetUsed + '%');

// Pause/Resume campaign
await sdk.treasury.pauseCampaign(campaignId, senderKey);
await sdk.treasury.resumeCampaign(campaignId, senderKey);

// Claim earnings (publisher)
await sdk.treasury.claimEarnings(campaignId, publisherKey);
```

## Utilities

```typescript
import {
  formatTokenAmount,
  parseTokenAmount,
  formatBasisPoints,
  shortenAddress,
  calculateCTR,
  calculateROI,
  formatLargeNumber,
} from '@stackads/sdk-core';

// Format amounts
const formatted = formatTokenAmount(1000000n); // "1.000000"
const parsed = parseTokenAmount(1.5); // 1500000n

// Format percentages
const percentage = formatBasisPoints(250); // "2.50%"

// Shorten address
const short = shortenAddress('ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'); // "ST1P...ZGZGM"

// Calculate metrics
const ctr = calculateCTR(10000n, 500n); // 5.0
const roi = calculateROI(1000n, 1500n); // 50.0

// Format large numbers
const formatted = formatLargeNumber(1500000); // "1.50M"
```

## Error Handling

```typescript
import { ContractError, NetworkError, ValidationError } from '@stackads/sdk-core';

try {
  await sdk.token.transfer(amount, recipient, senderKey);
} catch (error) {
  if (error instanceof ContractError) {
    console.error('Contract error:', error.message);
  } else if (error instanceof NetworkError) {
    console.error('Network error:', error.message);
  } else if (error instanceof ValidationError) {
    console.error('Validation error:', error.message);
  }
}
```

## Transaction Handling

```typescript
// Make transaction
const result = await sdk.token.transfer(100, recipient, senderKey);
console.log('Transaction ID:', result.txId);
console.log('Status:', result.status); // 'pending'

// Wait for confirmation
const confirmed = await sdk.token.waitForTransaction(result.txId);
console.log('Status:', confirmed.status); // 'success' or 'failed'
console.log('Block height:', confirmed.blockHeight);
```

## Advanced Usage

### Custom Network Configuration

```typescript
import { StacksTestnet } from '@stacks/network';
import { StackAdsSDK } from '@stackads/sdk-core';

const network = new StacksTestnet();
network.coreApiUrl = 'https://custom-api.example.com';

const sdk = new StackAdsSDK({
  network,
  contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
});
```

### Using Individual Clients

```typescript
import { TokenClient } from '@stackads/sdk-core';
import { StacksTestnet } from '@stacks/network';

const tokenClient = new TokenClient({
  network: new StacksTestnet(),
  contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
});

const balance = await tokenClient.getBalance(address);
```

## TypeScript Support

Full TypeScript support with comprehensive type definitions:

```typescript
import type {
  Participant,
  Campaign,
  StakingInfo,
  TransactionResult,
  ParticipantType,
  CampaignStatus,
} from '@stackads/sdk-core';
```

## License

MIT

## Links

- [Documentation](https://docs.stackads.io)
- [GitHub](https://github.com/stackads/stackads-sdk)
- [Website](https://stackads.io)
