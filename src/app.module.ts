import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
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
import { PedidoController } from './adapters/inbound/rest/v1/controllers/pedido/pedido.controller';
import { PedidoUseCase } from './domain/use_cases/pedido/pedido.use_case';
import { IPedidoUseCase } from './domain/ports/pedido/pedido.use_case.port';
import { PedidoFactory } from './domain/factories/pedido/pedido.factory';
import { IPedidoFactory } from './domain/ports/pedido/pedido.factory.port';
import { IProdutoFactory } from './domain/ports/produto/produto.factory.port';
import { ProdutoFactory } from './domain/factories/produto/produto.factory';
import { PedidoService } from './domain/services/pedido.service';
import { IGatewayPagamentoService } from './domain/ports/pedido/gatewaypag.service.port';
import { GatewayPagamentoService } from './adapters/outbound/services/gatewaypag.service';
import { PedidoDTOFactory } from './domain/factories/pedido/pedido.dto.factory';
import { IPedidoDTOFactory } from './domain/ports/pedido/pedido.dto.factory.port';
import { IProdutoDTOFactory } from './domain/ports/produto/produto.dto.factory.port';
import { ProdutoDTOFactory } from './domain/factories/produto/produto.dto.factory';
import { ICategoriaDTOFactory } from './domain/ports/categoria/categoria.dto.factory.port';
import { CategoriaDTOFactory } from './domain/factories/categoria/categoria.dto.factory';
import { IClienteDTOFactory } from './domain/ports/cliente/cliente.dto.factory.port';
import { ClienteDTOFactory } from './domain/factories/cliente/cliente.dto.factory';
import { ItemPedidoModel } from './adapters/outbound/models/item_pedido.model';

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
    ClienteUseCase,
    ClienteRepository,
    ClienteDTOFactory,
    PedidoUseCase,
    PedidoRepository,
    PedidoFactory,
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
