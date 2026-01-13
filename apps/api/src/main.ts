import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { ResponseInterceptor } from './common/response.interceptor.js';
import { HttpExceptionFilter } from './common/http-exception.filter.js';
import { RequestContextMiddleware } from './common/request-context.middleware.js';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { RequestContextInterceptor } from './common/request-context.interceptor.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));
  app.use(helmet());
  app.use(cookieParser());
  const corsOrigins =
    process.env.CORS_ORIGIN?.split(',').map((origin) => origin.trim()).filter(Boolean) ?? [];
  app.enableCors({
    origin: corsOrigins.length > 0 ? corsOrigins : false,
    credentials: true
  });
  app.use(new RequestContextMiddleware().use);
  app.useGlobalInterceptors(new RequestContextInterceptor(), new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Main CRM API')
    .setVersion('1.0')
    .setDescription('Main CRM REST API')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config, { openapi: '3.1.0' });
  SwaggerModule.setup('docs', app, document);
  app.use('/docs-json', (_, res) => res.json(document));

  await app.listen(Number(process.env.API_PORT ?? 4000));
}

bootstrap();
