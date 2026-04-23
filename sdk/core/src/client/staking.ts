/**
 * Staking client for SADS token staking and rewards
 */

import {
  uintCV,
  principalCV,
} from '@stacks/transactions';
import { BaseClient } from './base';
import {
  ContractName,
  type TransactionResult,
  type StakingInfo,
} from '../types';

export class StakingClient extends BaseClient {
  private contractName = ContractName.STAKING;

  /**
   * Stake tokens
   */
  async stake(
    amount: bigint | string | number,
    senderKey: string
  ): Promise<TransactionResult> {
    const amountMicro =
      typeof amount === 'bigint' ? amount : this.parseTokenAmount(amount);

    return this.makeContractCall(
      this.contractName,
      'stake',
      [uintCV(amountMicro)],
      senderKey
    );
  }

  /**
   * Withdraw staked tokens
   */
  async withdraw(
    amount: bigint | string | number,
    senderKey: string
  ): Promise<TransactionResult> {
    const amountMicro =
      typeof amount === 'bigint' ? amount : this.parseTokenAmount(amount);

    return this.makeContractCall(
      this.contractName,
      'withdraw',
      [uintCV(amountMicro)],
      senderKey
    );
  }

  /**
   * Claim accumulated rewards
   */
  async claimReward(senderKey: string): Promise<TransactionResult> {
    return this.makeContractCall(
      this.contractName,
      'claim-reward',
      [],
      senderKey
    );
  }

  /**
   * Exit (withdraw all + claim rewards)
   */
  async exit(senderKey: string): Promise<TransactionResult> {
    return this.makeContractCall(
      this.contractName,
      'exit',
      [],
      senderKey
    );
  }

  /**
   * Get staked balance for an address
   */
  async getBalance(address: string): Promise<bigint> {
    const result = await this.callReadOnly<{ value: string }>(
      this.contractName,
      'get-balance',
      [principalCV(address)],
      this.contractAddress
    );
    return BigInt(result.value);
  }

  /**
   * Get formatted staked balance
   */
  async getFormattedBalance(address: string): Promise<string> {
    const balance = await this.getBalance(address);
    return this.formatTokenAmount(balance);
  }

  /**
   * Get total staked supply
   */
  async getTotalSupply(): Promise<bigint> {
    const result = await this.callReadOnly<{ value: string }>(
      this.contractName,
      'get-total-supply',
      [],
      this.contractAddress
    );
    return BigInt(result.value);
  }

  /**
   * Get current reward rate
   */
  async getRewardRate(): Promise<bigint> {
    const result = await this.callReadOnly<{ value: string }>(
      this.contractName,
      'get-reward-rate',
      [],
      this.contractAddress
    );
    return BigInt(result.value);
  }

  /**
   * Get period finish block
   */
  async getPeriodFinish(): Promise<number> {
    const result = await this.callReadOnly<{ value: string }>(
      this.contractName,
      'get-period-finish',
      [],
      this.contractAddress
    );
    return Number(result.value);
  }

  /**
   * Get earned rewards for an address
   */
  async getEarned(address: string): Promise<bigint> {
    const result = await this.callReadOnly<{ value: string }>(
      this.contractName,
      'earned',
      [principalCV(address)],
      this.contractAddress
    );
    return BigInt(result.value);
  }

  /**
   * Get formatted earned rewards
   */
  async getFormattedEarned(address: string): Promise<string> {
    const earned = await this.getEarned(address);
    return this.formatTokenAmount(earned);
  }

  /**
   * Get reward for duration
   */
  async getRewardForDuration(): Promise<bigint> {
    const result = await this.callReadOnly<{ value: string }>(
      this.contractName,
      'get-reward-for-duration',
      [],
      this.contractAddress
    );
    return BigInt(result.value);
  }

  /**
   * Get complete staking info for an address
   */
  async getStakingInfo(address: string): Promise<StakingInfo> {
    const [balance, earned, rewardRate, totalSupply] = await Promise.all([
      this.getBalance(address),
      this.getEarned(address),
      this.getRewardRate(),
      this.getTotalSupply(),
    ]);

    return {
      balance,
      earned,
      rewardRate,
      totalSupply,
    };
  }

  /**
   * Calculate APY based on current reward rate
   */
  async calculateAPY(): Promise<number> {
    const rewardRate = await this.getRewardRate();
    const totalSupply = await this.getTotalSupply();

    if (totalSupply === BigInt(0)) {
      return 0;
    }

    // Blocks per year (assuming 10 min blocks)
    const blocksPerYear = (365 * 24 * 60) / 10;
    const yearlyRewards = Number(rewardRate) * blocksPerYear;
    const apy = (yearlyRewards / Number(totalSupply)) * 100;

    return apy;
  }

  /**
   * Notify reward amount (owner only)
   */
  async notifyRewardAmount(
    reward: bigint | string | number,
    duration: number,
    ownerKey: string
  ): Promise<TransactionResult> {
    const rewardMicro =
      typeof reward === 'bigint' ? reward : this.parseTokenAmount(reward);

    return this.makeContractCall(
      this.contractName,
      'notify-reward-amount',
      [uintCV(rewardMicro), uintCV(duration)],
      ownerKey
    );
  }

  /**
   * Get minimum stake requirement
   */
  getMinStake(): bigint {
    return BigInt(1_000_000); // 1 SADS
  }
}
