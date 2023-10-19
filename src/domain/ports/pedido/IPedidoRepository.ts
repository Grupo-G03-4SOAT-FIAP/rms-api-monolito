import { PedidoEntity } from 'src/domain/entities/pedido.entity';
import { PedidoModel } from 'src/adapters/outbound/models/pedido.model';

export interface IPedidoRepository {
  criarPedido(pedido: PedidoEntity): Promise<PedidoModel>;
  editarPedido(pedidoId: string, pedido: PedidoEntity): Promise<PedidoModel>;
  buscarPedido(pedidoId: string): Promise<PedidoModel>;
  listarPedido(): Promise<PedidoModel[]>;
}

export const IPedidoRepository = Symbol('IPedidoRepository');
