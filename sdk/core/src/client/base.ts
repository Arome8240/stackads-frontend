/**
 * Base client for interacting with StackAds contracts
 */

import {
  makeContractCall,
  makeContractSTXPostCondition,
  broadcastTransaction,
  callReadOnlyFunction,
  cvToJSON,
  type ClarityValue,
  type PostCondition,
} from '@stacks/transactions';
import type { StacksNetwork } from '@stacks/network';
import {
  type StackAdsConfig,
  type TransactionResult,
  TransactionStatus,
  ContractError,
  NetworkError,
} from '../types';

export class BaseClient {
  protected network: StacksNetwork;
  protected contractAddress: string;

  constructor(config: StackAdsConfig) {
    this.network = config.network;
    this.contractAddress = config.contractAddress;
  }

  /**
   * Call a read-only contract function
   */
  protected async callReadOnly<T>(
    contractName: string,
    functionName: string,
    functionArgs: ClarityValue[],
    senderAddress: string
  ): Promise<T> {
    try {
      const result = await callReadOnlyFunction({
        network: this.network,
        contractAddress: this.contractAddress,
        contractName,
        functionName,
        functionArgs,
        senderAddress,
      });

      return cvToJSON(result).value as T;
    } catch (error) {
      throw new ContractError(
        `Failed to call read-only function ${functionName}`,
        error
      );
    }
  }

  /**
   * Make a contract call transaction
   */
  protected async makeContractCall(
    contractName: string,
    functionName: string,
    functionArgs: ClarityValue[],
    senderKey: string,
    postConditions: PostCondition[] = []
  ): Promise<TransactionResult> {
    try {
      const txOptions = {
        network: this.network,
        contractAddress: this.contractAddress,
        contractName,
        functionName,
        functionArgs,
        senderKey,
        postConditions,
        validateWithAbi: true,
      };

      const transaction = await makeContractCall(txOptions);
      const broadcastResponse = await broadcastTransaction(
        transaction,
        this.network
      );

      if ('error' in broadcastResponse) {
        return {
          txId: '',
          status: TransactionStatus.FAILED,
          error: broadcastResponse.error,
        };
      }

      return {
        txId: broadcastResponse.txid,
        status: TransactionStatus.PENDING,
      };
    } catch (error) {
      throw new ContractError(
        `Failed to make contract call ${functionName}`,
        error
      );
    }
  }

  /**
   * Wait for transaction confirmation
   */
  protected async waitForTransaction(
    txId: string,
    timeout = 60000
  ): Promise<TransactionResult> {
    const startTime = Date.now();
    const apiUrl = this.network.coreApiUrl;

    while (Date.now() - startTime < timeout) {
      try {
        const response = await fetch(`${apiUrl}/extended/v1/tx/${txId}`);
        const data = await response.json();

        if (data.tx_status === 'success') {
          return {
            txId,
            status: TransactionStatus.SUCCESS,
            blockHeight: data.block_height,
          };
        }

        if (data.tx_status === 'abort_by_response' || data.tx_status === 'abort_by_post_condition') {
          return {
            txId,
            status: TransactionStatus.FAILED,
            error: data.tx_result?.repr || 'Transaction failed',
          };
        }

        // Wait 2 seconds before checking again
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (error) {
        throw new NetworkError('Failed to check transaction status', error);
      }
    }

    throw new NetworkError('Transaction confirmation timeout');
  }

  /**
   * Get current block height
   */
  protected async getCurrentBlockHeight(): Promise<number> {
    try {
      const response = await fetch(
        `${this.network.coreApiUrl}/extended/v1/block`
      );
      const data = await response.json();
      return data.results[0]?.height || 0;
    } catch (error) {
      throw new NetworkError('Failed to get current block height', error);
    }
  }

  /**
   * Format micro-tokens to tokens (6 decimals)
   */
  protected formatTokenAmount(microAmount: bigint): string {
    return (Number(microAmount) / 1_000_000).toFixed(6);
  }

  /**
   * Parse tokens to micro-tokens (6 decimals)
   */
  protected parseTokenAmount(amount: string | number): bigint {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return BigInt(Math.floor(numAmount * 1_000_000));
  }
}
