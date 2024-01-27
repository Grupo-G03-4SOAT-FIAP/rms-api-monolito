import { Injectable } from '@nestjs/common';
import { ClienteEntity } from 'src/domain/cliente/entities/cliente.entity';
import { ItemPedidoEntity } from 'src/domain/pedido/entities/item_pedido.entity';
import { PedidoEntity } from 'src/domain/pedido/entities/pedido.entity';
import { StatusPedido } from 'src/domain/pedido/enums/pedido.enum';
import { IPedidoEntityFactory } from 'src/domain/pedido/interfaces/pedido.entity.factory.port';
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
    criadoEm?: string,
    atualizadoEm?: string,
  ): PedidoEntity {
    const pedidoEntity = new PedidoEntity(
      itensPedido,
      statusPedido,
      numeroPedido,
      pago,
      cliente,
      id,
      criadoEm,
      atualizadoEm,
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
