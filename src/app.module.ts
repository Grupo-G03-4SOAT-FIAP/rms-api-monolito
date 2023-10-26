import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgresConfigService } from './adapters/outbound/database/postgres.config.service';

import { AppController } from './adapters/inbound/rest/v1/controllers/app/app.controller';
import { AppUseCase } from './domain/use_cases/app/app.use_case';

import { ProdutoModel } from './adapters/outbound/models/produto.model';
import { ProdutoController } from './adapters/inbound/rest/v1/controllers/produto/produto.controller';
import { IProdutoUseCase } from './domain/ports/produto/produto.use_case.port';
import { ProdutoUseCase } from './domain/use_cases/produto/produto.use_case';
import { IProdutoRepository } from './domain/ports/produto/produto.repository.port';
import { ProdutoRepository } from './adapters/outbound/repositories/produto/produto.repository';

import { CategoriaModel } from './adapters/outbound/models/categoria.model';
import { CategoriaController } from './adapters/inbound/rest/v1/controllers/categoria/categoria.controller';
import { ICategoriaUseCase } from './domain/ports/categoria/categoria.use_case.port';
import { CategoriaUseCase } from './domain/use_cases/categoria/categoria.use_case';
import { ICategoriaRepository } from './domain/ports/categoria/categoria.repository.port';
import { CategoriaRepository } from './adapters/outbound/repositories/categoria/categoria.repository';
import { PedidoModel } from './adapters/outbound/models/pedido.model';
import { PedidoRepository } from './adapters/outbound/repositories/pedido/pedido.repository';
import { IPedidoRepository } from './domain/ports/pedido/pedido.repository.port';
import { ClienteModel } from './adapters/outbound/models/cliente.model';
import { ClienteRepository } from './adapters/outbound/repositories/cliente/cliente.repository';
import { IClienteRepository } from './domain/ports/cliente/cliente.repository.port';
import { ClienteController } from './adapters/inbound/rest/v1/controllers/cliente/cliente.controller';
import { ClienteUseCase } from './domain/use_cases/cliente/cliente.use_case';
import { IClienteUseCase } from './domain/ports/cliente/cliente.use_case.port';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProdutoModel,
      CategoriaModel,
      PedidoModel,
      ClienteModel
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: PostgresConfigService,
      inject: [PostgresConfigService],
    }),
  ],
  controllers: [AppController, ProdutoController, CategoriaController, ClienteController],
  providers: [
    AppUseCase,
    ProdutoUseCase,
    ProdutoRepository,
    CategoriaUseCase,
    CategoriaRepository,
    PedidoRepository,
    ClienteRepository,
    ClienteUseCase,
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
    {
      provide: IPedidoRepository,
      useClass: PedidoRepository,
    },
    {
      provide: IClienteRepository,
      useClass: ClienteRepository,
    },
    {
      provide: IClienteUseCase,
      useClass: ClienteUseCase,
    },
  ],
})
export class AppModule {}
