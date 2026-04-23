/**
 * StackAds Token (SADS) client
 */

import {
  uintCV,
  principalCV,
  noneCV,
  someCV,
  bufferCV,
  stringUtf8CV,
} from '@stacks/transactions';
import { BaseClient } from './base';
import { ContractName, type TransactionResult } from '../types';

export class TokenClient extends BaseClient {
  private contractName = ContractName.TOKEN;

  /**
   * Get token name
   */
  async getName(): Promise<string> {
    return this.callReadOnly(
      this.contractName,
      'get-name',
      [],
      this.contractAddress
    );
  }

  /**
   * Get token symbol
   */
  async getSymbol(): Promise<string> {
    return this.callReadOnly(
      this.contractName,
      'get-symbol',
      [],
      this.contractAddress
    );
  }

  /**
   * Get token decimals
   */
  async getDecimals(): Promise<number> {
    return this.callReadOnly(
      this.contractName,
      'get-decimals',
      [],
      this.contractAddress
    );
  }

  /**
   * Get token balance for an address
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
   * Get formatted token balance (with decimals)
   */
  async getFormattedBalance(address: string): Promise<string> {
    const balance = await this.getBalance(address);
    return this.formatTokenAmount(balance);
  }

  /**
   * Get total supply
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
   * Get token URI
   */
  async getTokenUri(): Promise<string | null> {
    const result = await this.callReadOnly<{ value: string | null }>(
      this.contractName,
      'get-token-uri',
      [],
      this.contractAddress
    );
    return result.value;
  }

  /**
   * Transfer tokens
   */
  async transfer(
    amount: bigint | string | number,
    recipient: string,
    senderKey: string,
    memo?: string
  ): Promise<TransactionResult> {
    const amountMicro =
      typeof amount === 'bigint' ? amount : this.parseTokenAmount(amount);

    const memoCV = memo ? someCV(bufferCV(Buffer.from(memo))) : noneCV();

    return this.makeContractCall(
      this.contractName,
      'transfer',
      [
        uintCV(amountMicro),
        principalCV(this.contractAddress), // sender (will be replaced by tx-sender)
        principalCV(recipient),
        memoCV,
      ],
      senderKey
    );
  }

  /**
   * Mint tokens (owner only)
   */
  async mint(
    amount: bigint | string | number,
    recipient: string,
    ownerKey: string
  ): Promise<TransactionResult> {
    const amountMicro =
      typeof amount === 'bigint' ? amount : this.parseTokenAmount(amount);

    return this.makeContractCall(
      this.contractName,
      'mint',
      [uintCV(amountMicro), principalCV(recipient)],
      ownerKey
    );
  }

  /**
   * Burn tokens
   */
  async burn(
    amount: bigint | string | number,
    senderKey: string
  ): Promise<TransactionResult> {
    const amountMicro =
      typeof amount === 'bigint' ? amount : this.parseTokenAmount(amount);

    return this.makeContractCall(
      this.contractName,
      'burn',
      [uintCV(amountMicro)],
      senderKey
    );
  }

  /**
   * Set token URI (owner only)
   */
  async setTokenUri(
    uri: string,
    ownerKey: string
  ): Promise<TransactionResult> {
    return this.makeContractCall(
      this.contractName,
      'set-token-uri',
      [stringUtf8CV(uri)],
      ownerKey
    );
  }

  /**
   * Get max supply constant
   */
  getMaxSupply(): bigint {
    return BigInt('1000000000000000'); // 1 billion with 6 decimals
  }
}
