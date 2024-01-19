import { Injectable } from '@nestjs/common';
import { PedidoEntity } from 'src/domain/entities/pedido/pedido.entity';
import { IPedidoRepository } from 'src/domain/ports/pedido/pedido.repository.port';
import { PedidoModel } from '../../models/pedido.model';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { StatusPedido } from 'src/utils/pedido.enum';
import { ItemPedidoModel } from '../../models/item_pedido.model';

@Injectable()
export class PedidoRepository implements IPedidoRepository {
  constructor(
    @InjectRepository(PedidoModel)
    private readonly pedidoRepository: Repository<PedidoModel>,
    @InjectRepository(ItemPedidoModel)
    private readonly itemPedidoRepository: Repository<ItemPedidoModel>,
  ) {}

  async criarPedido(pedido: PedidoEntity): Promise<PedidoModel> {
    const novoPedido = this.pedidoRepository.create(pedido);
    await this.pedidoRepository.save(novoPedido);

    const itensPedido = novoPedido.itensPedido.map((itemPedido) => {
      const novoItemPedido = this.itemPedidoRepository.create({
        pedido: { id: novoPedido.id },
        produto: { id: itemPedido.produto.id },
        quantidade: itemPedido.quantidade,
      });
      return novoItemPedido;
    });
    await this.itemPedidoRepository.save(itensPedido);

    const pedidoComItens = await this.pedidoRepository.findOne({
      where: { id: novoPedido.id },
      relations: [
        'cliente',
        'itensPedido',
        'itensPedido.produto',
        'itensPedido.produto.categoria',
      ],
    });
    return pedidoComItens;
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
      relations: [
        'cliente',
        'itensPedido',
        'itensPedido.produto',
        'itensPedido.produto.categoria',
      ],
    });
  }

  async buscarPedido(pedidoId: string): Promise<PedidoModel | null> {
    return await this.pedidoRepository.findOne({
      where: { id: pedidoId },
      relations: [
        'cliente',
        'itensPedido',
        'itensPedido.produto',
        'itensPedido.produto.categoria',
      ],
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
      order: {
        statusPedido: 'ASC', // Ordenação alfabética para garantir consistência
        criadoEm: 'ASC', // Ordene por criadoEm em ordem crescente (do mais antigo ao mais recente)
      },
      relations: [
        'cliente',
        'itensPedido',
        'itensPedido.produto',
        'itensPedido.produto.categoria',
      ],
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
      relations: [
        'cliente',
        'itensPedido',
        'itensPedido.produto',
        'itensPedido.produto.categoria',
      ],
    });

    return pedidos;
  }
}
