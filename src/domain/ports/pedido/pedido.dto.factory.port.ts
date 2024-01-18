import { ItemPedidoDTO } from 'src/adapters/inbound/rest/v1/presenters/item_pedido.dto';
import { PedidoDTO } from 'src/adapters/inbound/rest/v1/presenters/pedido.dto';
import { ItemPedidoModel } from 'src/adapters/outbound/models/item_pedido.model';
import { PedidoModel } from 'src/adapters/outbound/models/pedido.model';

export interface IPedidoDTOFactory {
  criarPedidoDTO(pedido: PedidoModel): Promise<PedidoDTO>;
  criarListaPedidoDTO(pedidos: PedidoModel[]): Promise<PedidoDTO[] | []>;
  criarListaItemPedidoDTO(
    itemPedidos: ItemPedidoModel[],
  ): Promise<ItemPedidoDTO[]>;
}

export const IPedidoDTOFactory = Symbol('IPedidoDTOFactory');
