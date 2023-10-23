import { Injectable } from '@nestjs/common';
import { PedidoEntity } from 'src/domain/entities/pedido.entity';
import { IPedidoRepository } from 'src/domain/ports/pedido/pedido.repository.port';
import { PedidoModel } from '../../models/pedido.model';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

@Injectable()
export class PedidoRepository implements IPedidoRepository {
  constructor(
    @InjectRepository(PedidoModel)
    private readonly pedidoRepository: Repository<PedidoModel>,
  ) {}

  async criarPedido(pedido: PedidoEntity): Promise<PedidoModel> {
    const novoPedido = this.pedidoRepository.create(pedido);
    await this.pedidoRepository.save(novoPedido);
    return novoPedido;
  }

  async editarStatusPagamento(
    pedidoId: string,
    statusPagamento: string,
  ): Promise<PedidoModel> {
    await this.pedidoRepository.update(pedidoId, {
      statusPagamento: statusPagamento,
    });

    return await this.pedidoRepository.findOne({
      where: { id: pedidoId },
      relations: ['cliente'],
    });
  }

  async editarStatusPedido(
    pedidoId: string,
    statusPedido: string,
  ): Promise<PedidoModel> {
    await this.pedidoRepository.update(pedidoId, {
      statusPedido: statusPedido,
    });

    return await this.pedidoRepository.findOne({
      where: { id: pedidoId },
      relations: ['cliente'],
    });
  }

  async buscarPedido(pedidoId: string): Promise<PedidoModel | null> {
    return await this.pedidoRepository.findOne({
      where: { id: pedidoId },
      relations: ['cliente'],
    });
  }

  async listarPedidos(): Promise<PedidoModel[] | []> {
    const statusPedidoOrder = {
      Pronto: 1,
      'Em preparação': 2,
      Recebido: 3,
    };

    const pedidos = await this.pedidoRepository.find({
      where: {
        statusPagamento: 'Aprovado',
        statusPedido: In(['Pronto', 'Em preparação', 'Recebido']),
      },
      relations: ['cliente'],
    });

    if (pedidos.length > 0) {
      pedidos.sort(
        (a, b) =>
          statusPedidoOrder[a.statusPedido] - statusPedidoOrder[b.statusPedido],
      );
    }

    return pedidos;
  }
}
