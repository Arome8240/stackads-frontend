/**
 * Core types for StackAds SDK
 */

import type { StacksNetwork } from '@stacks/network';

// Network configuration
export interface StackAdsConfig {
  network: StacksNetwork;
  contractAddress: string;
  contractName?: string;
}

// Contract names
export enum ContractName {
  TOKEN = 'stackads-token',
  REGISTRY = 'ad-registry',
  STAKING = 'staking',
  TREASURY = 'ad-treasury',
  GOVERNANCE = 'governance',
  VESTING = 'vesting',
  CAMPAIGN_MANAGER = 'campaign-manager',
  VERIFICATION = 'ad-verification',
  DISPUTE = 'dispute-resolution',
  REFERRAL = 'referral-system',
}

// Transaction status
export enum TransactionStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
}

// Transaction result
export interface TransactionResult {
  txId: string;
  status: TransactionStatus;
  blockHeight?: number;
  error?: string;
}

// Participant types
export enum ParticipantType {
  PUBLISHER = 1,
  ADVERTISER = 2,
}

// Participant status
export enum ParticipantStatus {
  UNREGISTERED = 0,
  ACTIVE = 1,
  SUSPENDED = 2,
  SLASHED = 3,
}

// Publisher/Advertiser data
export interface Participant {
  address: string;
  type: ParticipantType;
  status: ParticipantStatus;
  stakedAmount: bigint;
  reputationScore: number;
  metadataUri: string;
  registeredAt: number;
  totalImpressions: bigint;
  totalClicks: bigint;
}

// Campaign status
export enum CampaignStatus {
  ACTIVE = 1,
  PAUSED = 2,
  ENDED = 3,
}

// Campaign data
export interface Campaign {
  id: number;
  advertiser: string;
  budget: bigint;
  spent: bigint;
  costPerImpression: bigint;
  costPerClick: bigint;
  totalImpressions: bigint;
  totalClicks: bigint;
  status: CampaignStatus;
  startBlock: number;
  endBlock: number;
  metadataUri: string;
}

// Staking data
export interface StakingInfo {
  balance: bigint;
  earned: bigint;
  rewardRate: bigint;
  totalSupply: bigint;
}

// Proposal states
export enum ProposalState {
  PENDING = 1,
  ACTIVE = 2,
  DEFEATED = 3,
  SUCCEEDED = 4,
  EXECUTED = 5,
  CANCELLED = 6,
}

// Proposal data
export interface Proposal {
  id: number;
  proposer: string;
  description: string;
  forVotes: bigint;
  againstVotes: bigint;
  abstainVotes: bigint;
  startBlock: number;
  endBlock: number;
  state: ProposalState;
  executed: boolean;
  metadataUri: string;
}

// Vesting schedule
export interface VestingSchedule {
  beneficiary: string;
  totalAmount: bigint;
  releasedAmount: bigint;
  startBlock: number;
  cliffDuration: number;
  vestingDuration: number;
  revocable: boolean;
  revoked: boolean;
  revokedAt: number;
}

// Referral tiers
export enum ReferralTier {
  BRONZE = 1,
  SILVER = 2,
  GOLD = 3,
  PLATINUM = 4,
}

// Referral data
export interface ReferralInfo {
  referrer?: string;
  referralCode: string;
  referredAt: number;
  totalReferrals: number;
  activeReferrals: number;
  totalEarned: bigint;
  tier: ReferralTier;
}

// Event types
export interface TokenTransferEvent {
  from: string;
  to: string;
  amount: bigint;
  txId: string;
}

export interface CampaignCreatedEvent {
  campaignId: number;
  advertiser: string;
  budget: bigint;
  txId: string;
}

export interface StakeEvent {
  user: string;
  amount: bigint;
  txId: string;
}

export interface ProposalCreatedEvent {
  proposalId: number;
  proposer: string;
  description: string;
  txId: string;
}

// Error types
export class StackAdsError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'StackAdsError';
  }
}

export class ContractError extends StackAdsError {
  constructor(message: string, details?: unknown) {
    super(message, 'CONTRACT_ERROR', details);
    this.name = 'ContractError';
  }
}

export class NetworkError extends StackAdsError {
  constructor(message: string, details?: unknown) {
    super(message, 'NETWORK_ERROR', details);
    this.name = 'NetworkError';
  }
}

export class ValidationError extends StackAdsError {
  constructor(message: string, details?: unknown) {
    super(message, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}
