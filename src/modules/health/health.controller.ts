import { PrismaService } from '@/database/database.service';
import { LoggerService } from '@/shared/logger/logger.service';
import { ResendService } from '@/shared/mail/resend.service';
import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  HealthCheckService,
  HealthCheck,
  PrismaHealthIndicator,
  DiskHealthIndicator,
  MemoryHealthIndicator,
} from '@nestjs/terminus';
import { EmailRenderer } from '@/utils/email/email.util';
import { TestEmailTemplateProps } from '@/interfaces/email.interface';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly disk: DiskHealthIndicator,
    private readonly memory: MemoryHealthIndicator,
    private readonly prisma: PrismaHealthIndicator,
    private readonly prismaService: PrismaService,
    private readonly logger: LoggerService,
    private readonly resendService: ResendService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  @HealthCheck()
  async check() {
    this.logger.log('test', 'not test');
    await this.resendService.send({
      from: this.configService.get('resend.sender') as string,
      to:
        (this.configService.get('app.nodeEnv') as string) === 'development'
          ? 'delivered@resend.dev'
          : 'user@domain.com',
      subject: 'hello world',
      html: await EmailRenderer.renderTemplate<TestEmailTemplateProps>(
        'test-email',
        {
          name: 'Health Check User',
          buttonText: 'Visit Dashboard',
          buttonUrl: 'https://your-app.com/dashboard',
        },
      ),
    });
    return this.health.check([
      async () => this.memory.checkHeap('memory_heap', 200 * 1024 * 1024),
      async () => this.memory.checkRSS('memory_rss', 3000 * 1024 * 1024),
      () =>
        this.disk.checkStorage('disk health', {
          thresholdPercent: 0.5,
          path: 'C:\\', // Change to '/' when deployed - this is only for Windows
        }),
      () =>
        this.disk.checkStorage('disk health', {
          threshold: 250 * 1024 * 1024 * 1024,
          path: 'C:\\', // Change to '/' when deployed - this is only for Windows
        }),
      () => this.prisma.pingCheck('prisma', this.prismaService),
    ]);
  }
}
