import {
  CriaItemPedidoDTO,
  ItemPedidoDTO,
} from 'src/presentation/rest/v1/presenters/pedido/item_pedido.dto';
import {
  CriaPedidoDTO,
  PedidoDTO,
} from 'src/presentation/rest/v1/presenters/pedido/pedido.dto';
import { PedidoEntity } from '../entities/pedido.entity';
import { ItemPedidoEntity } from '../entities/item_pedido.entity';

export interface IPedidoDTOFactory {
  criarPedidoDTO(pedido: PedidoEntity): PedidoDTO;
  criarListaPedidoDTO(pedidos: PedidoEntity[]): PedidoDTO[] | [];
  criarListaItemPedidoDTO(itemPedidos: ItemPedidoEntity[]): ItemPedidoDTO[];
  criarItemPedidoDTO(itemPedido: ItemPedidoEntity): ItemPedidoDTO;
  criarCriaPedidoDTO(
    itensPedido: CriaItemPedidoDTO[],
    cpfCliente?: string,
  ): CriaPedidoDTO;
}

export const IPedidoDTOFactory = Symbol('IPedidoDTOFactory');
