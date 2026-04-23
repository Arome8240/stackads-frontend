import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject, Observable, from, throwError } from 'rxjs';
import { catchError, tap, finalize } from 'rxjs/operators';
import { StakingClient, StakeInfo } from '@stackads/sdk-core';
import { STACKADS_CONFIG } from './config.service';
import type { StackAdsConfig } from '@stackads/sdk-core';

@Injectable({
  providedIn: 'root',
})
export class StakingService {
  private client: StakingClient;
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private stakeInfoSubject = new BehaviorSubject<StakeInfo | null>(null);

  public loading$ = this.loadingSubject.asObservable();
  public stakeInfo$ = this.stakeInfoSubject.asObservable();

  constructor(@Inject(STACKADS_CONFIG) private config: StackAdsConfig) {
    this.client = new StakingClient(config);
  }

  stake(amount: bigint): Observable<string> {
    this.loadingSubject.next(true);
    return from(this.client.stake(amount)).pipe(
      catchError((error) => {
        console.error('Error staking:', error);
        return throwError(() => error);
      }),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  unstake(amount: bigint): Observable<string> {
    this.loadingSubject.next(true);
    return from(this.client.unstake(amount)).pipe(
      catchError((error) => {
        console.error('Error unstaking:', error);
        return throwError(() => error);
      }),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  getStakeInfo(address: string): Observable<StakeInfo> {
    this.loadingSubject.next(true);
    return from(this.client.getStakeInfo(address)).pipe(
      tap((info) => this.stakeInfoSubject.next(info)),
      catchError((error) => {
        console.error('Error fetching stake info:', error);
        return throwError(() => error);
      }),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  claimRewards(): Observable<string> {
    this.loadingSubject.next(true);
    return from(this.client.claimRewards()).pipe(
      catchError((error) => {
        console.error('Error claiming rewards:', error);
        return throwError(() => error);
      }),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  getPendingRewards(address: string): Observable<bigint> {
    this.loadingSubject.next(true);
    return from(this.client.getPendingRewards(address)).pipe(
      catchError((error) => {
        console.error('Error fetching pending rewards:', error);
        return throwError(() => error);
      }),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  formatAmount(amount: bigint): string {
    return this.client.formatAmount(amount);
  }
}
