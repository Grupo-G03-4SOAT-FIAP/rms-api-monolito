import { Module } from '@nestjs/common';
import { AppController } from './adapters/inbound/rest/v1/controllers/app.controller';
import { AppService } from './domain/services/app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
