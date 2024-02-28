import { CriaItemPedidoDTO } from '../../../presentation/rest/v1/presenters/pedido/item_pedido.dto';

export interface IItemPedidoDTOFactory {
  criarItemPedidoDTO(produto: string, quantidade: number): CriaItemPedidoDTO;
}

export const IItemPedidoDTOFactory = Symbol('IItemPedidoDTOFactory');
