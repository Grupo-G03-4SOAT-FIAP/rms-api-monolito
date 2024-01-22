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
  readonly relations = [
    'cliente',
    'itensPedido',
    'itensPedido.produto',
    'itensPedido.produto.categoria',
  ];

  constructor(
    @InjectRepository(PedidoModel)
    private readonly pedidoRepository: Repository<PedidoModel>,
    @InjectRepository(ItemPedidoModel)
    private readonly itemPedidoRepository: Repository<ItemPedidoModel>,
  ) {}

  async criarPedido(pedido: PedidoEntity): Promise<PedidoModel> {
    const pedidoModel = this.pedidoRepository.create(pedido);
    await this.pedidoRepository.save(pedidoModel);

    const itensPedido = pedidoModel.itensPedido.map((itemPedido) => {
      const itemPedidoModel = this.itemPedidoRepository.create({
        pedido: { id: pedidoModel.id },
        produto: { id: itemPedido.produto.id },
        quantidade: itemPedido.quantidade,
      });
      return itemPedidoModel;
    });
    await this.itemPedidoRepository.save(itensPedido);

    const pedidoComItens = await this.pedidoRepository.findOne({
      where: { id: pedidoModel.id },
      relations: this.relations,
    });
    return pedidoComItens;
  }

  async editarStatusPagamento(
    pedidoId: string,
    statusPagamento: boolean,
  ): Promise<PedidoModel> {
    await this.pedidoRepository.update(pedidoId, {
      pago: statusPagamento,
    });

    return await this.pedidoRepository.findOne({
      where: { id: pedidoId },
      relations: this.relations,
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
      relations: this.relations,
    });
  }

  async buscarPedido(pedidoId: string): Promise<PedidoModel | null> {
    return await this.pedidoRepository.findOne({
      where: { id: pedidoId },
      relations: this.relations,
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
      relations: this.relations,
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
      relations: this.relations,
    });

    return pedidos;
  }
}
