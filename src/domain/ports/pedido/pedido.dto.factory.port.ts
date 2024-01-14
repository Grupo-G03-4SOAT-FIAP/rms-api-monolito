import { PedidoDTO } from 'src/adapters/inbound/rest/v1/presenters/pedido.dto';
import { PedidoModel } from 'src/adapters/outbound/models/pedido.model';

export interface IPedidoDTOFactory {
  criarPedidoDTO(pedido: PedidoModel): Promise<PedidoDTO>;
  criarListaPedidoDTO(pedidos: PedidoModel[]): Promise<PedidoDTO[] | []>;
}

export const IPedidoDTOFactory = Symbol('IPedidoDTOFactory');
