import { Injectable } from '@nestjs/common';
import { PedidoEntity } from 'src/domain/entities/pedido.entity';
import { IPedidoRepository } from 'src/domain/ports/pedido/IPedidoRepository';
import { PedidoModel } from '../../models/pedido.model';

@Injectable()
export class PedidoRepository implements IPedidoRepository {
  criarPedido(pedido: PedidoEntity): Promise<PedidoModel> {
    throw new Error('Method not implemented.');
  }
  editarPedido(pedidoId: string, pedido: PedidoEntity): Promise<PedidoModel> {
    throw new Error('Method not implemented.');
  }
  buscarPedido(pedidoId: string): Promise<PedidoModel> {
    throw new Error('Method not implemented.');
  }
  listarPedido(): Promise<PedidoModel[]> {
    throw new Error('Method not implemented.');
  }
}
