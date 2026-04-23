/**
 * Ad Treasury client for campaign management and payouts
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
  type Campaign,
  CampaignStatus,
} from '../types';

export class TreasuryClient extends BaseClient {
  private contractName = ContractName.TREASURY;

  /**
   * Create a new campaign
   */
  async createCampaign(
    budget: bigint | string | number,
    costPerImpression: bigint | string | number,
    costPerClick: bigint | string | number,
    duration: number,
    metadataUri: string,
    senderKey: string
  ): Promise<TransactionResult> {
    const budgetMicro =
      typeof budget === 'bigint' ? budget : this.parseTokenAmount(budget);
    const cpiMicro =
      typeof costPerImpression === 'bigint'
        ? costPerImpression
        : this.parseTokenAmount(costPerImpression);
    const cpcMicro =
      typeof costPerClick === 'bigint'
        ? costPerClick
        : this.parseTokenAmount(costPerClick);

    return this.makeContractCall(
      this.contractName,
      'create-campaign',
      [
        uintCV(budgetMicro),
        uintCV(cpiMicro),
        uintCV(cpcMicro),
        uintCV(duration),
        stringUtf8CV(metadataUri),
      ],
      senderKey
    );
  }

  /**
   * Fund existing campaign
   */
  async fundCampaign(
    campaignId: number,
    additionalBudget: bigint | string | number,
    senderKey: string
  ): Promise<TransactionResult> {
    const budgetMicro =
      typeof additionalBudget === 'bigint'
        ? additionalBudget
        : this.parseTokenAmount(additionalBudget);

    return this.makeContractCall(
      this.contractName,
      'fund-campaign',
      [uintCV(campaignId), uintCV(budgetMicro)],
      senderKey
    );
  }

  /**
   * Claim earnings as publisher
   */
  async claimEarnings(
    campaignId: number,
    senderKey: string
  ): Promise<TransactionResult> {
    return this.makeContractCall(
      this.contractName,
      'claim-earnings',
      [uintCV(campaignId)],
      senderKey
    );
  }

  /**
   * Pause campaign
   */
  async pauseCampaign(
    campaignId: number,
    senderKey: string
  ): Promise<TransactionResult> {
    return this.makeContractCall(
      this.contractName,
      'pause-campaign',
      [uintCV(campaignId)],
      senderKey
    );
  }

  /**
   * Resume paused campaign
   */
  async resumeCampaign(
    campaignId: number,
    senderKey: string
  ): Promise<TransactionResult> {
    return this.makeContractCall(
      this.contractName,
      'resume-campaign',
      [uintCV(campaignId)],
      senderKey
    );
  }

  /**
   * End campaign and get refund
   */
  async endCampaign(
    campaignId: number,
    senderKey: string
  ): Promise<TransactionResult> {
    return this.makeContractCall(
      this.contractName,
      'end-campaign',
      [uintCV(campaignId)],
      senderKey
    );
  }

  /**
   * Get campaign details
   */
  async getCampaign(campaignId: number): Promise<Campaign | null> {
    const result = await this.callReadOnly<any>(
      this.contractName,
      'get-campaign',
      [uintCV(campaignId)],
      this.contractAddress
    );

    if (!result || result.type === 'none') {
      return null;
    }

    const data = result.value;
    return {
      id: campaignId,
      advertiser: data.advertiser.value,
      budget: BigInt(data.budget.value),
      spent: BigInt(data.spent.value),
      costPerImpression: BigInt(data['cost-per-impression'].value),
      costPerClick: BigInt(data['cost-per-click'].value),
      totalImpressions: BigInt(data['total-impressions'].value),
      totalClicks: BigInt(data['total-clicks'].value),
      status: data.status.value as CampaignStatus,
      startBlock: Number(data['start-block'].value),
      endBlock: Number(data['end-block'].value),
      metadataUri: data['metadata-uri'].value,
    };
  }

  /**
   * Get publisher earnings for a campaign
   */
  async getPublisherEarnings(
    campaignId: number,
    publisher: string
  ): Promise<{
    impressions: bigint;
    clicks: bigint;
    earned: bigint;
    claimed: bigint;
  } | null> {
    const result = await this.callReadOnly<any>(
      this.contractName,
      'get-publisher-earnings',
      [uintCV(campaignId), principalCV(publisher)],
      this.contractAddress
    );

    if (!result || result.type === 'none') {
      return null;
    }

    const data = result.value;
    return {
      impressions: BigInt(data.impressions.value),
      clicks: BigInt(data.clicks.value),
      earned: BigInt(data.earned.value),
      claimed: BigInt(data.claimed.value),
    };
  }

  /**
   * Get platform fee in basis points
   */
  async getPlatformFeeBps(): Promise<number> {
    const result = await this.callReadOnly<{ value: string }>(
      this.contractName,
      'get-platform-fee-bps',
      [],
      this.contractAddress
    );
    return Number(result.value);
  }

  /**
   * Calculate platform fee for an amount
   */
  async calculatePlatformFee(
    amount: bigint | string | number
  ): Promise<bigint> {
    const amountMicro =
      typeof amount === 'bigint' ? amount : this.parseTokenAmount(amount);

    const result = await this.callReadOnly<{ value: string }>(
      this.contractName,
      'calculate-platform-fee',
      [uintCV(amountMicro)],
      this.contractAddress
    );
    return BigInt(result.value);
  }

  /**
   * Get campaign remaining budget
   */
  async getCampaignRemainingBudget(campaignId: number): Promise<bigint> {
    const result = await this.callReadOnly<{ value: string }>(
      this.contractName,
      'get-campaign-remaining-budget',
      [uintCV(campaignId)],
      this.contractAddress
    );
    return BigInt(result.value);
  }

  /**
   * Check if campaign is active
   */
  async isCampaignActive(campaignId: number): Promise<boolean> {
    const result = await this.callReadOnly<boolean>(
      this.contractName,
      'is-campaign-active',
      [uintCV(campaignId)],
      this.contractAddress
    );
    return result;
  }

  /**
   * Calculate campaign metrics
   */
  async getCampaignMetrics(campaignId: number): Promise<{
    ctr: number;
    averageCpc: number;
    budgetUsed: number;
    remainingBudget: bigint;
  } | null> {
    const campaign = await this.getCampaign(campaignId);
    if (!campaign) return null;

    const ctr =
      campaign.totalImpressions > BigInt(0)
        ? (Number(campaign.totalClicks) / Number(campaign.totalImpressions)) *
          100
        : 0;

    const averageCpc =
      campaign.totalClicks > BigInt(0)
        ? Number(campaign.spent) / Number(campaign.totalClicks)
        : 0;

    const budgetUsed =
      campaign.budget > BigInt(0)
        ? (Number(campaign.spent) / Number(campaign.budget)) * 100
        : 0;

    const remainingBudget = campaign.budget - campaign.spent;

    return {
      ctr,
      averageCpc,
      budgetUsed,
      remainingBudget,
    };
  }

  /**
   * Record ad event (owner only)
   */
  async recordAdEvent(
    campaignId: number,
    publisher: string,
    impressions: bigint,
    clicks: bigint,
    ownerKey: string
  ): Promise<TransactionResult> {
    return this.makeContractCall(
      this.contractName,
      'record-ad-event',
      [
        uintCV(campaignId),
        principalCV(publisher),
        uintCV(impressions),
        uintCV(clicks),
      ],
      ownerKey
    );
  }

  /**
   * Set platform fee (owner only)
   */
  async setPlatformFee(
    newFeeBps: number,
    ownerKey: string
  ): Promise<TransactionResult> {
    return this.makeContractCall(
      this.contractName,
      'set-platform-fee',
      [uintCV(newFeeBps)],
      ownerKey
    );
  }

  /**
   * Emergency pause campaign (owner only)
   */
  async emergencyPauseCampaign(
    campaignId: number,
    ownerKey: string
  ): Promise<TransactionResult> {
    return this.makeContractCall(
      this.contractName,
      'emergency-pause-campaign',
      [uintCV(campaignId)],
      ownerKey
    );
  }

  /**
   * Withdraw platform fees (owner only)
   */
  async withdrawPlatformFees(
    amount: bigint | string | number,
    ownerKey: string
  ): Promise<TransactionResult> {
    const amountMicro =
      typeof amount === 'bigint' ? amount : this.parseTokenAmount(amount);

    return this.makeContractCall(
      this.contractName,
      'withdraw-platform-fees',
      [uintCV(amountMicro)],
      ownerKey
    );
  }
}
