import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  const corsOrigin =
    process.env.CORS_ORIGIN?.split(',').map((origin) => origin.trim()) || [];
  app.enableCors({
    origin: corsOrigin,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
  });

  // Setup Swagger
  const config = new DocumentBuilder()
    .setTitle('MO Marketplace API')
    .setDescription('Complete API documentation for MO Marketplace Backend')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT token here for authenticated endpoints',
      },
      'JWT-auth',
    )
    .addTag('Auth', 'Authentication endpoints (register, login, profile)')
    .addTag('Products-Admin', 'Admin operations for products and variants')
    .addTag('Products-Public', 'Public product and variant browsing endpoints')
    .addTag('Attributes-Admin', 'Admin operations for attributes and values')
    .addTag('Orders', 'Order management endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayOperationId: true,
    },
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
