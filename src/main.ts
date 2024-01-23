import { NestFactory, Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

// Module
import { AppModule } from './app.module';

// Commons
import { CORS } from './commons/constants';

// Libreries
import * as morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // use librerie morgan
  app.use(morgan('dev'));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.setGlobalPrefix('api/v1/');

  const config = new DocumentBuilder()
    .setTitle('Team dev')
    .setDescription('Official API for the Team Dev platform')
    .setVersion('1.0')
    .addTag('Team Dev')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/docs', app, document);

  app.enableCors(CORS);

  await app.listen(process.env.APP_PORT);
}
bootstrap();
