/**
 * Main StackAds SDK client
 */

import type { StacksNetwork } from '@stacks/network';
import { TokenClient } from './token';
import { RegistryClient } from './registry';
import { StakingClient } from './staking';
import { TreasuryClient } from './treasury';
import type { StackAdsConfig } from '../types';

export class StackAdsSDK {
  public token: TokenClient;
  public registry: RegistryClient;
  public staking: StakingClient;
  public treasury: TreasuryClient;

  private config: StackAdsConfig;

  constructor(config: StackAdsConfig) {
    this.config = config;

    // Initialize all clients
    this.token = new TokenClient(config);
    this.registry = new RegistryClient(config);
    this.staking = new StakingClient(config);
    this.treasury = new TreasuryClient(config);
  }

  /**
   * Get current network
   */
  getNetwork(): StacksNetwork {
    return this.config.network;
  }

  /**
   * Get contract address
   */
  getContractAddress(): string {
    return this.config.contractAddress;
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<StackAdsConfig>): void {
    this.config = { ...this.config, ...newConfig };

    // Reinitialize clients with new config
    this.token = new TokenClient(this.config);
    this.registry = new RegistryClient(this.config);
    this.staking = new StakingClient(this.config);
    this.treasury = new TreasuryClient(this.config);
  }
}

// Export all clients
export { TokenClient } from './token';
export { RegistryClient } from './registry';
export { StakingClient } from './staking';
export { TreasuryClient } from './treasury';
export { BaseClient } from './base';
