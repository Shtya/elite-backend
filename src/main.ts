import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { QueryFailedErrorFilter } from 'common/QueryFailedErrorFilter';

let cachedApp: NestExpressApplication;

async function createApp(): Promise<NestExpressApplication> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalFilters(app.get(QueryFailedErrorFilter));
  app.useStaticAssets(join(__dirname, '..', '..', '/uploads'), { prefix: '/uploads/' });

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: false,
      transform: true,
      forbidNonWhitelisted: true,
      whitelist: true,
    }),
  );

  await app.init(); // ✅ don’t call listen()
  Logger.log('🚀 NestJS app initialized (serverless mode)');
  return app;
}

/**
 * Vercel serverless handler
 * This replaces app.listen()
 */
export default async function handler(req, res) {
  if (!cachedApp) {
    cachedApp = await createApp();
  }
  const instance = cachedApp.getHttpAdapter().getInstance();
  return instance(req, res);
}

// 👇 For local development only
if (process.env.NODE_ENV !== 'production') {
  createApp().then(app => {
    const port = process.env.PORT || 3030;
    app.listen(port);
    Logger.log(`🚀 Server is running locally on http://localhost:${port}`);
  });
}
