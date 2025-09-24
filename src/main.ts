import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import helmet from 'helmet';
import { setupGracefulShutdown } from 'nestjs-graceful-shutdown';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { GlobalConfig } from '@/config/config.type';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const configService = app.get(ConfigService<GlobalConfig>);
  const env = configService.getOrThrow('app.nodeEnv', { infer: true });

  app.use(helmet());

  if (env !== 'local') {
    setupGracefulShutdown({ app });
  }

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((error) => {
  console.error('Failed to start the application:', error);
  process.exit(1);
});
