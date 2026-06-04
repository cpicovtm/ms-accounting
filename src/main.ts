import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  type NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import type { EnvironmentVariables } from './shared/config/env.validation';
import { AllExceptionsFilter } from './shared/helpers/http-exception.filter';
import { StandardResponseInterceptor } from './shared/helpers/response.interceptor';

export async function bootstrap(): Promise<NestFastifyApplication> {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.enableCors({ origin: true, methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'] });

  const configService = app.get(ConfigService<EnvironmentVariables, true>);

  // Estandarización de respuesta GLOBAL
  app.useGlobalInterceptors(new StandardResponseInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());

  const globalPrefix =
    configService.get('GLOBAL_PREFIX', { infer: true }) || 'ms-accounting';
  app.setGlobalPrefix(globalPrefix);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.init();

  if (!process.env.VITE) {
    const port = configService.get('PORT', { infer: true });
    await app.listen(port, '0.0.0.0');
  }

  return app;
}

export const viteNodeApp: Promise<NestFastifyApplication> = bootstrap();
