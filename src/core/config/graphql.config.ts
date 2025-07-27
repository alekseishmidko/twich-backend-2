import { isDev } from '@/src/shared/utils/is-dev.util';
import type { ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
/**
 * Функция возвращает объект конфигурации Apollo для GraphQL-модуля в NestJS.
 * Она использует ConfigService для извлечения нужных значений из .env или другого конфигурационного источника.
 *
 * @param configService - сервис для получения конфигурации из переменных окружения
 * @returns ApolloDriverConfig - объект с настройками GraphQL
 */
export function getGraphQLConfig(
  configService: ConfigService,
): ApolloDriverConfig {
  return {
    // Включить GraphQL Playground (интерфейс для тестирования запросов) только в dev-среде
    playground: isDev(configService),
    // Путь, по которому доступен GraphQL endpoint (например, '/graphq
    path: configService.getOrThrow<string>('GRAPHQL_PREFIX'),
    // Путь, по которому будет автоматически сгенерирована схема GraphQL
    autoSchemaFile: join(process.cwd(), 'src/core/graphql/schema.gql'),
    //Отсортировать поля в схеме по алфавиту — полезно для читаемости и контроля версий
    sortSchema: true,
    // Контекст, передаваемый в каждый запрос GraphQL (например, для доступа к req/res, юзеру и т.д.)
    context: ({ req, res }) => ({ req, res }),
    // Включить поддержку подписок (subscriptions) в GraphQL (например, WebSocket)
    installSubscriptionHandlers: true,
    // Включить introspection — возможность исследовать схему через GraphQL-инструменты
    introspection: true,
  };
}
