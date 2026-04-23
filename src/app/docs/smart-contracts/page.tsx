export default function SmartContractsOverview() {
  const contracts = [
    {
      name: "StackAds Token (SADS)",
      description: "SIP-010 compliant fungible token",
      features: ["1B max supply", "6 decimals", "Transfer with memo", "Burn capability"],
      href: "/docs/smart-contracts/token",
    },
    {
      name: "Ad Registry",
      description: "Publisher and advertiser registration",
      features: ["Stake requirements", "Reputation system", "Stats tracking", "Slash mechanism"],
      href: "/docs/smart-contracts/registry",
    },
    {
      name: "Staking",
      description: "Token staking and rewards",
      features: ["Stake/unstake", "Reward distribution", "Reward rate calculation", "Emergency withdraw"],
      href: "/docs/smart-contracts/staking",
    },
    {
      name: "Ad Treasury",
      description: "Campaign funding and payouts",
      features: ["Campaign management", "Publisher payouts", "Budget tracking", "Automated triggers"],
      href: "/docs/smart-contracts/treasury",
    },
    {
      name: "Governance",
      description: "Decentralized governance",
      features: ["Proposal creation", "Token-weighted voting", "Execution", "Quorum requirements"],
      href: "/docs/smart-contracts/governance",
    },
    {
      name: "Vesting",
      description: "Token vesting schedules",
      features: ["Cliff periods", "Linear vesting", "Claim tokens", "Revoke unvested"],
      href: "/docs/smart-contracts/vesting",
    },
  ];

  return (
    <div className="prose prose-invert max-w-none">
      <h1>Smart Contracts</h1>
      <p className="lead">
        StackAds is powered by a suite of Clarity smart contracts deployed on the Stacks blockchain.
      </p>

      <h2>Overview</h2>
      <p>
        All StackAds functionality is implemented through transparent, auditable smart contracts
        written in Clarity. These contracts handle token operations, user registration, staking,
        campaign management, and governance.
      </p>

      <h2>Contract Architecture</h2>
      <div className="glass rounded-2xl p-6 border border-white/8 not-prose my-8">
        <pre className="text-sm text-white/80 overflow-x-auto">
{`┌─────────────────────────────────────────────────┐
│              StackAds Token (SADS)              │
│         SIP-010 Fungible Token Contract         │
└─────────────────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
┌───────▼──────┐ ┌─────▼──────┐ ┌─────▼──────┐
│  Ad Registry │ │   Staking  │ │  Treasury  │
│              │ │            │ │            │
│ Publishers   │ │ Stake SADS │ │ Campaigns  │
│ Advertisers  │ │ Earn Rewards│ │ Payouts    │
└──────────────┘ └────────────┘ └────────────┘
        │               │               │
        └───────────────┼───────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
┌───────▼──────┐ ┌─────▼──────┐ ┌─────▼──────┐
│  Governance  │ │  Vesting   │ │  Referral  │
└──────────────┘ └────────────┘ └────────────┘`}
        </pre>
      </div>

      <h2>Core Contracts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 not-prose my-8">
        {contracts.map((contract) => (
          <a
            key={contract.name}
            href={contract.href}
            className="glass rounded-2xl p-6 border border-white/8 hover:border-[#f7931a]/50 transition-all group"
          >
            <h3 className="text-lg font-semibold mb-2">{contract.name}</h3>
            <p className="text-white/60 text-sm mb-4">{contract.description}</p>
            <ul className="space-y-1">
              {contract.features.map((feature) => (
                <li key={feature} className="text-xs text-white/40 flex items-center gap-2">
                  <span className="text-[#4ade80]">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-4 border-t border-white/10">
              <span className="text-sm text-[#f7931a] group-hover:underline">
                View Contract →
              </span>
            </div>
          </a>
        ))}
      </div>

      <h2>Contract Addresses</h2>
      <p>Deployed contract addresses on Stacks blockchain:</p>

      <h3>Testnet</h3>
      <div className="glass rounded-xl p-4 border border-white/8 not-prose my-4">
        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b border-white/5">
              <td className="py-2 text-white/60">Token</td>
              <td className="py-2 font-mono text-xs">ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.stackads-token</td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="py-2 text-white/60">Registry</td>
              <td className="py-2 font-mono text-xs">ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.ad-registry</td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="py-2 text-white/60">Staking</td>
              <td className="py-2 font-mono text-xs">ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.staking</td>
            </tr>
            <tr>
              <td className="py-2 text-white/60">Treasury</td>
              <td className="py-2 font-mono text-xs">ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.ad-treasury</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>Mainnet</h3>
      <p className="text-white/60">Coming soon after security audit and testing phase.</p>

      <h2>Interacting with Contracts</h2>
      <p>You can interact with contracts in several ways:</p>

      <h3>1. Using SDKs (Recommended)</h3>
      <pre><code>{`import { TokenClient } from '@stackads/sdk-core';

const client = new TokenClient({
  network: 'testnet',
  contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  contractName: 'stackads-token',
});

const balance = await client.getBalance(address);`}</code></pre>

      <h3>2. Direct Contract Calls</h3>
      <pre><code>{`import { callReadOnlyFunction } from '@stacks/transactions';

const result = await callReadOnlyFunction({
  contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  contractName: 'stackads-token',
  functionName: 'get-balance',
  functionArgs: [principalCV(address)],
  network: new StacksTestnet(),
  senderAddress: address,
});`}</code></pre>

      <h3>3. Stacks Explorer</h3>
      <p>
        View and interact with contracts directly on the{" "}
        <a href="https://explorer.stacks.co" target="_blank" rel="noopener">
          Stacks Explorer
        </a>
        .
      </p>

      <h2>Security</h2>
      <p>All contracts have been:</p>
      <ul>
        <li>✓ Thoroughly tested with 100% coverage</li>
        <li>✓ Reviewed by the core team</li>
        <li>⏳ Security audit in progress</li>
        <li>⏳ Bug bounty program coming soon</li>
      </ul>

      <h2>Source Code</h2>
      <p>
        All smart contracts are open source and available on{" "}
        <a href="https://github.com/stackads/contracts" target="_blank" rel="noopener">
          GitHub
        </a>
        .
      </p>

      <div className="glass rounded-2xl p-6 border border-[#22d3ee]/20 bg-[#22d3ee]/5 not-prose mt-8">
        <h3 className="text-lg font-semibold mb-2 text-[#22d3ee]">
          Want to Learn More?
        </h3>
        <p className="text-white/80 mb-4">
          Dive deeper into each contract's functionality and API.
        </p>
        <div className="flex gap-3">
          <a
            href="/docs/smart-contracts/token"
            className="px-4 py-2 bg-[#22d3ee] text-white rounded-lg hover:bg-[#22d3ee]/90 transition-colors text-sm font-medium"
          >
            Token Contract
          </a>
          <a
            href="/docs/smart-contracts/registry"
            className="px-4 py-2 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-colors text-sm font-medium"
          >
            Registry Contract
          </a>
        </div>
      </div>
    </div>
  );
}
