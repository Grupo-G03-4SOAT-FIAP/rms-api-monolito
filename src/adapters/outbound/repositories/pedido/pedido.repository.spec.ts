import { getRepositoryToken } from '@nestjs/typeorm';
import { PedidoRepository } from './pedido.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { PedidoModel } from '../../models/pedido.model';
import { In } from 'typeorm';
import { StatusPedido } from 'src/utils/pedido.enum';
import {
  pedidoModelMock,
  pedidoEntityMock,
  pedidoTypeORMMock,
} from 'src/mocks/pedido.mock';
import { ItemPedidoModel } from '../../models/item_pedido.model';
import {
  itemPedidoModelMock,
  itemPedidoTypeORMMock,
} from 'src/mocks/item_pedido.mock';

describe('PedidoRepository', () => {
  let pedidoRepository: PedidoRepository;
  let pedidoId: string;
  let relations: string[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PedidoRepository,
        {
          provide: getRepositoryToken(PedidoModel),
          useValue: pedidoTypeORMMock,
        },
        {
          provide: getRepositoryToken(ItemPedidoModel),
          useValue: itemPedidoTypeORMMock,
        },
      ],
    }).compile();

    pedidoRepository = module.get<PedidoRepository>(PedidoRepository);
    pedidoId = '0a14aa4e-75e7-405f-8301-81f60646c93d';
    relations = [
      'cliente',
      'itensPedido',
      'itensPedido.produto',
      'itensPedido.produto.categoria',
    ];
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve criar um pedido', async () => {
    const itensPedido = {
      pedido: { id: pedidoModelMock.id },
      produto: { id: itemPedidoModelMock.produto.id },
      quantidade: itemPedidoModelMock.quantidade,
    };

    pedidoTypeORMMock.create.mockReturnValue(pedidoModelMock);
    pedidoTypeORMMock.save.mockResolvedValue(Promise.resolve(pedidoModelMock));

    itemPedidoTypeORMMock.create.mockReturnValue(itemPedidoModelMock);
    itemPedidoTypeORMMock.save.mockResolvedValue(
      Promise.resolve(itemPedidoModelMock),
    );

    pedidoTypeORMMock.findOne.mockResolvedValue(
      Promise.resolve(pedidoModelMock),
    );

    const result = await pedidoRepository.criarPedido(pedidoEntityMock);

    expect(pedidoTypeORMMock.create).toHaveBeenCalledWith(pedidoEntityMock);
    expect(pedidoTypeORMMock.save).toHaveBeenCalledWith(pedidoModelMock);
    expect(itemPedidoTypeORMMock.create).toHaveBeenCalledWith(itensPedido);
    expect(itemPedidoTypeORMMock.save).toHaveBeenCalledWith([
      itemPedidoModelMock,
    ]);
    expect(pedidoTypeORMMock.findOne).toHaveBeenCalledWith({
      where: { id: pedidoId },
      relations: relations,
    });
    expect(result).toBe(pedidoModelMock);
  });

  it('deve editar o status de um pedido', async () => {
    const novoStatusPedido = 'recebido';

    pedidoTypeORMMock.findOne.mockResolvedValue(
      Promise.resolve(pedidoModelMock),
    );

    const result = await pedidoRepository.editarStatusPedido(
      pedidoId,
      novoStatusPedido,
    );

    expect(pedidoTypeORMMock.update).toHaveBeenCalledWith(pedidoId, {
      statusPedido: novoStatusPedido,
    });
    expect(pedidoTypeORMMock.findOne).toHaveBeenCalledWith({
      where: { id: pedidoId },
      relations: relations,
    });
    expect(result).toBe(pedidoModelMock);
  });

  it('deve buscar um pedido por id', async () => {
    pedidoTypeORMMock.findOne.mockResolvedValue(
      Promise.resolve(pedidoModelMock),
    );

    const result = await pedidoRepository.buscarPedido(pedidoId);

    expect(pedidoTypeORMMock.findOne).toHaveBeenCalledWith({
      where: { id: pedidoId },
      relations: relations,
    });
    expect(result).toBe(pedidoModelMock);
  });

  it('deve buscar um pedido por id e retornar nulo', async () => {
    pedidoTypeORMMock.findOne.mockResolvedValue(null);

    const result = await pedidoRepository.buscarPedido(pedidoId);

    expect(pedidoTypeORMMock.findOne).toHaveBeenCalledWith({
      where: { id: pedidoId },
      relations: relations,
    });
    expect(result).toBe(null);
  });

  it('deve listar pedidos', async () => {
    const listaPedidos = [pedidoModelMock, pedidoModelMock, pedidoModelMock];
    pedidoTypeORMMock.find.mockResolvedValue(Promise.resolve(listaPedidos));

    const result = await pedidoRepository.listarPedidos();

    expect(pedidoTypeORMMock.find).toHaveBeenCalledWith({
      where: {
        statusPedido: In([
          StatusPedido.PRONTO,
          StatusPedido.EM_PREPARACAO,
          StatusPedido.RECEBIDO,
        ]),
      },
      order: {
        statusPedido: 'ASC',
        criadoEm: 'ASC',
      },
      relations: relations,
    });
    expect(result).toBe(listaPedidos);
  });

  it('deve retornar uma lista vazia de pedidos', async () => {
    const listaPedidos = [];
    pedidoTypeORMMock.find.mockResolvedValue(Promise.resolve(listaPedidos));

    const result = await pedidoRepository.listarPedidos();

    expect(pedidoTypeORMMock.find).toHaveBeenCalledWith({
      where: {
        statusPedido: In([
          StatusPedido.PRONTO,
          StatusPedido.EM_PREPARACAO,
          StatusPedido.RECEBIDO,
        ]),
      },
      order: {
        statusPedido: 'ASC',
        criadoEm: 'ASC',
      },
      relations: relations,
    });
    expect(result).toBe(listaPedidos);
  });

  it('deve listar fila de pedidos recebidos', async () => {
    const listaPedidos = [pedidoModelMock, pedidoModelMock, pedidoModelMock];
    pedidoTypeORMMock.find.mockResolvedValue(Promise.resolve(listaPedidos));

    const result = await pedidoRepository.listarPedidosRecebido();

    expect(pedidoTypeORMMock.find).toHaveBeenCalledWith({
      where: {
        statusPedido: StatusPedido.RECEBIDO,
      },
      order: {
        criadoEm: 'ASC',
      },
      relations: relations,
    });
    expect(result).toBe(listaPedidos);
  });

  it('deve retornar uma lista vazia de pedidos recebidos', async () => {
    const listaPedidos = [];
    pedidoTypeORMMock.find.mockResolvedValue(Promise.resolve(listaPedidos));

    const result = await pedidoRepository.listarPedidosRecebido();

    expect(pedidoTypeORMMock.find).toHaveBeenCalledWith({
      where: {
        statusPedido: StatusPedido.RECEBIDO,
      },
      order: {
        criadoEm: 'ASC',
      },
      relations: relations,
    });
    expect(result).toBe(listaPedidos);
  });
});
