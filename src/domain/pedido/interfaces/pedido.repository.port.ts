import { PedidoModel } from "src/infrastructure/sql/models/pedido.model";
import { PedidoEntity } from "../entities/pedido.entity";

export interface IPedidoRepository {
  criarPedido(pedido: PedidoEntity): Promise<PedidoModel>;
  buscarPedido(pedidoId: string): Promise<PedidoModel | null>;
  editarStatusPedido(
    pedidoId: string,
    statusPedido: string,
  ): Promise<PedidoModel | null>;
  editarStatusPagamento(
    pedidoId: string,
    statusPagamento: boolean,
  ): Promise<PedidoModel | null>;
  listarPedidos(): Promise<PedidoModel[] | []>;
  listarPedidosRecebido(): Promise<PedidoModel[] | []>;
}

export const IPedidoRepository = Symbol('IPedidoRepository');
