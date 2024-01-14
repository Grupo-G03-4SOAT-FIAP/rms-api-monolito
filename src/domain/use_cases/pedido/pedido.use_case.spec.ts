import { Test, TestingModule } from '@nestjs/testing';
import { IPedidoRepository } from 'src/domain/ports/pedido/pedido.repository.port';
import { IPedidoFactory } from 'src/domain/ports/pedido/pedido.factory.port';
import { PedidoUseCase } from './pedido.use_case';
import {
  pedidoFactoryMock,
  pedidoRepositoryMock,
  pedidoModelMock,
  pedidoEntityMock,
  criaPedidoDTOMock,
  atualizaPedidoDTOMock,
  pedidoDTOMock,
  pedidoDTOFactoryMock,
} from 'src/mocks/pedido.mock';
import { IPedidoDTOFactory } from 'src/domain/ports/pedido/pedido.dto.factory.port';

describe('PedidoUseCase', () => {
  let pedidoUseCase: PedidoUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PedidoUseCase,
        {
          provide: IPedidoRepository,
          useValue: pedidoRepositoryMock,
        },
        {
          provide: IPedidoFactory,
          useValue: pedidoFactoryMock,
        },
        {
          provide: IPedidoDTOFactory,
          useValue: pedidoDTOFactoryMock,
        },
      ],
    }).compile();

    pedidoUseCase = module.get<PedidoUseCase>(PedidoUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve criar um pedido com sucesso', async () => {
    pedidoFactoryMock.criarEntidadePedido.mockReturnValue(pedidoEntityMock);
    pedidoRepositoryMock.criarPedido.mockReturnValue(pedidoModelMock);
    pedidoDTOFactoryMock.criarPedidoDTO.mockReturnValue(pedidoDTOMock);

    const result = await pedidoUseCase.criarPedido(criaPedidoDTOMock);

    expect(pedidoFactoryMock.criarEntidadePedido).toHaveBeenCalledWith(
      criaPedidoDTOMock,
    );
    expect(pedidoRepositoryMock.criarPedido).toHaveBeenCalledWith(
      pedidoEntityMock,
    );
    expect(pedidoDTOFactoryMock.criarPedidoDTO).toHaveBeenCalledWith(
      pedidoModelMock,
    );
    expect(result).toStrictEqual({
      mensagem: 'Pedido criado com sucesso',
      body: pedidoDTOMock,
    });
  });

  it('deve editar o status de um pedido com sucesso', async () => {
    const pedidoId = '0a14aa4e-75e7-405f-8301-81f60646c93d';

    pedidoRepositoryMock.buscarPedido.mockReturnValue(pedidoModelMock);
    pedidoRepositoryMock.editarStatusPedido.mockReturnValue(pedidoModelMock);
    pedidoDTOFactoryMock.criarPedidoDTO.mockReturnValue(pedidoDTOMock);

    const result = await pedidoUseCase.editarPedido(
      pedidoId,
      atualizaPedidoDTOMock,
    );

    expect(pedidoRepositoryMock.buscarPedido).toHaveBeenCalledWith(pedidoId);
    expect(pedidoRepositoryMock.editarStatusPedido).toHaveBeenCalledWith(
      pedidoId,
      atualizaPedidoDTOMock.statusPedido,
    );
    expect(result).toStrictEqual({
      mensagem: 'Pedido atualizado com sucesso',
      body: pedidoDTOMock,
    });
  });

  it('deve editar o status de um pedido e retornar PedidoNaoLocalizadoErro', async () => {
    const pedidoId = '0a14aa4e-75e7-405f-8301-81f60646c93c';

    pedidoRepositoryMock.buscarPedido.mockReturnValue(null);

    await expect(
      pedidoUseCase.editarPedido(pedidoId, atualizaPedidoDTOMock),
    ).rejects.toThrow('Pedido informado não existe');
    expect(pedidoRepositoryMock.buscarPedido).toHaveBeenCalledWith(pedidoId);
  });

  it('deve buscar um pedido por id', async () => {
    const pedidoId = '0a14aa4e-75e7-405f-8301-81f60646c93d';

    pedidoRepositoryMock.buscarPedido.mockReturnValue(pedidoModelMock);
    pedidoDTOFactoryMock.criarPedidoDTO.mockReturnValue(pedidoDTOMock);

    const result = await pedidoUseCase.buscarPedido(pedidoId);

    expect(pedidoRepositoryMock.buscarPedido).toHaveBeenCalledWith(pedidoId);
    expect(result).toStrictEqual(pedidoDTOMock);
  });

  it('deve buscar um pedido por id e retornar PedidoNaoLocalizadoErro', async () => {
    const pedidoId = '0a14aa4e-75e7-405f-8301-81f60646c93c';

    pedidoRepositoryMock.buscarPedido.mockReturnValue(null);

    await expect(pedidoUseCase.buscarPedido(pedidoId)).rejects.toThrow(
      'Pedido informado não existe',
    );
    expect(pedidoRepositoryMock.buscarPedido).toHaveBeenCalledWith(pedidoId);
  });

  it('deve listar pedidos', async () => {
    pedidoRepositoryMock.listarPedidos.mockReturnValue([pedidoModelMock]);
    pedidoDTOFactoryMock.criarListaPedidoDTO.mockReturnValue([pedidoDTOMock]);

    const result = await pedidoUseCase.listarPedidos();

    expect(pedidoRepositoryMock.listarPedidos).toHaveBeenCalledWith();
    expect(result).toStrictEqual([pedidoDTOMock]);
  });

  it('deve retornar uma lista vazia de pedidos', async () => {
    pedidoRepositoryMock.listarPedidos.mockReturnValue([]);
    pedidoDTOFactoryMock.criarListaPedidoDTO.mockReturnValue([]);

    const result = await pedidoUseCase.listarPedidos();

    expect(pedidoRepositoryMock.listarPedidos).toHaveBeenCalledWith();
    expect(result).toStrictEqual([]);
  });

  it('deve listar fila de pedidos recebidos', async () => {
    pedidoRepositoryMock.listarPedidosRecebido.mockReturnValue([
      pedidoModelMock,
    ]);
    pedidoDTOFactoryMock.criarListaPedidoDTO.mockReturnValue([pedidoDTOMock]);

    const result = await pedidoUseCase.listarPedidosRecebido();

    expect(pedidoRepositoryMock.listarPedidosRecebido).toHaveBeenCalledWith();
    expect(result).toStrictEqual([pedidoDTOMock]);
  });

  it('deve retornar uma lista vazia de pedidos recebidos', async () => {
    pedidoRepositoryMock.listarPedidosRecebido.mockReturnValue([]);
    pedidoDTOFactoryMock.criarListaPedidoDTO.mockReturnValue([]);

    const result = await pedidoUseCase.listarPedidosRecebido();

    expect(pedidoRepositoryMock.listarPedidosRecebido).toHaveBeenCalledWith();
    expect(result).toStrictEqual([]);
  });
});
