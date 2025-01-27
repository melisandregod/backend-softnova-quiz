import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, BadRequestException } from '@nestjs/common';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, 
      forbidNonWhitelisted: true, 
      transform: true, 
      exceptionFactory: (errors) => {
        
        const messages = errors.map((error) => ({
          field: error.property,
          message: Object.values(error.constraints || {}).join('. ') + '.',
        }));
        return new BadRequestException({ errors: messages });
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Baan Naay Dinn API')
    .setDescription('API documentation for the Cart system')
    .setVersion('1.0')
    .build();

    app.enableCors();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // เส้นทางของ Swagger UI (http://localhost:3000/api)
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
