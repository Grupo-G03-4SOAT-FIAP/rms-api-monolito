import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgresConfigService } from './adapters/outbound/database/postgres.config.service';

import { ProdutoService } from './adapters/outbound/repositories/produto.service';
import { ProdutoEntity } from './domain/entities/produto.entity';

import { AppController } from './adapters/inbound/rest/v1/controllers/app/app.controller';
import { AppUseCase } from './domain/use_cases/app/app.use_case';

import { ProdutoController } from './adapters/inbound/rest/v1/controllers/produtos/produtos.controller';
import { ProdutoUseCase } from './domain/use_cases/produtos/produtos.use_case';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProdutoEntity]),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: PostgresConfigService,
      inject: [PostgresConfigService],
    }),
  ],
  controllers: [AppController, ProdutoController],
  providers: [AppUseCase, ProdutoUseCase, ProdutoService],
})
export class AppModule {}
