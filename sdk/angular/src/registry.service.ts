import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject, Observable, from, throwError } from 'rxjs';
import { catchError, tap, finalize } from 'rxjs/operators';
import { RegistryClient, PublisherInfo, AdvertiserInfo } from '@stackads/sdk-core';
import { STACKADS_CONFIG } from './config.service';
import type { StackAdsConfig } from '@stackads/sdk-core';

@Injectable({
  providedIn: 'root',
})
export class RegistryService {
  private client: RegistryClient;
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private publisherInfoSubject = new BehaviorSubject<PublisherInfo | null>(null);
  private advertiserInfoSubject = new BehaviorSubject<AdvertiserInfo | null>(null);

  public loading$ = this.loadingSubject.asObservable();
  public publisherInfo$ = this.publisherInfoSubject.asObservable();
  public advertiserInfo$ = this.advertiserInfoSubject.asObservable();

  constructor(@Inject(STACKADS_CONFIG) private config: StackAdsConfig) {
    this.client = new RegistryClient(config);
  }

  // Publisher operations
  registerPublisher(name: string, website: string, stakeAmount: bigint): Observable<string> {
    this.loadingSubject.next(true);
    return from(this.client.registerPublisher(name, website, stakeAmount)).pipe(
      catchError((error) => {
        console.error('Error registering publisher:', error);
        return throwError(() => error);
      }),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  getPublisher(address: string): Observable<PublisherInfo> {
    this.loadingSubject.next(true);
    return from(this.client.getPublisher(address)).pipe(
      tap((info) => this.publisherInfoSubject.next(info)),
      catchError((error) => {
        console.error('Error fetching publisher:', error);
        return throwError(() => error);
      }),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  updatePublisherStats(impressions: number, clicks: number): Observable<string> {
    this.loadingSubject.next(true);
    return from(this.client.updatePublisherStats(impressions, clicks)).pipe(
      catchError((error) => {
        console.error('Error updating publisher stats:', error);
        return throwError(() => error);
      }),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  // Advertiser operations
  registerAdvertiser(name: string, company: string, stakeAmount: bigint): Observable<string> {
    this.loadingSubject.next(true);
    return from(this.client.registerAdvertiser(name, company, stakeAmount)).pipe(
      catchError((error) => {
        console.error('Error registering advertiser:', error);
        return throwError(() => error);
      }),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  getAdvertiser(address: string): Observable<AdvertiserInfo> {
    this.loadingSubject.next(true);
    return from(this.client.getAdvertiser(address)).pipe(
      tap((info) => this.advertiserInfoSubject.next(info)),
      catchError((error) => {
        console.error('Error fetching advertiser:', error);
        return throwError(() => error);
      }),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  // Reputation operations
  slashUser(userAddress: string, amount: bigint, reason: string): Observable<string> {
    this.loadingSubject.next(true);
    return from(this.client.slashUser(userAddress, amount, reason)).pipe(
      catchError((error) => {
        console.error('Error slashing user:', error);
        return throwError(() => error);
      }),
      finalize(() => this.loadingSubject.next(false))
    );
  }
}
