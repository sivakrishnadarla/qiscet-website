import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { LeadsController } from './leads/leads.controller';
import { LeadsService } from './leads/leads.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 15 }]),
  ],
  controllers: [LeadsController],
  providers: [LeadsService, { provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
