import { Injectable } from '@nestjs/common';
import { PedidoEntity } from 'src/domain/entities/pedido.entity';
import { IPedidoRepository } from 'src/domain/ports/pedido/pedido.repository.port';
import { PedidoModel } from '../../models/pedido.model';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { StatusPedido } from 'src/utils/pedido.enum';

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
      pronto: 1,
      em_preparacao: 2,
      recebido: 3,
    };

    const pedidos = await this.pedidoRepository.find({
      where: {
        statusPedido: In([
          StatusPedido.PRONTO,
          StatusPedido.EM_PREPARACAO,
          StatusPedido.RECEBIDO,
        ]),
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

  async listarPedidosRecebido(): Promise<PedidoModel[] | []> {
    const pedidos = await this.pedidoRepository.find({
      where: {
        statusPedido: StatusPedido.RECEBIDO,
      },
      order: {
        criadoEm: 'ASC', // Ordene por criadoEm em ordem crescente (do mais antigo ao mais recente)
      },
      relations: ['cliente'],
    });

    return pedidos;
  }
}
