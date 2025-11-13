import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { ExpressAdapter } from "@nestjs/platform-express";
import * as express from "express";

const server = express();

export async function createApp() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    })
  );

  await app.init();
  return server;
}

// For Vercel serverless
let cachedServer: express.Express;
export default async function handler(
  req: express.Request,
  res: express.Response
) {
  if (!cachedServer) {
    cachedServer = await createApp();
  }
  return cachedServer(req, res);
}

// For local development
if (process.env.NODE_ENV === "development") {
  createApp().then((app) => {
    app.listen(process.env.PORT || 3000, () => {
      console.log(
        `🚀 Server running on http://localhost:${process.env.PORT || 3000}`
      );
    });
  });
}
