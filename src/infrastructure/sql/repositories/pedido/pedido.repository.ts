import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { PedidoModel } from '../../models/pedido.model';
import { ItemPedidoModel } from '../../models/item_pedido.model';
import { IPedidoRepository } from 'src/domain/pedido/interfaces/pedido.repository.port';
import { PedidoEntity } from 'src/domain/pedido/entities/pedido.entity';
import { StatusPedido } from 'src/domain/pedido/enums/pedido.enum';
import { IPedidoEntityFactory } from 'src/domain/pedido/interfaces/pedido.entity.factory.port';
import { IClienteEntityFactory } from 'src/domain/cliente/interfaces/cliente.entity.factory.port';

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
    @Inject(IPedidoEntityFactory)
    private readonly pedidoEntityFactory: IPedidoEntityFactory,
    @Inject(IClienteEntityFactory)
    private readonly clienteEntityFactory: IClienteEntityFactory,
  ) {}

  async criarItemPedido(pedidoModel: PedidoModel): Promise<PedidoModel> {
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

  async modelToEntity(pedidoModel: PedidoModel): Promise<PedidoEntity> {
    const clienteEntity = this.clienteEntityFactory.criarEntidadeCliente(
      pedidoModel.cliente.nome,
      pedidoModel.cliente.email,
      pedidoModel.cliente.cpf,
      pedidoModel.cliente.id,
    );
    const itensPedido = pedidoModel.itensPedido.map((itemPedidoModel) => {
      return this.pedidoEntityFactory.criarEntidadeItemPedido(
        itemPedidoModel.produto,
        itemPedidoModel.quantidade,
        itemPedidoModel.id,
      );
    });
    return this.pedidoEntityFactory.criarEntidadePedido(
      itensPedido,
      pedidoModel.statusPedido,
      pedidoModel.numeroPedido,
      pedidoModel.pago,
      clienteEntity,
      pedidoModel.id,
    );
  }

  async criarPedido(pedido: PedidoEntity): Promise<PedidoEntity> {
    const pedidoModel = this.pedidoRepository.create(pedido);
    await this.pedidoRepository.save(pedidoModel);
    const pedidoComItemModel = await this.criarItemPedido(pedidoModel);
    const clienteEntity = this.clienteEntityFactory.criarEntidadeCliente(
      pedidoComItemModel.cliente.nome,
      pedidoComItemModel.cliente.email,
      pedidoComItemModel.cliente.cpf,
      pedidoComItemModel.cliente.id,
    );
    this.pedidoEntityFactory.criarEntidadePedido(
      clienteEntity,
      pedidoComItens.itensPedido,
      pedidoComItens.statusPedido,
      pedidoComItens.pago,
      pedidoComItens.id,
    );
    return pedidoComItens;
  }

  async editarStatusPedido(
    pedidoId: string,
    statusPedido: string,
  ): Promise<PedidoEntity> {
    await this.pedidoRepository.update(pedidoId, {
      statusPedido: statusPedido,
    });

    return await this.pedidoRepository.findOne({
      where: { id: pedidoId },
      relations: this.relations,
    });
  }

  async editarStatusPagamento(
    pedidoId: string,
    statusPagamento: boolean,
  ): Promise<PedidoEntity> {
    await this.pedidoRepository.update(pedidoId, {
      pago: statusPagamento,
    });

    return await this.pedidoRepository.findOne({
      where: { id: pedidoId },
      relations: this.relations,
    });
  }

  async buscarPedido(pedidoId: string): Promise<PedidoEntity | null> {
    return await this.pedidoRepository.findOne({
      where: { id: pedidoId },
      relations: this.relations,
    });
  }

  async listarPedidos(): Promise<PedidoEntity[] | []> {
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

  async listarPedidosRecebido(): Promise<PedidoEntity[] | []> {
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
