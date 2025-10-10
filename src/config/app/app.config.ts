import { registerAs } from '@nestjs/config';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
} from 'class-validator';
import { kebabCase } from 'lodash';
import { AppConfig } from '@/config/app/app-config.type';
import { Environment } from '@/constants/app.constant';
import validateConfig from '@/utils/config/validate-config.util';

class EnvironmentVariablesValidator {
  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV: typeof Environment;

  @IsBoolean()
  @IsOptional()
  IS_HTTPS: boolean;

  @IsString()
  @IsNotEmpty()
  APP_NAME: string;

  @IsUrl({ require_tld: false })
  @IsOptional()
  APP_URL: string;

  @IsInt()
  @Min(0)
  @Max(65535)
  @IsNotEmpty()
  APP_PORT: number;

  @IsInt()
  @Min(0)
  @Max(65535)
  @IsOptional()
  PORT: number;
}

export function getConfig(): AppConfig {
  const port = parseInt(process.env.APP_PORT as string, 10);

  return {
    nodeEnv: (process.env.NODE_ENV ?? Environment.Development) as Environment,
    isHttps: process.env.IS_HTTPS === 'true',
    name: process.env.APP_NAME as string,
    appPrefix: kebabCase(process.env.APP_NAME ?? 'nest-starter'),
    url: process.env.APP_URL ?? `http://localhost:${port}`,
    port,
  };
}

export default registerAs<AppConfig>('app', () => {
  console.info(`Registering AppConfig from environment variables`);
  validateConfig(process.env, EnvironmentVariablesValidator);
  return getConfig();
});
