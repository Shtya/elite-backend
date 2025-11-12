import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import serverless from 'serverless-http';
import { join } from 'path';
import { QueryFailedErrorFilter } from 'src/common/QueryFailedErrorFilter';

let cachedApp: NestExpressApplication;

async function bootstrap() {
  if (cachedApp) return cachedApp;

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(app.get(QueryFailedErrorFilter));

  // Serve static files from uploads
  app.useStaticAssets(join(__dirname, 'uploads'), { prefix: '/uploads/' });

  await app.init();
  cachedApp = app;
  return app;
}

export const handler = async (event: any, context: any) => {
  const app = await bootstrap();
  const server = serverless(app.getHttpAdapter().getInstance());
  return server(event, context);
};
