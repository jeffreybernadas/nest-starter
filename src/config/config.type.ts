import { AppConfig } from '@/config/app/app-config.type';
import { RedisConfig } from '@/config/redis/redis-config.type';
import { ElasticSearchConfig } from '@/config/elasticsearch/elasticsearch-config.type';
import { ResendConfig } from '@/config/resend/resend-config.type';

export type GlobalConfig = {
  app: AppConfig;
  redis: RedisConfig;
  elasticsearch: ElasticSearchConfig;
  resend: ResendConfig;
};
