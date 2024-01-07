import {
  AtualizaPedidoDTO,
  CriaPedidoDTO,
  PedidoDTO,
} from 'src/adapters/inbound/rest/v1/presenters/pedido.dto';
import { HTTPResponse } from 'src/utils/HTTPResponse';

export interface IPedidoUseCase {
  criarPedido(pedido: CriaPedidoDTO): Promise<HTTPResponse<PedidoDTO>>;
  editarPedido(
    pedidoId: string,
    pedido: AtualizaPedidoDTO,
  ): Promise<HTTPResponse<PedidoDTO>>;
  buscarPedido(pedidoId: string): Promise<PedidoDTO>;
  listarPedidos(): Promise<PedidoDTO[] | []>;
  listarPedidosRecebido(): Promise<PedidoDTO[] | []>;
}

export const IPedidoUseCase = Symbol('IPedidoUseCase');
