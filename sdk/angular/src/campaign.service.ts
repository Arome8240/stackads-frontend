import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject, Observable, from, throwError } from 'rxjs';
import { catchError, tap, finalize } from 'rxjs/operators';
import { TreasuryClient, CampaignInfo } from '@stackads/sdk-core';
import { STACKADS_CONFIG } from './config.service';
import type { StackAdsConfig } from '@stackads/sdk-core';

@Injectable({
  providedIn: 'root',
})
export class CampaignService {
  private client: TreasuryClient;
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private campaignInfoSubject = new BehaviorSubject<CampaignInfo | null>(null);
  private campaignsSubject = new BehaviorSubject<CampaignInfo[]>([]);

  public loading$ = this.loadingSubject.asObservable();
  public campaignInfo$ = this.campaignInfoSubject.asObservable();
  public campaigns$ = this.campaignsSubject.asObservable();

  constructor(@Inject(STACKADS_CONFIG) private config: StackAdsConfig) {
    this.client = new TreasuryClient(config);
  }

  createCampaign(
    name: string,
    budget: bigint,
    costPerClick: bigint,
    duration: number
  ): Observable<string> {
    this.loadingSubject.next(true);
    return from(this.client.createCampaign(name, budget, costPerClick, duration)).pipe(
      catchError((error) => {
        console.error('Error creating campaign:', error);
        return throwError(() => error);
      }),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  getCampaign(campaignId: number): Observable<CampaignInfo> {
    this.loadingSubject.next(true);
    return from(this.client.getCampaign(campaignId)).pipe(
      tap((info) => this.campaignInfoSubject.next(info)),
      catchError((error) => {
        console.error('Error fetching campaign:', error);
        return throwError(() => error);
      }),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  fundCampaign(campaignId: number, amount: bigint): Observable<string> {
    this.loadingSubject.next(true);
    return from(this.client.fundCampaign(campaignId, amount)).pipe(
      catchError((error) => {
        console.error('Error funding campaign:', error);
        return throwError(() => error);
      }),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  pauseCampaign(campaignId: number): Observable<string> {
    this.loadingSubject.next(true);
    return from(this.client.pauseCampaign(campaignId)).pipe(
      catchError((error) => {
        console.error('Error pausing campaign:', error);
        return throwError(() => error);
      }),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  resumeCampaign(campaignId: number): Observable<string> {
    this.loadingSubject.next(true);
    return from(this.client.resumeCampaign(campaignId)).pipe(
      catchError((error) => {
        console.error('Error resuming campaign:', error);
        return throwError(() => error);
      }),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  recordImpression(campaignId: number, publisherAddress: string): Observable<string> {
    this.loadingSubject.next(true);
    return from(this.client.recordImpression(campaignId, publisherAddress)).pipe(
      catchError((error) => {
        console.error('Error recording impression:', error);
        return throwError(() => error);
      }),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  recordClick(campaignId: number, publisherAddress: string): Observable<string> {
    this.loadingSubject.next(true);
    return from(this.client.recordClick(campaignId, publisherAddress)).pipe(
      catchError((error) => {
        console.error('Error recording click:', error);
        return throwError(() => error);
      }),
      finalize(() => this.loadingSubject.next(false))
    );
  }
}
