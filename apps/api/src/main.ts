import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ origin: process.env.WEB_URL || 'http://localhost:3000' });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle('codewatch API')
    .setDescription('AI-powered code review platform')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  SwaggerModule.setup('api', app, SwaggerModule.createDocument(app, config));

  await app.listen(process.env.PORT || 3001);
  console.log(`🔍 codewatch API running on http://localhost:${process.env.PORT || 3001}`);
  console.log(`📖 Swagger docs at http://localhost:${process.env.PORT || 3001}/api`);
}
bootstrap();
