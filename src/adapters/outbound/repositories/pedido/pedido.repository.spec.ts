import { getRepositoryToken } from '@nestjs/typeorm';
import { PedidoRepository } from './pedido.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { PedidoModel } from '../../models/pedido.model';
import { In } from 'typeorm';
import { StatusPedido } from 'src/utils/pedido.enum';
import {
  pedidoModel,
  pedidoEntity,
  pedidoModelMock,
} from 'src/mocks/pedido.mock';

describe('PedidoRepository', () => {
  let pedidoRepository: PedidoRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PedidoRepository,
        {
          provide: getRepositoryToken(PedidoModel),
          useValue: pedidoModelMock,
        },
      ],
    }).compile();

    pedidoRepository = module.get<PedidoRepository>(PedidoRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve criar um pedido', async () => {
    pedidoModelMock.create.mockReturnValue(pedidoModel);
    pedidoModelMock.save.mockResolvedValue(Promise.resolve(pedidoModel));

    const result = await pedidoRepository.criarPedido(pedidoEntity);

    expect(pedidoModelMock.create).toHaveBeenCalledWith(pedidoEntity);
    expect(pedidoModelMock.save).toHaveBeenCalledWith(pedidoModel);
    expect(result).toBe(pedidoModel);
  });

  it('deve editar o status de um pedido', async () => {
    const pedidoId = '0a14aa4e-75e7-405f-8301-81f60646c93d';
    const novoStatusPedido = 'recebido';

    pedidoModelMock.findOne.mockResolvedValue(Promise.resolve(pedidoModel));

    const result = await pedidoRepository.editarStatusPedido(
      pedidoId,
      novoStatusPedido,
    );

    expect(pedidoModelMock.update).toHaveBeenCalledWith(pedidoId, {
      statusPedido: novoStatusPedido,
    });
    expect(pedidoModelMock.findOne).toHaveBeenCalledWith({
      where: { id: pedidoId },
      relations: ['cliente'],
    });
    expect(result).toBe(pedidoModel);
  });

  it('deve buscar um pedido por id', async () => {
    pedidoModelMock.findOne.mockResolvedValue(Promise.resolve(pedidoModel));

    const pedidoId = '0a14aa4e-75e7-405f-8301-81f60646c93d';
    const result = await pedidoRepository.buscarPedido(pedidoId);

    expect(pedidoModelMock.findOne).toHaveBeenCalledWith({
      where: { id: pedidoId },
      relations: ['cliente'],
    });
    expect(result).toBe(pedidoModel);
  });

  it('deve buscar um pedido por id e retornar nulo', async () => {
    pedidoModelMock.findOne.mockResolvedValue(null);

    const pedidoId = '0a14aa4e-75e7-405f-8301-81f60646c93d';
    const result = await pedidoRepository.buscarPedido(pedidoId);

    expect(pedidoModelMock.findOne).toHaveBeenCalledWith({
      where: { id: pedidoId },
      relations: ['cliente'],
    });
    expect(result).toBe(null);
  });

  it('deve listar pedidos', async () => {
    const listaPedidos = [pedidoModel, pedidoModel, pedidoModel];
    pedidoModelMock.find.mockResolvedValue(Promise.resolve(listaPedidos));

    const result = await pedidoRepository.listarPedidos();

    expect(pedidoModelMock.find).toHaveBeenCalledWith({
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
      relations: ['cliente'],
    });
    expect(result).toBe(listaPedidos);
  });

  it('deve retornar uma lista vazia de pedidos', async () => {
    const listaPedidos = [];
    pedidoModelMock.find.mockResolvedValue(Promise.resolve(listaPedidos));

    const result = await pedidoRepository.listarPedidos();

    expect(pedidoModelMock.find).toHaveBeenCalledWith({
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
      relations: ['cliente'],
    });
    expect(result).toBe(listaPedidos);
  });

  it('deve listar fila de pedidos recebidos', async () => {
    const listaPedidos = [pedidoModel, pedidoModel, pedidoModel];
    pedidoModelMock.find.mockResolvedValue(Promise.resolve(listaPedidos));

    const result = await pedidoRepository.listarPedidosRecebido();

    expect(pedidoModelMock.find).toHaveBeenCalledWith({
      where: {
        statusPedido: StatusPedido.RECEBIDO,
      },
      order: {
        criadoEm: 'ASC',
      },
      relations: ['cliente'],
    });
    expect(result).toBe(listaPedidos);
  });

  it('deve retornar uma lista vazia de pedidos recebidos', async () => {
    const listaPedidos = [];
    pedidoModelMock.find.mockResolvedValue(Promise.resolve(listaPedidos));

    const result = await pedidoRepository.listarPedidosRecebido();

    expect(pedidoModelMock.find).toHaveBeenCalledWith({
      where: {
        statusPedido: StatusPedido.RECEBIDO,
      },
      order: {
        criadoEm: 'ASC',
      },
      relations: ['cliente'],
    });
    expect(result).toBe(listaPedidos);
  });
});
