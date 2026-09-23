import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { AppModule } from './app.module';
import { createApp } from './bootstrap';

let server: express.Express | null = null;

/** Cached Nest app for Vercel’s serverless function (api/index.js). */
export async function getServer() {
  if (server) return server;
  const expressApp = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp), { logger: ['error', 'warn', 'log'] });
  createApp(app);
  await app.init();
  server = expressApp;
  return server;
}
