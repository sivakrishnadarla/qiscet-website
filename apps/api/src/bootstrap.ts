import { INestApplication, ValidationPipe } from '@nestjs/common';

/** Shared setup for the long-running server and the Vercel serverless handler. */
export function createApp(app: INestApplication) {
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: (process.env.CORS_ORIGIN || '*').split(',').map((s) => s.trim()),
    methods: ['GET', 'POST', 'OPTIONS'],
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: false, transform: true, forbidUnknownValues: false }));
  const http = app.getHttpAdapter().getInstance();
  if (http?.set) http.set('trust proxy', 1);
  return app;
}
