import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true, limit: '10mb' }));
  app.enableCors({ origin: process.env.CORS_ORIGIN?.split(',') ?? true, credentials: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.setGlobalPrefix('api');

  // Swagger UI tại /api/docs - 2 scheme auth khớp 2 guard đang dùng trong app:
  // "affiliate-jwt" cho endpoint tự phục vụ của affiliate, "merchant-api-key"
  // cho endpoint product backend gọi vào (clicks/conversions).
  const config = new DocumentBuilder()
    .setTitle('Affiliate Platform API')
    .setDescription(
      'Core API cho affiliate platform dùng chung nhiều sản phẩm. ' +
        'Xem docs/ARCHITECTURE.md trong repo để hiểu bối cảnh kiến trúc đầy đủ.',
    )
    .setVersion('0.1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'affiliate-jwt')
    .addApiKey({ type: 'apiKey', name: 'x-merchant-api-key', in: 'header' }, 'merchant-api-key')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 4100);
  console.log(`Affiliate Core API: http://localhost:${process.env.PORT ?? 4100}/api`);
  console.log(`Swagger UI:         http://localhost:${process.env.PORT ?? 4100}/api/docs`);
}
bootstrap();
