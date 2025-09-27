import { Module } from '@nestjs/common';
import { ApiModule } from '@/modules/api.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GracefulShutdownModule } from 'nestjs-graceful-shutdown';
import appConfig from '@/config/app/app.config';
import { DatabaseModule } from '@/database/database.module';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { CacheService } from '@/shared/cache/cache.service';
import { LoggerService } from '@/shared/logger/logger.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import redisConfig from '@/config/redis/redis.config';
import elasticsearchConfig from '@/config/elasticsearch/elasticsearch.config';
import { ApmInit } from '@/utils/apm/apm.util';
import { ElasticInit } from '@/utils/elasticsearch/elasticsearch.util';
import { LoggerModule } from '@/shared/logger/logger.module';
import { ResendModule } from '@/shared/mail/resend.module';
import resendConfig from '@/config/resend/resend.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [appConfig, redisConfig, elasticsearchConfig, resendConfig],
    }),
    DatabaseModule,
    ApiModule,
    LoggerModule,
    GracefulShutdownModule.forRoot({
      cleanup: (...args) => {
        console.log('App shutting down...', args);
      },
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        return {
          store: redisStore,
          host: config.get('redis.host'),
          port: config.get('redis.port'),
          username: config.get('redis.username'),
          password: config.get('redis.password'),
          ttl: 60000,
          no_read_check: true,
        };
      },
      inject: [ConfigService],
    }),
    ResendModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        apiKey: config.get('resend.apiKey') as string,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
    CacheService,
    LoggerService,
    ApmInit,
    ElasticInit,
  ],
  exports: [CacheService, LoggerService],
})
export class AppModule {}
