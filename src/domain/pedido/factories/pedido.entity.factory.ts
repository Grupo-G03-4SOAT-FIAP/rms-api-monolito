import { Injectable } from '@nestjs/common';
import { IPedidoEntityFactory } from '../interfaces/pedido.entity.factory.port';
import { ClienteEntity } from 'src/domain/cliente/entities/cliente.entity';
import { ItemPedidoEntity } from '../entities/item_pedido.entity';
import { PedidoEntity } from '../entities/pedido.entity';
import { StatusPedido } from '../enums/pedido.enum';
import { ProdutoEntity } from 'src/domain/produto/entities/produto.entity';

@Injectable()
export class PedidoEntityFactory implements IPedidoEntityFactory {
  criarEntidadePedido(
    itensPedido: ItemPedidoEntity[],
    statusPedido: StatusPedido,
    numeroPedido: string,
    pago: boolean,
    cliente?: ClienteEntity,
    id?: string,
  ): PedidoEntity {
    const pedidoEntity = new PedidoEntity(
      itensPedido,
      statusPedido,
      numeroPedido,
      pago,
      cliente,
      id,
    );
    return pedidoEntity;
  }

  criarEntidadeItemPedido(
    produto: ProdutoEntity,
    quantidade: number,
    id?: string,
  ): ItemPedidoEntity {
    const itemPedidoEntity = new ItemPedidoEntity(produto, quantidade, id);
    return itemPedidoEntity;
  }
}
