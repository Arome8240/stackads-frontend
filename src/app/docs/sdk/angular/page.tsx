export default function AngularSDKPage() {
  return (
    <div className="prose">
      <h1>Angular SDK</h1>
      <p className="lead">
        Angular services for the StackAds decentralized advertising platform on Stacks blockchain with RxJS observables.
      </p>

      <h2>Installation</h2>
      <pre><code>{`npm install @stackads/angular @stackads/sdk-core
# or
pnpm add @stackads/angular @stackads/sdk-core`}</code></pre>

      <h2>Setup</h2>
      
      <h3>For Module-based Apps</h3>
      <pre><code>{`// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { StackAdsConfigService } from '@stackads/angular';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule],
  providers: [
    ...StackAdsConfigService.forRoot({
      network: 'testnet', // or 'mainnet'
      contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      contractName: 'stackads-token',
    }).providers,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}`}</code></pre>

      <h3>For Standalone Apps (Angular 17+)</h3>
      <pre><code>{`// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { StackAdsConfigService } from '@stackads/angular';

export const appConfig: ApplicationConfig = {
  providers: [
    ...StackAdsConfigService.forRoot({
      network: 'testnet',
      contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      contractName: 'stackads-token',
    }).providers,
  ],
};`}</code></pre>

      <h3>Inject Services in Components</h3>
      <pre><code>{`// app.component.ts
import { Component, OnInit } from '@angular/core';
import { TokenService } from '@stackads/angular';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  template: \`
    <div *ngIf="loading$ | async">Loading...</div>
    <div *ngIf="balance$ | async as balance">
      Balance: {{ formatBalance(balance) }} SADS
    </div>
  \`,
})
export class AppComponent implements OnInit {
  loading$ = this.tokenService.loading$;
  balance$ = this.tokenService.balance$;

  constructor(private tokenService: TokenService) {}

  ngOnInit() {
    this.tokenService
      .getBalance('ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM')
      .subscribe();
  }

  formatBalance(balance: bigint): string {
    return this.tokenService.formatAmount(balance);
  }
}`}</code></pre>

      <h2>Services</h2>

      <h3>TokenService</h3>
      <p>Interact with the StackAds token contract.</p>
      <pre><code>{`import { Component } from '@angular/core';
import { TokenService } from '@stackads/angular';

@Component({
  selector: 'app-token',
  template: \`
    <div class="token-info">
      <h2>Token Balance</h2>
      <div *ngIf="tokenService.loading$ | async">Loading...</div>
      <div *ngIf="tokenService.balance$ | async as balance">
        <p>Balance: {{ tokenService.formatAmount(balance) }} SADS</p>
      </div>
      <button (click)="transfer()">Transfer Tokens</button>
    </div>
  \`,
})
export class TokenComponent {
  constructor(public tokenService: TokenService) {}

  ngOnInit() {
    this.tokenService
      .getBalance('ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM')
      .subscribe({
        next: (balance) => console.log('Balance:', balance),
        error: (error) => console.error('Error:', error),
      });
  }

  transfer() {
    this.tokenService
      .transfer(
        'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG',
        1000000n, // 1 SADS
        'Payment'
      )
      .subscribe({
        next: (txId) => console.log('Transaction ID:', txId),
        error: (error) => console.error('Transfer failed:', error),
      });
  }
}`}</code></pre>

      <h3>RegistryService</h3>
      <p>Manage publisher and advertiser registrations.</p>
      <pre><code>{`import { Component } from '@angular/core';
import { RegistryService } from '@stackads/angular';

@Component({
  selector: 'app-registry',
  template: \`
    <div class="registry">
      <h2>Publisher Registration</h2>
      <div *ngIf="registryService.loading$ | async">Loading...</div>
      <div *ngIf="registryService.publisherInfo$ | async as publisher">
        <p>Name: {{ publisher.name }}</p>
        <p>Website: {{ publisher.website }}</p>
        <p>Reputation: {{ publisher.reputation }}</p>
      </div>
      <button (click)="registerPublisher()">Register as Publisher</button>
    </div>
  \`,
})
export class RegistryComponent {
  constructor(public registryService: RegistryService) {}

  registerPublisher() {
    this.registryService
      .registerPublisher('My Website', 'https://example.com', 10000000n)
      .subscribe({
        next: (txId) => console.log('Registered:', txId),
        error: (error) => console.error('Registration failed:', error),
      });
  }
}`}</code></pre>

      <h3>StakingService</h3>
      <p>Manage token staking and rewards.</p>
      <pre><code>{`import { Component } from '@angular/core';
import { StakingService } from '@stackads/angular';

@Component({
  selector: 'app-staking',
  template: \`
    <div class="staking">
      <h2>Staking Dashboard</h2>
      <div *ngIf="stakingService.loading$ | async">Loading...</div>
      <div *ngIf="stakingService.stakeInfo$ | async as stakeInfo">
        <p>Staked: {{ stakingService.formatAmount(stakeInfo.amount) }} SADS</p>
        <p>Rewards: {{ stakingService.formatAmount(stakeInfo.rewards) }} SADS</p>
      </div>
      <button (click)="stake()">Stake 5 SADS</button>
      <button (click)="claimRewards()">Claim Rewards</button>
    </div>
  \`,
})
export class StakingComponent {
  constructor(public stakingService: StakingService) {}

  stake() {
    this.stakingService.stake(5000000n).subscribe({
      next: (txId) => console.log('Staked:', txId),
      error: (error) => console.error('Staking failed:', error),
    });
  }

  claimRewards() {
    this.stakingService.claimRewards().subscribe({
      next: (txId) => console.log('Claimed:', txId),
      error: (error) => console.error('Claim failed:', error),
    });
  }
}`}</code></pre>

      <h3>CampaignService</h3>
      <p>Manage advertising campaigns.</p>
      <pre><code>{`import { Component } from '@angular/core';
import { CampaignService } from '@stackads/angular';

@Component({
  selector: 'app-campaign',
  template: \`
    <div class="campaign">
      <h2>Campaign Management</h2>
      <div *ngIf="campaignService.loading$ | async">Loading...</div>
      <div *ngIf="campaignService.campaignInfo$ | async as campaign">
        <p>Name: {{ campaign.name }}</p>
        <p>Budget: {{ campaign.budget }}</p>
        <p>Status: {{ campaign.active ? 'Active' : 'Paused' }}</p>
      </div>
      <button (click)="createCampaign()">Create Campaign</button>
    </div>
  \`,
})
export class CampaignComponent {
  constructor(public campaignService: CampaignService) {}

  createCampaign() {
    this.campaignService
      .createCampaign(
        'Summer Sale 2024',
        50000000n, // 50 SADS budget
        100000n, // 0.1 SADS per click
        30 // 30 days
      )
      .subscribe({
        next: (txId) => console.log('Campaign created:', txId),
        error: (error) => console.error('Creation failed:', error),
      });
  }
}`}</code></pre>

      <h2>Using with Signals (Angular 16+)</h2>
      <pre><code>{`import { Component, OnInit, signal, computed } from '@angular/core';
import { TokenService } from '@stackads/angular';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-token-signals',
  template: \`
    <div>
      <p>Balance: {{ formattedBalance() }} SADS</p>
      <p *ngIf="loading()">Loading...</p>
    </div>
  \`,
})
export class TokenSignalsComponent implements OnInit {
  balance = toSignal(this.tokenService.balance$, { initialValue: null });
  loading = toSignal(this.tokenService.loading$, { initialValue: false });

  formattedBalance = computed(() => {
    const bal = this.balance();
    return bal ? this.tokenService.formatAmount(bal) : '0';
  });

  constructor(private tokenService: TokenService) {}

  ngOnInit() {
    this.tokenService
      .getBalance('ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM')
      .subscribe();
  }
}`}</code></pre>

      <h2>TypeScript Support</h2>
      <p>All services are fully typed:</p>
      <pre><code>{`import type {
  StackAdsConfig,
  PublisherInfo,
  AdvertiserInfo,
  StakeInfo,
  CampaignInfo,
} from '@stackads/angular';`}</code></pre>

      <h2>Error Handling</h2>
      <p>Handle errors using RxJS operators:</p>
      <pre><code>{`import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

this.tokenService.getBalance(address).pipe(
  catchError((error) => {
    console.error('Failed to fetch balance:', error);
    return of(0n);
  })
).subscribe();`}</code></pre>
    </div>
  );
}
