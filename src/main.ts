import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './common/logging/winston.logging';
import { AllExceptionsFilter } from './common/errors/error.handling';

async function start() {
  const app = await NestFactory.create(AppModule, {
    // logger: ['error', 'warn']
    logger: WinstonModule.createLogger(winstonConfig)
  });

  app.useGlobalFilters(new AllExceptionsFilter());

  app.use(cookieParser());
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('🏡 Uy-Joy Ijarasi API')
    .setDescription(
      "Bu API uy-joy ijarasi tizimi uchun yaratilgan. U orqali uylarni ro'yxatga olish, ijarachilar bilan ishlash, shartnomalar tuzish va to'lovlarni boshqarish mumkin."
    )
    .setVersion('1.0.0')
    .addTag('Uy-Joy Ijarasi', "Uylar, foydalanuvchilar va ijara jarayonlari bo'yicha API hujjatlari")
    .addBearerAuth({
      type: 'http',
      scheme: 'Bearer',
      bearerFormat: 'JWT',
      in: 'Header',
      description: "Avtorizatsiya uchun token kiriting. Masalan: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`"
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log(`🚀 Server running on: http://localhost:${process.env.PORT ?? 3000}/api`);
  console.log(`📄 Swagger docs: http://localhost:${process.env.PORT ?? 3000}/api/docs`);
}
start();
