import { getRepositoryToken } from '@nestjs/typeorm';
import { PedidoRepository } from './pedido.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { PedidoModel } from '../../models/pedido.model';
import { In } from 'typeorm';
import { StatusPedido } from 'src/utils/pedido.enum';
import {
  pedidoRepositoryMock,
  pedidoModel,
  pedidoEntity,
} from 'src/mocks/pedido.repository.mock';

describe('PedidoRepository', () => {
  let pedidoRepository: PedidoRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PedidoRepository,
        {
          provide: getRepositoryToken(PedidoModel),
          useValue: pedidoRepositoryMock,
        },
      ],
    }).compile();

    pedidoRepository = module.get<PedidoRepository>(PedidoRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve criar um pedido', async () => {
    pedidoRepositoryMock.create.mockReturnValue(pedidoModel);
    pedidoRepositoryMock.save.mockResolvedValue(Promise.resolve(pedidoModel));

    const resultado = await pedidoRepository.criarPedido(pedidoEntity);

    expect(pedidoRepositoryMock.create).toHaveBeenCalledWith(pedidoEntity);
    expect(pedidoRepositoryMock.save).toHaveBeenCalledWith(pedidoModel);
    expect(resultado).toBe(pedidoModel);
  });

  it('deve editar o status de um pedido', async () => {
    const pedidoId = '0a14aa4e-75e7-405f-8301-81f60646c93d';
    const novoStatusPedido = 'Recebido';

    pedidoRepositoryMock.findOne.mockResolvedValue(
      Promise.resolve(pedidoModel),
    );

    const resultado = await pedidoRepository.editarStatusPedido(
      pedidoId,
      novoStatusPedido,
    );

    expect(pedidoRepositoryMock.update).toHaveBeenCalledWith(pedidoId, {
      statusPedido: novoStatusPedido,
    });
    expect(pedidoRepositoryMock.findOne).toHaveBeenCalledWith({
      where: { id: pedidoId },
      relations: ['cliente'],
    });
    expect(resultado).toBe(pedidoModel);
  });

  it('deve buscar um pedido por id', async () => {
    pedidoRepositoryMock.findOne.mockResolvedValue(
      Promise.resolve(pedidoModel),
    );

    const pedidoId = '0a14aa4e-75e7-405f-8301-81f60646c93d';
    const resultado = await pedidoRepository.buscarPedido(pedidoId);

    expect(pedidoRepositoryMock.findOne).toHaveBeenCalledWith({
      where: { id: pedidoId },
      relations: ['cliente'],
    });
    expect(resultado).toBe(pedidoModel);
  });

  it('deve buscar um pedido por id e retornar nulo', async () => {
    pedidoRepositoryMock.findOne.mockResolvedValue(null);

    const pedidoId = '0a14aa4e-75e7-405f-8301-81f60646c93d';
    const resultado = await pedidoRepository.buscarPedido(pedidoId);

    expect(pedidoRepositoryMock.findOne).toHaveBeenCalledWith({
      where: { id: pedidoId },
      relations: ['cliente'],
    });
    expect(resultado).toBe(null);
  });

  it('deve listar pedidos prontos e em preparação', async () => {
    const listaPedidos = [pedidoModel, pedidoModel, pedidoModel];
    pedidoRepositoryMock.find.mockResolvedValue(Promise.resolve(listaPedidos));

    const resultado = await pedidoRepository.listarPedidos();

    expect(pedidoRepositoryMock.find).toHaveBeenCalledWith({
      where: {
        statusPedido: In([StatusPedido.PRONTO, StatusPedido.EM_PREPARACAO]),
      },
      relations: ['cliente'],
    });
    expect(resultado).toBe(listaPedidos);
  });

  it('deve retornar uma lista vazia de pedidos prontos e em preparação', async () => {
    const listaPedidos = [];
    pedidoRepositoryMock.find.mockResolvedValue(Promise.resolve(listaPedidos));

    const resultado = await pedidoRepository.listarPedidos();

    expect(pedidoRepositoryMock.find).toHaveBeenCalledWith({
      where: {
        statusPedido: In([StatusPedido.PRONTO, StatusPedido.EM_PREPARACAO]),
      },
      relations: ['cliente'],
    });
    expect(resultado).toBe(listaPedidos);
  });

  it('deve listar fila de pedidos recebidos', async () => {
    const listaPedidos = [pedidoModel, pedidoModel, pedidoModel];
    pedidoRepositoryMock.find.mockResolvedValue(Promise.resolve(listaPedidos));

    const resultado = await pedidoRepository.listarPedidosRecebido();

    expect(pedidoRepositoryMock.find).toHaveBeenCalledWith({
      where: {
        statusPedido: StatusPedido.RECEBIDO,
      },
      order: {
        criadoEm: 'ASC',
      },
      relations: ['cliente'],
    });
    expect(resultado).toBe(listaPedidos);
  });

  it('deve retornar uma lista vazia de pedidos recebidos', async () => {
    const listaPedidos = [];
    pedidoRepositoryMock.find.mockResolvedValue(Promise.resolve(listaPedidos));

    const resultado = await pedidoRepository.listarPedidosRecebido();

    expect(pedidoRepositoryMock.find).toHaveBeenCalledWith({
      where: {
        statusPedido: StatusPedido.RECEBIDO,
      },
      order: {
        criadoEm: 'ASC',
      },
      relations: ['cliente'],
    });
    expect(resultado).toBe(listaPedidos);
  });
});
