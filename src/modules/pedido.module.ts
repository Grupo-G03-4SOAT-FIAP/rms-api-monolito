import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PedidoUseCase } from '../application/use_cases/pedido/pedido.use_case';
import { PedidoDTOFactory } from '../domain/pedido/factories/pedido.dto.factory';
import { PedidoFactory } from '../domain/pedido/factories/pedido.factory';
import { IPedidoDTOFactory } from '../domain/pedido/interfaces/pedido.dto.factory.port';
import { IPedidoFactory } from '../domain/pedido/interfaces/pedido.factory.port';
import { IPedidoRepository } from '../domain/pedido/interfaces/pedido.repository.port';
import { IPedidoUseCase } from '../domain/pedido/interfaces/pedido.use_case.port';
import { PedidoModel } from '../infrastructure/sql/models/pedido.model';
import { PedidoRepository } from '../infrastructure/sql/repositories/pedido/pedido.repository';
import { PedidoController } from '../presentation/rest/v1/controllers/pedido/pedido.controller';
import { IGatewayPagamentoService } from '../domain/pedido/interfaces/gatewaypag.service.port';
import { GatewayMercadoPagoService } from '../infrastructure/services/gateway_pagamentos/gatewaypag.service';
import { SQLDTOFactory } from '../infrastructure/sql/factories/sql.dto.factory';
import { ItemPedidoModel } from '../infrastructure/sql/models/item_pedido.model';
import { ProdutoModule } from './produto.module';
import { ClienteModule } from './client.module';
import { PedidoService } from '../domain/pedido/services/pedido.service';
import { AuthenticationGuard } from '@nestjs-cognito/auth';

@Module({
  imports: [
    ProdutoModule,
    ClienteModule,
    TypeOrmModule.forFeature([PedidoModel, ItemPedidoModel])
  ],
  controllers: [PedidoController],
  providers: [
    PedidoUseCase,
    {
      provide: IPedidoUseCase,
      useClass: PedidoUseCase,
    },
    PedidoRepository,
    {
      provide: IPedidoRepository,
      useClass: PedidoRepository,
    },
    PedidoDTOFactory,
    {
      provide: IPedidoDTOFactory,
      useClass: PedidoDTOFactory,
    },
    PedidoFactory,
    {
      provide: IPedidoFactory,
      useClass: PedidoFactory,
    },
    GatewayMercadoPagoService,
    {
      provide: IGatewayPagamentoService,
      useClass: GatewayMercadoPagoService,
    },
    SQLDTOFactory,
    PedidoService,
    AuthenticationGuard
  ],
  exports: [],
})
export class PedidoModule { }
