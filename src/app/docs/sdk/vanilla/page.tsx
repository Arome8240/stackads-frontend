export default function VanillaSDKPage() {
  return (
    <div className="prose">
      <h1>Vanilla JavaScript SDK</h1>
      <p className="lead">
        Framework-free JavaScript SDK for StackAds. Works in any JavaScript environment - no framework required.
      </p>

      <h2>Installation</h2>
      
      <h3>NPM/Yarn/PNPM</h3>
      <pre><code>{`npm install @stackads/vanilla
# or
pnpm add @stackads/vanilla`}</code></pre>

      <h3>CDN (Browser)</h3>
      <pre><code>{`<!-- Via unpkg -->
<script src="https://unpkg.com/@stackads/vanilla@latest/dist/index.global.js"></script>

<!-- Via jsDelivr -->
<script src="https://cdn.jsdelivr.net/npm/@stackads/vanilla@latest/dist/index.global.js"></script>`}</code></pre>

      <h2>Quick Start</h2>

      <h3>ES Modules</h3>
      <pre><code>{`import StackAds from '@stackads/vanilla';

const stackads = new StackAds({
  network: 'testnet', // or 'mainnet'
  contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  contractName: 'stackads-token',
});

// Get token balance
const balance = await stackads.getBalance('ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM');
console.log('Balance:', stackads.formatAmount(balance), 'SADS');`}</code></pre>

      <h3>Browser (CDN)</h3>
      <pre><code>{`<!DOCTYPE html>
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
        \`Balance: \${stackads.formatAmount(balance)} SADS\`;
    }

    loadBalance();
  </script>
</body>
</html>`}</code></pre>

      <h2>API Reference</h2>

      <h3>Constructor</h3>
      <pre><code>{`const stackads = new StackAds(config);`}</code></pre>
      <p>Config Options:</p>
      <ul>
        <li>network: 'testnet' or 'mainnet'</li>
        <li>contractAddress: Contract address on Stacks blockchain</li>
        <li>contractName: Name of the contract</li>
      </ul>

      <h3>Token Operations</h3>
      <pre><code>{`// Get balance
const balance = await stackads.getBalance(address);

// Transfer tokens
const txId = await stackads.transfer(
  'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG',
  1000000n, // 1 SADS (6 decimals)
  'Payment for services' // optional memo
);

// Format amount
const formatted = stackads.formatAmount(1000000n); // "1.000000"

// Parse amount
const amount = stackads.parseAmount('1.5'); // 1500000n`}</code></pre>

      <h3>Registry Operations</h3>
      <pre><code>{`// Register as publisher
const txId = await stackads.registerPublisher(
  'My Website',
  'https://example.com',
  10000000n // 10 SADS stake
);

// Register as advertiser
const txId = await stackads.registerAdvertiser(
  'John Doe',
  'Acme Corp',
  10000000n // 10 SADS stake
);`}</code></pre>

      <h3>Staking Operations</h3>
      <pre><code>{`// Stake tokens
const txId = await stackads.stake(5000000n); // Stake 5 SADS

// Unstake tokens
const txId = await stackads.unstake(2000000n); // Unstake 2 SADS`}</code></pre>

      <h3>Campaign Operations</h3>
      <pre><code>{`// Create campaign
const txId = await stackads.createCampaign(
  'Summer Sale 2024',
  50000000n, // 50 SADS budget
  100000n,   // 0.1 SADS per click
  30         // 30 days duration
);`}</code></pre>

      <h2>Direct Client Access</h2>
      <p>For advanced operations, access the underlying clients directly:</p>
      <pre><code>{`// Token operations
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
console.log('Campaign:', campaignInfo.name);`}</code></pre>

      <h2>Error Handling</h2>
      <pre><code>{`try {
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
}`}</code></pre>

      <h2>Browser Compatibility</h2>
      <ul>
        <li>Chrome/Edge: ✅ Latest 2 versions</li>
        <li>Firefox: ✅ Latest 2 versions</li>
        <li>Safari: ✅ Latest 2 versions</li>
        <li>Opera: ✅ Latest 2 versions</li>
      </ul>
      <p>Requires BigInt support (ES2020+).</p>
    </div>
  );
}
