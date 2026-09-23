import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createApp } from './bootstrap';

async function start() {
  const app = await NestFactory.create(AppModule);
  createApp(app);
  const port = Number(process.env.PORT || 4000);
  await app.listen(port, '0.0.0.0');
  // eslint-disable-next-line no-console
  console.log(`QISCET API listening on http://0.0.0.0:${port}/api/health`);
}

start();
