import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IS_DEV_ENV } from '@/src/shared/utils/is-dev.util';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { getGraphQLConfig } from '@/src/core/config/graphql.config';
import { RedisModule } from './redis/redis.module';
import { AccountModule } from '@/src/modules/auth/account/account.module';
import { SessionModule } from '@/src/modules/auth/session/session.module';
import { VerificationModule } from '@/src/modules/auth/verification/verification.module';
import { MailModule } from '@/src/modules/libs/mail/mail.module';
import { PasswordRecoveryModule } from '@/src/modules/auth/password-recovery/password-recovery.module';
import { TotpModule } from '@/src/modules/auth/totp/totp/totp.module';
import { DeactivateModule } from '@/src/modules/auth/deactivate/deactivate.module';
import { CronModule } from '@/src/modules/cron/cron.module';
import { StorageModule } from '@/src/modules/libs/storage/storage.module';
import { ProfileModule } from '@/src/modules/auth/profile/profile.module';
import { StreamModule } from '@/src/modules/stream/stream.module';
import { LivekitModule } from '@/src/modules/libs/livekit/livekit.module';
import { getLiveKitConfig } from '@/src/core/config/livekit.config';
import { IngressModule } from '@/src/modules/stream/ingress/ingress.module';
import { WebhookModule } from '@/src/modules/webhook/webhook.module';
import { CategoryModule } from '@/src/modules/category/category.module';
import { ChatModule } from '@/src/modules/chat/chat.module';
import { FollowModule } from '@/src/modules/follow/follow.module';
import { ChannelModule } from '@/src/modules/channel/channel.module';
import { NotificationModule } from '@/src/modules/notification/notification.module';
import { TelegramModule } from '@/src/modules/libs/telegram/telegram.module';
import { getStripeConfig } from '@/src/core/config/stripe.config';
import { StripeModule } from '@/src/modules/libs/stripe/stripe.module';
import { PlanModule } from '@/src/modules/sponsorship/plan/plan.module';
import { SubscriptionModule } from '@/src/modules/sponsorship/subscription/subscription.module';
import { TransactionModule } from '@/src/modules/sponsorship/transaction/transaction.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: !IS_DEV_ENV, // игнорировать .env файл, если не dev-окружение
      isGlobal: true, // сделать ConfigModule доступным глобально
    }),

    GraphQLModule.forRootAsync({
      driver: ApolloDriver, // указываем драйвер Apollo
      imports: [ConfigModule], // импортируем ConfigModule (нужен для получения переменных)
      useFactory: getGraphQLConfig, // используем фабрику для генерации конфигурации
      inject: [ConfigService], // передаём зависимости в useFactory
    }),
    StripeModule.registerAsync({
      imports: [ConfigModule],
      useFactory: getStripeConfig,
      inject: [ConfigService],
    }),
    PrismaModule,
    RedisModule,
    CronModule,
    StorageModule,
    StreamModule,
    IngressModule,
    WebhookModule,
    CategoryModule,
    ChatModule,
    FollowModule,
    ChannelModule,
    NotificationModule,
    TelegramModule,
    CoreModule,
    LivekitModule.registerAsync({
      imports: [ConfigModule],
      useFactory: getLiveKitConfig,
      inject: [ConfigService],
    }),
    PlanModule,
    SubscriptionModule,
    TransactionModule,
    // auth
    AccountModule,
    SessionModule,
    VerificationModule,
    MailModule,
    PasswordRecoveryModule,
    TotpModule,
    DeactivateModule,
    ProfileModule,
  ],
})
export class CoreModule {}
