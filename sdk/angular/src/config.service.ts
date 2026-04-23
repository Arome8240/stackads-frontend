import { Injectable, InjectionToken } from '@angular/core';
import { StackAdsConfig } from '@stackads/sdk-core';

export const STACKADS_CONFIG = new InjectionToken<StackAdsConfig>('STACKADS_CONFIG');

@Injectable({
  providedIn: 'root',
})
export class StackAdsConfigService {
  constructor() {}

  static forRoot(config: StackAdsConfig) {
    return {
      providers: [
        {
          provide: STACKADS_CONFIG,
          useValue: config,
        },
      ],
    };
  }
}
