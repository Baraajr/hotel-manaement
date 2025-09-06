import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1'); // ✅ all routes will start with /api/v1

  const config = new DocumentBuilder()
    .setTitle('Hotel Api')
    .setDescription('Api for booking hotel rooms')
    .setVersion('1.0')
    .addTag('Hotel')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
