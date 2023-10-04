import { Module } from '@nestjs/common';
import { HealthCheckController } from './v1/controllers/healthcheck.controller';

@Module({
  imports: [],
  controllers: [HealthCheckController],
  providers: [],
})
export class AppModule {}
