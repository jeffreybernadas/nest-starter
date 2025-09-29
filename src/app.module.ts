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
import { APP_INTERCEPTOR, APP_GUARD, APP_FILTER } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import redisConfig from '@/config/redis/redis.config';
import elasticsearchConfig from '@/config/elasticsearch/elasticsearch.config';
import { ApmInit } from '@/utils/apm/apm.util';
import { ElasticInit } from '@/utils/elasticsearch/elasticsearch.util';
import { LoggerModule } from '@/shared/logger/logger.module';
import { ResendModule } from '@/shared/mail/resend.module';
import resendConfig from '@/config/resend/resend.config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { ExceptionsFilter } from '@/filters/exceptions.filter';
import { TransformResponseInterceptor } from '@/interceptors/transform-response.interceptor';
import minioConfig from '@/config/minio/minio.config';
import { NestMinioModule } from '@/shared/storage/minio.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [
        appConfig,
        redisConfig,
        elasticsearchConfig,
        resendConfig,
        minioConfig,
      ],
    }),
    DatabaseModule,
    ApiModule,
    LoggerModule,
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          throttlers: [
            {
              ttl: 60000,
              limit: 150,
            },
          ],
          storage: new ThrottlerStorageRedisService(config.get('redis.url')),
        };
      },
    }),
    GracefulShutdownModule.forRoot({
      cleanup: (...args) => {
        console.log('App shutting down...', args);
      },
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
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
    }),
    ResendModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        apiKey: config.get('resend.apiKey') as string,
      }),
    }),
    NestMinioModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        endPoint: config.get('minio.url') as string,
        port: 443,
        useSSL: true,
        accessKey: config.get('minio.accessKey') as string,
        secretKey: config.get('minio.secretKey') as string,
      }),
    }),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformResponseInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_FILTER,
      useClass: ExceptionsFilter,
    },
    CacheService,
    LoggerService,
    ApmInit,
    ElasticInit,
  ],
  exports: [CacheService, LoggerService],
})
export class AppModule {}
