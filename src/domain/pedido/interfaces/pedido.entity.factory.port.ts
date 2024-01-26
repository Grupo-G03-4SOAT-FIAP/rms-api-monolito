import { ClienteEntity } from 'src/domain/cliente/entities/cliente.entity';
import { PedidoEntity } from '../entities/pedido.entity';
import { StatusPedido } from '../enums/pedido.enum';
import { ItemPedidoEntity } from '../entities/item_pedido.entity';
import { ProdutoEntity } from 'src/domain/produto/entities/produto.entity';

export interface IPedidoEntityFactory {
  criarEntidadePedido(
    itensPedido: ItemPedidoEntity[],
    statusPedido: StatusPedido,
    numeroPedido: string,
    pago: boolean,
    cliente?: ClienteEntity,
    id?: string,
  ): PedidoEntity;

  criarEntidadeItemPedido(
    produto: ProdutoEntity,
    quantidade: number,
    id?: string,
  ): ItemPedidoEntity;
}

export const IPedidoEntityFactory = Symbol('IPedidoEntityFactory');
