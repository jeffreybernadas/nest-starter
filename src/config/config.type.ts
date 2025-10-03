import { AppConfig } from '@/config/app/app-config.type';
import { RedisConfig } from '@/config/redis/redis-config.type';
import { ElasticSearchConfig } from '@/config/elasticsearch/elasticsearch-config.type';
import { ResendConfig } from '@/config/resend/resend-config.type';
import { MinioStorageConfig } from '@/config/minio/minio-config.type';
import { WebSocketConfig } from '@/config/websocket/websocket-config.type';
import { KeycloakConfig } from '@/config/keycloak/keycloak-config.type';

export type GlobalConfig = {
  app: AppConfig;
  redis: RedisConfig;
  elasticsearch: ElasticSearchConfig;
  resend: ResendConfig;
  minio: MinioStorageConfig;
  websocket: WebSocketConfig;
  keycloak: KeycloakConfig;
};
