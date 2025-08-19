import type { ConfigService } from '@nestjs/config';

import type { TypeStripeOptions } from '@/src/modules/libs/stripe/types/stripe.types';

export function getStripeConfig(
  configService: ConfigService,
): TypeStripeOptions {
  return {
    apiKey: configService.getOrThrow<string>('STRIPE_SECRET_KEY'),
    config: {
      apiVersion: '2025-07-30.basil',
    },
  };
}
