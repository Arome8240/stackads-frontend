# @stackads/angular

Angular services for the StackAds decentralized advertising platform on Stacks blockchain.

## Installation

```bash
npm install @stackads/angular @stackads/sdk-core @stacks/connect @stacks/transactions
# or
pnpm add @stackads/angular @stackads/sdk-core @stacks/connect @stacks/transactions
# or
yarn add @stackads/angular @stackads/sdk-core @stacks/connect @stacks/transactions
```

## Setup

### 1. Configure in App Module or Standalone App

#### For Module-based Apps

```typescript
// app.module.ts
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
export class AppModule {}
```

#### For Standalone Apps (Angular 17+)

```typescript
// app.config.ts
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
};
```

### 2. Inject Services in Components

```typescript
// app.component.ts
import { Component, OnInit } from '@angular/core';
import { TokenService } from '@stackads/angular';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  template: `
    <div *ngIf="loading$ | async">Loading...</div>
    <div *ngIf="balance$ | async as balance">
      Balance: {{ formatBalance(balance) }} SADS
    </div>
  `,
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
}
```

## Services

### TokenService

Interact with the StackAds token contract.

```typescript
import { Component } from '@angular/core';
import { TokenService } from '@stackads/angular';

@Component({
  selector: 'app-token',
  template: `
    <div class="token-info">
      <h2>Token Balance</h2>
      <div *ngIf="tokenService.loading$ | async">Loading...</div>
      <div *ngIf="tokenService.balance$ | async as balance">
        <p>Balance: {{ tokenService.formatAmount(balance) }} SADS</p>
      </div>
      <button (click)="transfer()">Transfer Tokens</button>
    </div>
  `,
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
}
```

### RegistryService

Manage publisher and advertiser registrations.

```typescript
import { Component } from '@angular/core';
import { RegistryService } from '@stackads/angular';

@Component({
  selector: 'app-registry',
  template: `
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
  `,
})
export class RegistryComponent {
  constructor(public registryService: RegistryService) {}

  ngOnInit() {
    this.registryService
      .getPublisher('ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM')
      .subscribe({
        next: (info) => console.log('Publisher info:', info),
        error: (error) => console.error('Error:', error),
      });
  }

  registerPublisher() {
    this.registryService
      .registerPublisher('My Website', 'https://example.com', 10000000n)
      .subscribe({
        next: (txId) => console.log('Registered:', txId),
        error: (error) => console.error('Registration failed:', error),
      });
  }
}
```

### StakingService

Manage token staking and rewards.

```typescript
import { Component } from '@angular/core';
import { StakingService } from '@stackads/angular';

@Component({
  selector: 'app-staking',
  template: `
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
  `,
})
export class StakingComponent {
  constructor(public stakingService: StakingService) {}

  ngOnInit() {
    this.stakingService
      .getStakeInfo('ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM')
      .subscribe();
  }

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
}
```

### CampaignService

Manage advertising campaigns.

```typescript
import { Component } from '@angular/core';
import { CampaignService } from '@stackads/angular';

@Component({
  selector: 'app-campaign',
  template: `
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
  `,
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
}
```

