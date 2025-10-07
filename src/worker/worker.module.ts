import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheModule } from '@nestjs/cache-manager';
import redisStore from 'cache-manager-redis-store';

// Config imports
import appConfig from '@/config/app/app.config';
import redisConfig from '@/config/redis/redis.config';
import elasticsearchConfig from '@/config/elasticsearch/elasticsearch.config';
import rabbitmqConfig from '@/config/rabbitmq/rabbitmq.config';
import resendConfig from '@/config/resend/resend.config';

// Shared modules
import { DatabaseModule } from '@/database/database.module';
import { LoggerModule } from '@/shared/logger/logger.module';
import { ResendModule } from '@/shared/mail/resend.module';
import { RabbitMQGlobalModule } from '@/shared/queues/rabbitmq-global.module';

// Queue modules
import { EmailQueueModule } from '@/shared/queues/email/email.module';
import { ChatQueueModule } from '@/shared/queues/chat/chat.module';

/**
 * Worker Module
 * Root module for the worker process that handles background tasks
 * - Consumes messages from RabbitMQ queues
 * - Runs scheduled cron jobs
 * - Does NOT expose HTTP endpoints or WebSocket connections
 */
@Module({
  imports: [
    // Global configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [
        appConfig,
        redisConfig,
        elasticsearchConfig,
        rabbitmqConfig,
        resendConfig,
      ],
    }),

    // Scheduling for cron jobs
    ScheduleModule.forRoot(),

    // Cache module (Redis)
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

    // RabbitMQ module (global - provides AmqpConnection to all modules)
    RabbitMQGlobalModule,

    // Resend email service
    ResendModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        apiKey: config.get('resend.apiKey') as string,
      }),
    }),

    // Shared modules
    DatabaseModule,
    LoggerModule,

    // Queue modules (contain consumers and cron jobs)
    EmailQueueModule,
    ChatQueueModule,
  ],
})
export class WorkerModule {}
