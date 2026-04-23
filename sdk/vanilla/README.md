# @stackads/vanilla

Vanilla JavaScript SDK for the StackAds decentralized advertising platform on Stacks blockchain. Works in any JavaScript environment - no framework required.

## Installation

### NPM/Yarn/PNPM

```bash
npm install @stackads/vanilla @stacks/connect @stacks/transactions
# or
pnpm add @stackads/vanilla @stacks/connect @stacks/transactions
# or
yarn add @stackads/vanilla @stacks/connect @stacks/transactions
```

### CDN (Browser)

```html
<!-- Via unpkg -->
<script src="https://unpkg.com/@stackads/vanilla@latest/dist/index.global.js"></script>

<!-- Via jsDelivr -->
<script src="https://cdn.jsdelivr.net/npm/@stackads/vanilla@latest/dist/index.global.js"></script>
```

## Quick Start

### ES Modules

```javascript
import StackAds from '@stackads/vanilla';

const stackads = new StackAds({
  network: 'testnet', // or 'mainnet'
  contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  contractName: 'stackads-token',
});

// Get token balance
const balance = await stackads.getBalance('ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM');
console.log('Balance:', stackads.formatAmount(balance), 'SADS');
```

### CommonJS

```javascript
const StackAds = require('@stackads/vanilla');

const stackads = new StackAds.default({
  network: 'testnet',
  contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  contractName: 'stackads-token',
});
```

### Browser (CDN)

```html
<!DOCTYPE html>
<html>
<head>
  <title>StackAds Example</title>
</head>
<body>
  <div id="balance"></div>
  <button id="transfer-btn">Transfer Tokens</button>

  <script src="https://unpkg.com/@stackads/vanilla@latest/dist/index.global.js"></script>
  <script>
    const stackads = new StackAds.default({
      network: 'testnet',
      contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      contractName: 'stackads-token',
    });

    // Load balance
    async function loadBalance() {
      const address = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
      const balance = await stackads.getBalance(address);
      document.getElementById('balance').textContent = 
        `Balance: ${stackads.formatAmount(balance)} SADS`;
    }

    // Transfer tokens
    document.getElementById('transfer-btn').addEventListener('click', async () => {
      try {
        const txId = await stackads.transfer(
          'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG',
          1000000n, // 1 SADS
          'Payment'
        );
        alert('Transfer successful! TX: ' + txId);
      } catch (error) {
        alert('Transfer failed: ' + error.message);
      }
    });

    loadBalance();
  </script>
</body>
</html>
```

## API Reference

### Constructor

```javascript
const stackads = new StackAds(config);
```

**Config Options:**
- `network`: `'testnet'` or `'mainnet'`
- `contractAddress`: Contract address on Stacks blockchain
- `contractName`: Name of the contract

### Token Operations

#### getBalance(address)

Get token balance for an address.

```javascript
const balance = await stackads.getBalance('ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM');
console.log('Balance:', balance); // bigint
```

#### transfer(to, amount, memo?)

Transfer tokens to another address.

```javascript
const txId = await stackads.transfer(
  'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG',
  1000000n, // 1 SADS (6 decimals)
  'Payment for services' // optional memo
);
console.log('Transaction ID:', txId);
```

#### formatAmount(amount)

Format bigint amount to human-readable string.

```javascript
const formatted = stackads.formatAmount(1000000n);
console.log(formatted); // "1.000000"
```

#### parseAmount(amount)

Parse string amount to bigint.

```javascript
const amount = stackads.parseAmount('1.5');
console.log(amount); // 1500000n
```

### Registry Operations

#### registerPublisher(name, website, stakeAmount)

Register as a publisher.

```javascript
const txId = await stackads.registerPublisher(
  'My Website',
  'https://example.com',
  10000000n // 10 SADS stake
);
```

#### registerAdvertiser(name, company, stakeAmount)

Register as an advertiser.

```javascript
const txId = await stackads.registerAdvertiser(
  'John Doe',
  'Acme Corp',
  10000000n // 10 SADS stake
);
```

### Staking Operations

#### stake(amount)

Stake tokens.

```javascript
const txId = await stackads.stake(5000000n); // Stake 5 SADS
```

#### unstake(amount)

Unstake tokens.

```javascript
const txId = await stackads.unstake(2000000n); // Unstake 2 SADS
```

### Campaign Operations

#### createCampaign(name, budget, costPerClick, duration)

Create an advertising campaign.

```javascript
const txId = await stackads.createCampaign(
  'Summer Sale 2024',
  50000000n, // 50 SADS budget
  100000n,   // 0.1 SADS per click
  30         // 30 days duration
);
```

## Advanced Usage

### Direct Client Access

For advanced operations, access the underlying clients directly:

```javascript
// Token operations
const tokenInfo = await stackads.token.getTokenInfo();
console.log('Token:', tokenInfo.name, tokenInfo.symbol);

// Registry operations
const publisherInfo = await stackads.registry.getPublisher(address);
console.log('Publisher:', publisherInfo.name);

// Staking operations
const stakeInfo = await stackads.staking.getStakeInfo(address);
console.log('Staked:', stakeInfo.amount);

// Campaign operations
const campaignInfo = await stackads.treasury.getCampaign(1);
console.log('Campaign:', campaignInfo.name);
```

## Complete Examples

### Publisher Dashboard

