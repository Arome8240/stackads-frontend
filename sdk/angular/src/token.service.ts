import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject, Observable, from, throwError } from 'rxjs';
import { catchError, tap, finalize } from 'rxjs/operators';
import { TokenClient } from '@stackads/sdk-core';
import { STACKADS_CONFIG } from './config.service';
import type { StackAdsConfig } from '@stackads/sdk-core';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private client: TokenClient;
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private balanceSubject = new BehaviorSubject<bigint | null>(null);
  private tokenInfoSubject = new BehaviorSubject<{
    name: string;
    symbol: string;
    decimals: number;
    totalSupply: bigint;
  } | null>(null);

  public loading$ = this.loadingSubject.asObservable();
  public balance$ = this.balanceSubject.asObservable();
  public tokenInfo$ = this.tokenInfoSubject.asObservable();

  constructor(@Inject(STACKADS_CONFIG) private config: StackAdsConfig) {
    this.client = new TokenClient(config);
  }

  getBalance(address: string): Observable<bigint> {
    this.loadingSubject.next(true);
    return from(this.client.getBalance(address)).pipe(
      tap((balance) => this.balanceSubject.next(balance)),
      catchError((error) => {
        console.error('Error fetching balance:', error);
        return throwError(() => error);
      }),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  transfer(to: string, amount: bigint, memo?: string): Observable<string> {
    this.loadingSubject.next(true);
    return from(this.client.transfer(to, amount, memo)).pipe(
      catchError((error) => {
        console.error('Error transferring tokens:', error);
        return throwError(() => error);
      }),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  getTokenInfo(): Observable<{
    name: string;
    symbol: string;
    decimals: number;
    totalSupply: bigint;
  }> {
    this.loadingSubject.next(true);
    return from(this.client.getTokenInfo()).pipe(
      tap((info) => this.tokenInfoSubject.next(info)),
      catchError((error) => {
        console.error('Error fetching token info:', error);
        return throwError(() => error);
      }),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  formatAmount(amount: bigint): string {
    return this.client.formatAmount(amount);
  }

  parseAmount(amount: string): bigint {
    return this.client.parseAmount(amount);
  }
}
