import { NestFactory } from '@nestjs/core';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ENV } from 'environment';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.enableCors();

  app.setGlobalPrefix('api');

  app.enableVersioning();

  const showDocs: boolean = configService.get(ENV.SHOW_DOCS);

  if (showDocs) {
    const config = new DocumentBuilder()
      .setTitle('Finances API')
      .setDescription('The Finances API description')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('docs', app, document, {
      useGlobalPrefix: false,
    });
  }

  const port = configService.get(ENV.PORT);
  const env = configService.get(ENV.ENV);

  await app.listen(port);

  listRoutes(app);

  Logger.log(`App running on port ${port} in ${env} env `, 'Bootstrap');
}
bootstrap();

function listRoutes(app: INestApplication) {
  const server = app.getHttpServer();
  const router = server._events.request._router;
  const availableRoutes: [] = router?.stack
    .filter((layer) => !!layer.route)
    .map((layer) => ({
      route: {
        path: layer.route?.path,
        method: layer.route?.stack[0]?.method,
      },
    }));

  Logger.log('API list:', 'Bootstrap');
  console.table(availableRoutes);
}
