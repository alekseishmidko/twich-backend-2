import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IS_DEV_ENV } from '@/src/shared/utils/is-dev.util';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { getGraphQLConfig } from '@/src/core/config/graphql.config';
import { RedisModule } from './redis/redis.module';
import { AccountModule } from '@/src/modules/auth/account/account.module';

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

    PrismaModule,
    RedisModule,
    AccountModule,
  ],
})
export class CoreModule {}
