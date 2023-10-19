import { Injectable } from '@nestjs/common';
import { PedidoEntity } from 'src/domain/entities/pedido.entity';
import { IPedidoRepository } from 'src/domain/ports/pedido/IPedidoRepository';
import { PedidoModel } from '../../models/pedido.model';

@Injectable()
export class PedidoRepository implements IPedidoRepository {
  async criarPedido(pedido: PedidoEntity) {}
  async editarPedido(pedidoId: string, pedido: PedidoEntity) {}
  async buscarPedido(pedidoId: string) {}
  async listarPedido() {}
}
