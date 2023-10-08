import { Module } from '@nestjs/common';
import { AppController } from './adapters/inbound/rest/v1/controllers/app/app.controller';
import { AppUseCase } from './domain/use_cases/app/app.use_case';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppUseCase],
})
export class AppModule {}