## Complete Example with RxJS

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  TokenService,
  RegistryService,
  StakingService,
} from '@stackads/angular';
import { combineLatest, Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <h1>StackAds Dashboard</h1>

      <div *ngIf="loading$ | async" class="loading">Loading...</div>

      <div *ngIf="dashboardData$ | async as data" class="content">
        <!-- Token Balance -->
        <section class="card">
          <h2>Token Balance</h2>
          <p class="balance">{{ data.formattedBalance }} SADS</p>
        </section>

        <!-- Publisher Info -->
        <section class="card">
          <h2>Publisher Status</h2>
          <div *ngIf="data.publisher">
            <p>Name: {{ data.publisher.name }}</p>
            <p>Website: {{ data.publisher.website }}</p>
            <p>Reputation: {{ data.publisher.reputation }}</p>
          </div>
        </section>

        <!-- Staking Info -->
        <section class="card">
          <h2>Staking</h2>
          <div *ngIf="data.stakeInfo">
            <p>Staked: {{ data.formattedStake }} SADS</p>
          </div>
        </section>
      </div>
    </div>
  `,
  styles: [
    `
      .dashboard {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
      }
      .content {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1.5rem;
      }
      .card {
        background: white;
        border-radius: 8px;
        padding: 1.5rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      .balance {
        font-size: 2rem;
        font-weight: bold;
        color: #4f46e5;
      }
    `,
  ],
})
export class DashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private userAddress = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';

  loading$ = combineLatest([
    this.tokenService.loading$,
    this.registryService.loading$,
    this.stakingService.loading$,
  ]).pipe(map((loadings) => loadings.some((loading) => loading)));

  dashboardData$ = combineLatest([
    this.tokenService.balance$,
    this.registryService.publisherInfo$,
    this.stakingService.stakeInfo$,
  ]).pipe(
    map(([balance, publisher, stakeInfo]) => ({
      balance,
      formattedBalance: balance ? this.tokenService.formatAmount(balance) : '0',
      publisher,
      stakeInfo,
      formattedStake: stakeInfo
        ? this.stakingService.formatAmount(stakeInfo.amount)
        : '0',
    }))
  );

  constructor(
    private tokenService: TokenService,
    private registryService: RegistryService,
    private stakingService: StakingService
  ) {}

  ngOnInit() {
    // Load all data
    this.tokenService
      .getBalance(this.userAddress)
      .pipe(takeUntil(this.destroy$))
      .subscribe();

    this.registryService
      .getPublisher(this.userAddress)
      .pipe(takeUntil(this.destroy$))
      .subscribe();

    this.stakingService
      .getStakeInfo(this.userAddress)
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

## Using with Signals (Angular 16+)

```typescript
import { Component, OnInit, signal, computed } from '@angular/core';
import { TokenService } from '@stackads/angular';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-token-signals',
  template: `
    <div>
      <p>Balance: {{ formattedBalance() }} SADS</p>
      <p *ngIf="loading()">Loading...</p>
    </div>
  `,
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
}
```

## Dependency Injection

All services use Angular's dependency injection system:

```typescript
import { Injectable } from '@angular/core';
import { TokenService, RegistryService } from '@stackads/angular';

@Injectable({
  providedIn: 'root',
})
export class MyCustomService {
  constructor(
    private tokenService: TokenService,
    private registryService: RegistryService
  ) {}

  async registerAndStake() {
    // Use the services
    this.registryService
      .registerPublisher('My Site', 'https://example.com', 10000000n)
      .subscribe();
  }
}
```

## TypeScript Support

All services are fully typed:

```typescript
import type {
  StackAdsConfig,
  PublisherInfo,
  AdvertiserInfo,
  StakeInfo,
  CampaignInfo,
} from '@stackads/angular';
```

## Error Handling

Handle errors using RxJS operators:

```typescript
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

this.tokenService.getBalance(address).pipe(
  catchError((error) => {
    console.error('Failed to fetch balance:', error);
    // Return a default value or rethrow
    return of(0n);
  })
).subscribe();
```

## Testing

Mock services in your tests:

```typescript
import { TestBed } from '@angular/core/testing';
import { TokenService, STACKADS_CONFIG } from '@stackads/angular';
import { of } from 'rxjs';

describe('MyComponent', () => {
  let tokenService: jasmine.SpyObj<TokenService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('TokenService', ['getBalance']);

    TestBed.configureTestingModule({
      providers: [
        { provide: TokenService, useValue: spy },
        {
          provide: STACKADS_CONFIG,
          useValue: {
            network: 'testnet',
            contractAddress: 'ST1...',
            contractName: 'stackads-token',
          },
        },
      ],
    });

    tokenService = TestBed.inject(TokenService) as jasmine.SpyObj<TokenService>;
  });

  it('should fetch balance', () => {
    tokenService.getBalance.and.returnValue(of(1000000n));
    // Test your component
  });
});
```

## License

MIT
