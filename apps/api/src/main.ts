import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { ResponseInterceptor } from './common/response.interceptor.js';
import { HttpExceptionFilter } from './common/http-exception.filter.js';
import { RequestContextMiddleware } from './common/request-context.middleware.js';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.use(cookieParser());
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') ?? '*',
    credentials: true
  });
  app.use(new RequestContextMiddleware().use);
  app.useGlobalInterceptors(new ResponseInterceptor());
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
