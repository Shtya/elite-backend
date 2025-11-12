import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import serverless from 'serverless-http';
import { join } from 'path';
import { QueryFailedErrorFilter } from './common/QueryFailedErrorFilter';

let cachedServer: any;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(app.get(QueryFailedErrorFilter));

  // Serve static files (for uploads)
  app.useStaticAssets(join(__dirname, 'uploads'), { prefix: '/uploads/' });

  await app.init();
  return serverless(app.getHttpAdapter().getInstance());
}

export const handler = async (event: any, context: any) => {
  if (!cachedServer) {
    cachedServer = await bootstrap();
  }
  return cachedServer(event, context);
};
