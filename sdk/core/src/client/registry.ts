/**
 * Ad Registry client for publisher/advertiser management
 */

import {
  uintCV,
  principalCV,
  stringUtf8CV,
} from '@stacks/transactions';
import { BaseClient } from './base';
import {
  ContractName,
  type TransactionResult,
  type Participant,
  ParticipantType,
  ParticipantStatus,
} from '../types';

export class RegistryClient extends BaseClient {
  private contractName = ContractName.REGISTRY;

  /**
   * Register as a publisher
   */
  async registerPublisher(
    metadataUri: string,
    senderKey: string
  ): Promise<TransactionResult> {
    return this.makeContractCall(
      this.contractName,
      'register-publisher',
      [stringUtf8CV(metadataUri)],
      senderKey
    );
  }

  /**
   * Register as an advertiser
   */
  async registerAdvertiser(
    metadataUri: string,
    senderKey: string
  ): Promise<TransactionResult> {
    return this.makeContractCall(
      this.contractName,
      'register-advertiser',
      [stringUtf8CV(metadataUri)],
      senderKey
    );
  }

  /**
   * Unregister and reclaim stake
   */
  async unregister(senderKey: string): Promise<TransactionResult> {
    return this.makeContractCall(
      this.contractName,
      'unregister',
      [],
      senderKey
    );
  }

  /**
   * Update metadata URI
   */
  async updateMetadata(
    newUri: string,
    senderKey: string
  ): Promise<TransactionResult> {
    return this.makeContractCall(
      this.contractName,
      'update-metadata',
      [stringUtf8CV(newUri)],
      senderKey
    );
  }

  /**
   * Get participant information
   */
  async getParticipant(address: string): Promise<Participant | null> {
    const result = await this.callReadOnly<any>(
      this.contractName,
      'get-participant',
      [principalCV(address)],
      this.contractAddress
    );

    if (!result || result.type === 'none') {
      return null;
    }

    const data = result.value;
    return {
      address,
      type: data['participant-type'].value as ParticipantType,
      status: data.status.value as ParticipantStatus,
      stakedAmount: BigInt(data['staked-amount'].value),
      reputationScore: Number(data['reputation-score'].value),
      metadataUri: data['metadata-uri'].value,
      registeredAt: Number(data['registered-at'].value),
      totalImpressions: BigInt(data['total-impressions'].value),
      totalClicks: BigInt(data['total-clicks'].value),
    };
  }

  /**
   * Check if address is an active publisher
   */
  async isActivePublisher(address: string): Promise<boolean> {
    const result = await this.callReadOnly<boolean>(
      this.contractName,
      'is-active-publisher',
      [principalCV(address)],
      this.contractAddress
    );
    return result;
  }

  /**
   * Check if address is an active advertiser
   */
  async isActiveAdvertiser(address: string): Promise<boolean> {
    const result = await this.callReadOnly<boolean>(
      this.contractName,
      'is-active-advertiser',
      [principalCV(address)],
      this.contractAddress
    );
    return result;
  }

  /**
   * Get publisher count
   */
  async getPublisherCount(): Promise<number> {
    const result = await this.callReadOnly<{ value: string }>(
      this.contractName,
      'get-publisher-count',
      [],
      this.contractAddress
    );
    return Number(result.value);
  }

  /**
   * Get advertiser count
   */
  async getAdvertiserCount(): Promise<number> {
    const result = await this.callReadOnly<{ value: string }>(
      this.contractName,
      'get-advertiser-count',
      [],
      this.contractAddress
    );
    return Number(result.value);
  }

  /**
   * Get click-through rate for a publisher
   */
  async getClickThroughRate(publisher: string): Promise<number> {
    const result = await this.callReadOnly<{ value: string }>(
      this.contractName,
      'get-click-through-rate',
      [principalCV(publisher)],
      this.contractAddress
    );
    return Number(result.value) / 10000; // Convert from basis points to percentage
  }

  /**
   * Update reputation (owner only)
   */
  async updateReputation(
    participant: string,
    newScore: number,
    ownerKey: string
  ): Promise<TransactionResult> {
    return this.makeContractCall(
      this.contractName,
      'update-reputation',
      [principalCV(participant), uintCV(newScore)],
      ownerKey
    );
  }

  /**
   * Record stats (owner only)
   */
  async recordStats(
    publisher: string,
    impressions: bigint,
    clicks: bigint,
    ownerKey: string
  ): Promise<TransactionResult> {
    return this.makeContractCall(
      this.contractName,
      'record-stats',
      [principalCV(publisher), uintCV(impressions), uintCV(clicks)],
      ownerKey
    );
  }

  /**
   * Suspend participant (owner only)
   */
  async suspend(
    participant: string,
    reason: string,
    ownerKey: string
  ): Promise<TransactionResult> {
    return this.makeContractCall(
      this.contractName,
      'suspend',
      [principalCV(participant), stringUtf8CV(reason)],
      ownerKey
    );
  }

  /**
   * Reinstate suspended participant (owner only)
   */
  async reinstate(
    participant: string,
    ownerKey: string
  ): Promise<TransactionResult> {
    return this.makeContractCall(
      this.contractName,
      'reinstate',
      [principalCV(participant)],
      ownerKey
    );
  }

  /**
   * Slash participant stake (owner only)
   */
  async slash(
    participant: string,
    basisPoints: number,
    reason: string,
    ownerKey: string
  ): Promise<TransactionResult> {
    return this.makeContractCall(
      this.contractName,
      'slash',
      [principalCV(participant), uintCV(basisPoints), stringUtf8CV(reason)],
      ownerKey
    );
  }

  /**
   * Set publisher stake requirement (owner only)
   */
  async setPublisherStakeRequired(
    amount: bigint | string | number,
    ownerKey: string
  ): Promise<TransactionResult> {
    const amountMicro =
      typeof amount === 'bigint' ? amount : this.parseTokenAmount(amount);

    return this.makeContractCall(
      this.contractName,
      'set-publisher-stake-required',
      [uintCV(amountMicro)],
      ownerKey
    );
  }

  /**
   * Set advertiser stake requirement (owner only)
   */
  async setAdvertiserStakeRequired(
    amount: bigint | string | number,
    ownerKey: string
  ): Promise<TransactionResult> {
    const amountMicro =
      typeof amount === 'bigint' ? amount : this.parseTokenAmount(amount);

    return this.makeContractCall(
      this.contractName,
      'set-advertiser-stake-required',
      [uintCV(amountMicro)],
      ownerKey
    );
  }
}
