import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgresConfigService } from './adapters/outbound/database/postgres.config.service';

import { AppController } from './adapters/inbound/rest/v1/controllers/app/app.controller';
import { AppUseCase } from './domain/use_cases/app/app.use_case';

import { ProdutoModel } from './adapters/outbound/models/produto.model';
import { ProdutoController } from './adapters/inbound/rest/v1/controllers/produtos/produtos.controller';
import { IProdutoUseCase } from './domain/ports/produto/IProdutoUseCase';
import { ProdutoUseCase } from './domain/use_cases/produtos/produtos.use_case';
import { IProdutoRepository } from './domain/ports/produto/IProdutoRepository';
import { ProdutoRepository } from './adapters/outbound/repositories/produto/produto.repository';

import { CategoriaModel } from './adapters/outbound/models/categoria.model';
import { CategoriaController } from './adapters/inbound/rest/v1/controllers/categorias/categorias.controller';
import { ICategoriaUseCase } from './domain/ports/categoria/ICategoriaUseCase';
import { CategoriaUseCase } from './domain/use_cases/categorias/categorias.use_case';
import { ICategoriaRepository } from './domain/ports/categoria/ICategoriaRepository';
import { CategoriaRepository } from './adapters/outbound/repositories/categoria/categoria.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProdutoModel, CategoriaModel]),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: PostgresConfigService,
      inject: [PostgresConfigService],
    }),
  ],
  controllers: [AppController, ProdutoController, CategoriaController],
  providers: [
    AppUseCase,
    ProdutoUseCase,
    ProdutoRepository,
    CategoriaUseCase,
    CategoriaRepository,
    {
      provide: IProdutoUseCase,
      useClass: ProdutoUseCase,
    },
    {
      provide: IProdutoRepository,
      useClass: ProdutoRepository,
    },
    {
      provide: ICategoriaUseCase,
      useClass: CategoriaUseCase,
    },
    {
      provide: ICategoriaRepository,
      useClass: CategoriaRepository,
    },
  ],
})
export class AppModule {}
