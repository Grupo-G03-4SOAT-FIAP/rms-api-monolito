import { PedidoEntity } from 'src/domain/entities/pedido.entity';
import { PedidoModel } from 'src/adapters/outbound/models/pedido.model';

export interface IPedidoRepository {
  criarPedido(pedido: PedidoEntity): Promise<PedidoModel>;
  editarStatusPedido(
    pedidoId: string,
    statusPedido: string,
  ): Promise<PedidoModel | null>;
  buscarPedido(pedidoId: string): Promise<PedidoModel | null>;
  listarPedidos(): Promise<PedidoModel[] | []>;
}

export const IPedidoRepository = Symbol('IPedidoRepository');
