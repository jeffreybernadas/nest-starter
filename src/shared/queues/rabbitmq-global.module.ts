import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { QUEUE_EXCHANGES } from './constants/queue.constant';

/**
 * Global RabbitMQ Module
 * Wraps RabbitMQModule.forRootAsync() with @Global() decorator
 * This makes AmqpConnection available to all modules without explicit imports
 */
@Global()
@Module({
  imports: [
    RabbitMQModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get('rabbitmq.uri') as string,
        exchanges: [
          {
            name: QUEUE_EXCHANGES.EMAIL,
            type: 'topic',
          },
          {
            name: QUEUE_EXCHANGES.CHAT,
            type: 'topic',
          },
        ],
        channels: {
          'channel-1': {
            prefetchCount: 10,
            default: true,
          },
        },
        connectionInitOptions: { wait: false },
      }),
    }),
  ],
  exports: [RabbitMQModule],
})
export class RabbitMQGlobalModule {}
