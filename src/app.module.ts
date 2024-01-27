import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgresConfigService } from './infrastructure/sql/database/postgres.config.service';

import { ProdutoModel } from './infrastructure/sql/models/produto.model';
import { CategoriaModel } from './infrastructure/sql/models/categoria.model';
import { PedidoModel } from './infrastructure/sql/models/pedido.model';
import { ItemPedidoModel } from './infrastructure/sql/models/item_pedido.model';
import { ClienteModel } from './infrastructure/sql/models/cliente.model';
import { AppController } from './presentation/rest/v1/controllers/app/app.controller';
import { ProdutoController } from './presentation/rest/v1/controllers/produto/produto.controller';
import { CategoriaController } from './presentation/rest/v1/controllers/categoria/categoria.controller';
import { ClienteController } from './presentation/rest/v1/controllers/cliente/cliente.controller';
import { PedidoController } from './presentation/rest/v1/controllers/pedido/pedido.controller';

import { AppUseCase } from './application/use_cases/app/app.use_case';
import { ProdutoUseCase } from './application/use_cases/produto/produto.use_case';
import { ProdutoRepository } from './infrastructure/sql/repositories/produto/produto.repository';
import { ProdutoFactory } from './domain/produto/factories/produto.factory';
import { ProdutoDTOFactory } from './domain/produto/factories/produto.dto.factory';
import { CategoriaUseCase } from './application/use_cases/categoria/categoria.use_case';
import { CategoriaRepository } from './infrastructure/sql/repositories/categoria/categoria.repository';
import { ClienteUseCase } from './application/use_cases/cliente/cliente.use_case';
import { ClienteRepository } from './infrastructure/sql/repositories/cliente/cliente.repository';
import { ClienteDTOFactory } from './domain/cliente/factories/cliente.dto.factory';
import { PedidoUseCase } from './application/use_cases/pedido/pedido.use_case';
import { PedidoRepository } from './infrastructure/sql/repositories/pedido/pedido.repository';
import { PedidoFactory } from './domain/pedido/factories/pedido.factory';
import { PedidoDTOFactory } from './domain/pedido/factories/pedido.dto.factory';
import { PedidoService } from './domain/pedido/services/pedido.service';

import { IProdutoUseCase } from './domain/produto/interfaces/produto.use_case.port';
import { IProdutoRepository } from './domain/produto/interfaces/produto.repository.port';
import { IProdutoFactory } from './domain/produto/interfaces/produto.factory.port';
import { IProdutoDTOFactory } from './domain/produto/interfaces/produto.dto.factory.port';
import { ICategoriaUseCase } from './domain/categoria/interfaces/categoria.use_case.port';
import { ICategoriaRepository } from './domain/categoria/interfaces/categoria.repository.port';
import { ICategoriaDTOFactory } from './domain/categoria/interfaces/categoria.dto.factory.port';
import { IClienteUseCase } from './domain/cliente/interfaces/cliente.use_case.port';
import { CategoriaDTOFactory } from './domain/categoria/factories/categoria.dto.factory';
import { IClienteRepository } from './domain/cliente/interfaces/cliente.repository.port';
import { IClienteDTOFactory } from './domain/cliente/interfaces/cliente.dto.factory.port';
import { IPedidoUseCase } from './domain/pedido/interfaces/pedido.use_case.port';
import { IPedidoRepository } from './domain/pedido/interfaces/pedido.repository.port';
import { IPedidoFactory } from './domain/pedido/interfaces/pedido.factory.port';
import { IPedidoDTOFactory } from './domain/pedido/interfaces/pedido.dto.factory.port';
import { IGatewayPagamentoService } from './domain/pedido/interfaces/gatewaypag.service.port';
import { GatewayPagamentoService } from './infrastructure/services/gateway_pagamentos/gatewaypag.service';
import { ClienteEntityFactory } from './domain/cliente/factories/cliente.entity.factory';
import { IClienteEntityFactory } from './domain/cliente/interfaces/cliente.entity.factory.port';
import { PedidoEntityFactory } from './domain/pedido/factories/pedido.entity.factory';
import { IPedidoEntityFactory } from './domain/pedido/interfaces/pedido.entity.factory.port';
import { ProdutoEntityFactory } from './domain/produto/factories/produto.entity.factory';
import { IProdutoEntityFactory } from './domain/produto/interfaces/produto.entity.factory.port';
import { CategoriaEntityFactory } from './domain/categoria/factories/categoria.entity.factory';
import { ICategoriaEntityFactory } from './domain/categoria/interfaces/categoria.entity.factory.port';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([
      ProdutoModel,
      CategoriaModel,
      PedidoModel,
      ItemPedidoModel,
      ClienteModel,
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: PostgresConfigService,
      inject: [PostgresConfigService],
    }),
  ],
  controllers: [
    AppController,
    ProdutoController,
    CategoriaController,
    ClienteController,
    PedidoController,
  ],
  providers: [
    AppUseCase,
    ProdutoUseCase,
    ProdutoRepository,
    ProdutoFactory,
    ProdutoDTOFactory,
    CategoriaUseCase,
    CategoriaRepository,
    CategoriaEntityFactory,
    ClienteUseCase,
    ClienteRepository,
    ClienteDTOFactory,
    ClienteEntityFactory,
    PedidoUseCase,
    PedidoRepository,
    PedidoFactory,
    PedidoEntityFactory,
    PedidoDTOFactory,
    PedidoService,
    {
      provide: IProdutoUseCase,
      useClass: ProdutoUseCase,
    },
    {
      provide: IProdutoRepository,
      useClass: ProdutoRepository,
    },
    {
      provide: IProdutoFactory,
      useClass: ProdutoFactory,
    },
    {
      provide: IProdutoEntityFactory,
      useClass: ProdutoEntityFactory,
    },
    {
      provide: IProdutoDTOFactory,
      useClass: ProdutoDTOFactory,
    },
    {
      provide: ICategoriaUseCase,
      useClass: CategoriaUseCase,
    },
    {
      provide: ICategoriaRepository,
      useClass: CategoriaRepository,
    },
    {
      provide: ICategoriaEntityFactory,
      useClass: CategoriaEntityFactory,
    },
    {
      provide: ICategoriaDTOFactory,
      useClass: CategoriaDTOFactory,
    },
    {
      provide: IClienteUseCase,
      useClass: ClienteUseCase,
    },
    {
      provide: IClienteRepository,
      useClass: ClienteRepository,
    },
    {
      provide: IClienteDTOFactory,
      useClass: ClienteDTOFactory,
    },
    {
      provide: IClienteEntityFactory,
      useClass: ClienteEntityFactory,
    },
    {
      provide: IPedidoUseCase,
      useClass: PedidoUseCase,
    },
    {
      provide: IPedidoRepository,
      useClass: PedidoRepository,
    },
    {
      provide: IPedidoFactory,
      useClass: PedidoFactory,
    },
    {
      provide: IPedidoEntityFactory,
      useClass: PedidoEntityFactory,
    },
    {
      provide: IPedidoDTOFactory,
      useClass: PedidoDTOFactory,
    },
    {
      provide: IGatewayPagamentoService,
      useClass: GatewayPagamentoService,
    },
  ],
})
export class AppModule {}
