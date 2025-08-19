import { Module, RequestMethod } from '@nestjs/common';
import type { MiddlewareConsumer } from '@nestjs/common/interfaces';

import { TelegramService } from '../libs/telegram/telegram.service';

import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { RawBodyMiddleware } from '@/src/shared/middlewares/raw-body.middleware';
import { NotificationService } from '@/src/modules/notification/notification.service';

@Module({
  controllers: [WebhookController],
  providers: [WebhookService, NotificationService, TelegramService],
})
export class WebhookModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RawBodyMiddleware)
      .forRoutes({ path: 'webhook/livekit', method: RequestMethod.POST });
  }
}