```html
<!DOCTYPE html>
<html>
<head>
  <title>Publisher Dashboard</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }
    .card {
      background: white;
      border-radius: 8px;
      padding: 1.5rem;
      margin-bottom: 1rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .balance {
      font-size: 2rem;
      font-weight: bold;
      color: #4f46e5;
    }
    button {
      background: #4f46e5;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 6px;
      cursor: pointer;
      font-size: 1rem;
    }
    button:hover {
      background: #4338ca;
    }
    .loading {
      color: #6b7280;
    }
  </style>
</head>
<body>
  <h1>Publisher Dashboard</h1>

  <div class="card">
    <h2>Token Balance</h2>
    <div id="balance" class="loading">Loading...</div>
  </div>

  <div class="card">
    <h2>Publisher Status</h2>
    <div id="publisher-info" class="loading">Loading...</div>
    <button id="register-btn" style="display: none;">Register as Publisher</button>
  </div>

  <div class="card">
    <h2>Staking</h2>
    <div id="staking-info" class="loading">Loading...</div>
    <button id="stake-btn">Stake 5 SADS</button>
  </div>

  <script src="https://unpkg.com/@stackads/vanilla@latest/dist/index.global.js"></script>
  <script>
    const stackads = new StackAds.default({
      network: 'testnet',
      contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      contractName: 'stackads-token',
    });

    const userAddress = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';

    // Load balance
    async function loadBalance() {
      try {
        const balance = await stackads.getBalance(userAddress);
        document.getElementById('balance').innerHTML = 
          `<p class="balance">${stackads.formatAmount(balance)} SADS</p>`;
      } catch (error) {
        document.getElementById('balance').textContent = 'Error: ' + error.message;
      }
    }

    // Load publisher info
    async function loadPublisher() {
      try {
        const info = await stackads.registry.getPublisher(userAddress);
        document.getElementById('publisher-info').innerHTML = `
          <p><strong>Name:</strong> ${info.name}</p>
          <p><strong>Website:</strong> ${info.website}</p>
          <p><strong>Reputation:</strong> ${info.reputation}</p>
          <p><strong>Impressions:</strong> ${info.totalImpressions}</p>
          <p><strong>Clicks:</strong> ${info.totalClicks}</p>
        `;
      } catch (error) {
        document.getElementById('publisher-info').textContent = 'Not registered';
        document.getElementById('register-btn').style.display = 'block';
      }
    }

    // Load staking info
    async function loadStaking() {
      try {
        const info = await stackads.staking.getStakeInfo(userAddress);
        document.getElementById('staking-info').innerHTML = `
          <p><strong>Staked:</strong> ${stackads.formatAmount(info.amount)} SADS</p>
          <p><strong>Rewards:</strong> ${stackads.formatAmount(info.rewards)} SADS</p>
        `;
      } catch (error) {
        document.getElementById('staking-info').textContent = 'No stake found';
      }
    }

    // Register publisher
    document.getElementById('register-btn').addEventListener('click', async () => {
      try {
        const txId = await stackads.registerPublisher(
          'My Website',
          'https://example.com',
          10000000n
        );
        alert('Registered! TX: ' + txId);
        await loadPublisher();
      } catch (error) {
        alert('Registration failed: ' + error.message);
      }
    });

    // Stake tokens
    document.getElementById('stake-btn').addEventListener('click', async () => {
      try {
        const txId = await stackads.stake(5000000n);
        alert('Staked! TX: ' + txId);
        await loadStaking();
      } catch (error) {
        alert('Staking failed: ' + error.message);
      }
    });

    // Load all data
    Promise.all([
      loadBalance(),
      loadPublisher(),
      loadStaking(),
    ]);
  </script>
</body>
</html>
```

### Advertiser Campaign Manager

```javascript
import StackAds from '@stackads/vanilla';

const stackads = new StackAds({
  network: 'testnet',
  contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  contractName: 'stackads-token',
});

class CampaignManager {
  async createCampaign(name, budget, cpc, duration) {
    const budgetAmount = stackads.parseAmount(budget);
    const cpcAmount = stackads.parseAmount(cpc);
    
    const txId = await stackads.createCampaign(
      name,
      budgetAmount,
      cpcAmount,
      duration
    );
    
    return txId;
  }

  async getCampaign(id) {
    const campaign = await stackads.treasury.getCampaign(id);
    return {
      ...campaign,
      formattedBudget: stackads.formatAmount(campaign.budget),
      formattedSpent: stackads.formatAmount(campaign.spent),
    };
  }

  async pauseCampaign(id) {
    return await stackads.treasury.pauseCampaign(id);
  }

  async resumeCampaign(id) {
    return await stackads.treasury.resumeCampaign(id);
  }
}

// Usage
const manager = new CampaignManager();

// Create campaign
const txId = await manager.createCampaign(
  'Summer Sale',
  '50', // 50 SADS
  '0.1', // 0.1 SADS per click
  30 // 30 days
);

// Get campaign details
const campaign = await manager.getCampaign(1);
console.log('Campaign:', campaign);
```

## TypeScript Support

Full TypeScript support with type definitions:

```typescript
import StackAds, { 
  type StackAdsConfig,
  type PublisherInfo,
  type AdvertiserInfo,
  type StakeInfo,
  type CampaignInfo 
} from '@stackads/vanilla';

const config: StackAdsConfig = {
  network: 'testnet',
  contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  contractName: 'stackads-token',
};

const stackads = new StackAds(config);
```

## Error Handling

```javascript
try {
  const txId = await stackads.transfer(
    'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG',
    1000000n
  );
  console.log('Success:', txId);
} catch (error) {
  if (error.message.includes('insufficient balance')) {
    console.error('Not enough tokens');
  } else if (error.message.includes('user rejected')) {
    console.error('Transaction cancelled by user');
  } else {
    console.error('Transaction failed:', error.message);
  }
}
```

## Browser Compatibility

- Chrome/Edge: ✅ Latest 2 versions
- Firefox: ✅ Latest 2 versions
- Safari: ✅ Latest 2 versions
- Opera: ✅ Latest 2 versions

Requires BigInt support (ES2020+).

## License

MIT
