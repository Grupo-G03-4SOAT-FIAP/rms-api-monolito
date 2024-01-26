import { PedidoEntity } from '../entities/pedido.entity';

export interface IPedidoRepository {
  criarPedido(pedido: PedidoEntity): Promise<PedidoEntity>;
  buscarPedido(pedidoId: string): Promise<PedidoEntity | null>;
  editarStatusPedido(
    pedidoId: string,
    statusPedido: string,
  ): Promise<PedidoEntity | null>;
  editarStatusPagamento(
    pedidoId: string,
    statusPagamento: boolean,
  ): Promise<PedidoEntity | null>;
  listarPedidos(): Promise<PedidoEntity[] | []>;
  listarPedidosRecebido(): Promise<PedidoEntity[] | []>;
}

export const IPedidoRepository = Symbol('IPedidoRepository');
