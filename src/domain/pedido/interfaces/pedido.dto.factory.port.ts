import { ItemPedidoModel } from "src/infrastructure/sql/models/item_pedido.model";
import { PedidoModel } from "src/infrastructure/sql/models/pedido.model";
import { ItemPedidoDTO } from "src/presentation/rest/v1/presenters/pedido/item_pedido.dto";
import { PedidoDTO } from "src/presentation/rest/v1/presenters/pedido/pedido.dto";

export interface IPedidoDTOFactory {
  criarPedidoDTO(pedido: PedidoModel): PedidoDTO;
  criarListaPedidoDTO(pedidos: PedidoModel[]): PedidoDTO[] | [];
  criarListaItemPedidoDTO(itemPedidos: ItemPedidoModel[]): ItemPedidoDTO[];
}

export const IPedidoDTOFactory = Symbol('IPedidoDTOFactory');
