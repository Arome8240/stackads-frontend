import {
  TokenClient,
  RegistryClient,
  StakingClient,
  TreasuryClient,
  type StackAdsConfig,
  type PublisherInfo,
  type AdvertiserInfo,
  type StakeInfo,
  type CampaignInfo,
  type TransactionResult,
} from '@stackads/sdk-core';

export class StackAds {
  private config: StackAdsConfig;
  public token: TokenClient;
  public registry: RegistryClient;
  public staking: StakingClient;
  public treasury: TreasuryClient;

  constructor(config: StackAdsConfig) {
    this.config = config;
    this.token = new TokenClient(config);
    this.registry = new RegistryClient(config);
    this.staking = new StakingClient(config);
    this.treasury = new TreasuryClient(config);
  }

  // Convenience methods for common operations
  async getBalance(address: string): Promise<bigint> {
    return this.token.getBalance(address);
  }

  async transfer(to: string, amount: bigint, memo?: string): Promise<string> {
    return this.token.transfer(to, amount, memo);
  }

  async registerPublisher(
    name: string,
    website: string,
    stakeAmount: bigint
  ): Promise<string> {
    return this.registry.registerPublisher(name, website, stakeAmount);
  }

  async registerAdvertiser(
    name: string,
    company: string,
    stakeAmount: bigint
  ): Promise<string> {
    return this.registry.registerAdvertiser(name, company, stakeAmount);
  }

  async stake(amount: bigint): Promise<string> {
    return this.staking.stake(amount);
  }

  async unstake(amount: bigint): Promise<string> {
    return this.staking.unstake(amount);
  }

  async createCampaign(
    name: string,
    budget: bigint,
    costPerClick: bigint,
    duration: number
  ): Promise<string> {
    return this.treasury.createCampaign(name, budget, costPerClick, duration);
  }

  // Utility methods
  formatAmount(amount: bigint): string {
    return this.token.formatAmount(amount);
  }

  parseAmount(amount: string): bigint {
    return this.token.parseAmount(amount);
  }
}

// Re-export types
export type {
  StackAdsConfig,
  PublisherInfo,
  AdvertiserInfo,
  StakeInfo,
  CampaignInfo,
  TransactionResult,
};

// Re-export clients for advanced usage
export { TokenClient, RegistryClient, StakingClient, TreasuryClient };

// Default export
export default StackAds;
