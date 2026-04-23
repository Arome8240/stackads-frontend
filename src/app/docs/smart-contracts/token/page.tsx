export default function TokenContractPage() {
  return (
    <div className="prose">
      <h1>StackAds Token (SADS)</h1>
      <p className="lead">
        SIP-010 compliant fungible token that powers the StackAds ecosystem. Used for staking, campaign budgets, and publisher rewards.
      </p>

      <h2>Overview</h2>
      <p>
        The StackAds Token (SADS) is a fungible token built on the Stacks blockchain following the SIP-010 standard. 
        It serves as the native currency for all transactions within the StackAds platform.
      </p>

      <h2>Token Details</h2>
      <ul>
        <li>Name: StackAds Token</li>
        <li>Symbol: SADS</li>
        <li>Decimals: 6</li>
        <li>Max Supply: 1,000,000,000 SADS (1 billion)</li>
        <li>Initial Supply: 100,000,000 SADS (100 million)</li>
      </ul>

      <h2>Key Features</h2>
      
      <h3>SIP-010 Compliance</h3>
      <p>Fully implements the SIP-010 fungible token standard, ensuring compatibility with Stacks wallets and DeFi protocols.</p>

      <h3>Capped Supply</h3>
      <p>Maximum supply is hard-capped at 1 billion tokens to ensure scarcity and value preservation.</p>

      <h3>Burnable</h3>
      <p>Token holders can burn their tokens, permanently removing them from circulation.</p>

      <h3>Mintable (Owner Only)</h3>
      <p>Contract owner can mint new tokens up to the maximum supply cap.</p>

      <h2>Public Functions</h2>

      <h3>transfer</h3>
      <pre><code>{`(transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))`}</code></pre>
      <p>Transfer tokens from sender to recipient. Sender must be the transaction sender.</p>
      <ul>
        <li>amount: Amount of tokens to transfer (in micro-tokens)</li>
        <li>sender: Address sending the tokens</li>
        <li>recipient: Address receiving the tokens</li>
        <li>memo: Optional memo (max 34 bytes)</li>
      </ul>

      <h3>burn</h3>
      <pre><code>{`(burn (amount uint))`}</code></pre>
      <p>Burn tokens from the sender's balance, permanently removing them from circulation.</p>
      <ul>
        <li>amount: Amount of tokens to burn</li>
      </ul>

      <h2>Read-Only Functions</h2>

      <h3>get-name</h3>
      <pre><code>{`(get-name)`}</code></pre>
      <p>Returns the token name: "StackAds Token"</p>

      <h3>get-symbol</h3>
      <pre><code>{`(get-symbol)`}</code></pre>
      <p>Returns the token symbol: "SADS"</p>

      <h3>get-decimals</h3>
      <pre><code>{`(get-decimals)`}</code></pre>
      <p>Returns the number of decimals: 6</p>

      <h3>get-balance</h3>
      <pre><code>{`(get-balance (who principal))`}</code></pre>
      <p>Returns the token balance for a given address.</p>

      <h3>get-total-supply</h3>
      <pre><code>{`(get-total-supply)`}</code></pre>
      <p>Returns the current total supply of tokens in circulation.</p>

      <h3>get-token-uri</h3>
      <pre><code>{`(get-token-uri)`}</code></pre>
      <p>Returns the token metadata URI.</p>

      <h2>Owner Functions</h2>

      <h3>mint</h3>
      <pre><code>{`(mint (amount uint) (recipient principal))`}</code></pre>
      <p>Mint new tokens to a recipient address. Only callable by contract owner. Cannot exceed max supply.</p>

      <h3>set-token-uri</h3>
      <pre><code>{`(set-token-uri (new-uri (string-utf8 256)))`}</code></pre>
      <p>Update the token metadata URI. Only callable by contract owner.</p>

      <h2>Error Codes</h2>
      <ul>
        <li>u100: Owner only - Function can only be called by contract owner</li>
        <li>u101: Not token owner - Sender is not the token owner</li>
        <li>u102: Insufficient balance - Not enough tokens to complete operation</li>
        <li>u103: Max supply exceeded - Minting would exceed maximum supply</li>
      </ul>

      <h2>Usage Examples</h2>

      <h3>Transfer Tokens</h3>
      <pre><code>{`// Transfer 10 SADS to another address
(contract-call? .stackads-token transfer 
  u10000000 ;; 10 SADS (6 decimals)
  tx-sender
  'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG
  none
)`}</code></pre>

      <h3>Check Balance</h3>
      <pre><code>{`// Get balance for an address
(contract-call? .stackads-token get-balance 
  'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
)`}</code></pre>

      <h3>Burn Tokens</h3>
      <pre><code>{`// Burn 5 SADS
(contract-call? .stackads-token burn u5000000)`}</code></pre>

      <h2>Integration</h2>
      <p>
        The token contract is integrated with all other StackAds contracts:
      </p>
      <ul>
        <li>Ad Registry: Requires SADS tokens for publisher/advertiser staking</li>
        <li>Staking: Users stake SADS to earn rewards</li>
        <li>Treasury: Campaign budgets are funded with SADS</li>
        <li>Governance: SADS holders can participate in governance</li>
      </ul>

      <h2>Security Considerations</h2>
      <ul>
        <li>Transfer function validates sender is tx-sender</li>
        <li>Mint function restricted to contract owner</li>
        <li>Max supply enforced at contract level</li>
        <li>Burn function checks sufficient balance</li>
      </ul>
    </div>
  );
}
