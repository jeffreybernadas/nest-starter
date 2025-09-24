import { Module } from '@nestjs/common';
import { ApiModule } from '@/modules/api.module';
import { ConfigModule } from '@nestjs/config';
import { GracefulShutdownModule } from 'nestjs-graceful-shutdown';
import appConfig from '@/config/app/app.config';
import { DatabaseModule } from '@/database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [appConfig],
    }),
    DatabaseModule,
    ApiModule,
    GracefulShutdownModule.forRoot({
      cleanup: (...args) => {
        console.log('App shutting down...', args);
      },
    }),
  ],
})
export class AppModule {}
