import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { PedidoUseCase } from './pedido.use_case';
import { IPedidoRepository } from 'src/domain/pedido/interfaces/pedido.repository.port';
import { IPedidoFactory } from 'src/domain/pedido/interfaces/pedido.factory.port';
import { IGatewayPagamentoService } from 'src/domain/pedido/interfaces/gatewaypag.service.port';
import { IPedidoDTOFactory } from 'src/domain/pedido/interfaces/pedido.dto.factory.port';
import { PedidoNaoLocalizadoErro } from 'src/domain/pedido/exceptions/pedido.exception';
import { atualizaPedidoDTOMock, configServiceMock, criaPedidoDTOMock, gatewayPagamentoServiceMock, mensagemGatewayPagamentoDTO, pedidoDTOFactoryMock, pedidoDTOMock, pedidoEntityMock, pedidoFactoryMock, pedidoGatewayPagamentoDTO, pedidoModelMock, pedidoRepositoryMock } from 'src/mocks/pedido.mock';

describe('PedidoUseCase', () => {
  let pedidoUseCase: PedidoUseCase;
  let pedidoId: string;

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
          provide: IGatewayPagamentoService,
          useValue: gatewayPagamentoServiceMock,
        },
        {
          provide: IPedidoDTOFactory,
          useValue: pedidoDTOFactoryMock,
        },
        {
          provide: ConfigService,
          useValue: configServiceMock,
        },
      ],
    }).compile();

    pedidoUseCase = module.get<PedidoUseCase>(PedidoUseCase);
    pedidoId = '0a14aa4e-75e7-405f-8301-81f60646c93d';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve criar um pedido com sucesso', async () => {
    pedidoFactoryMock.criarEntidadePedido.mockReturnValue(pedidoEntityMock);
    pedidoRepositoryMock.criarPedido.mockReturnValue(pedidoModelMock);
    gatewayPagamentoServiceMock.criarPedido.mockReturnValue(null);
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
    expect(pedidoDTOFactoryMock.criarPedidoDTO).toHaveBeenCalledWith(
      pedidoModelMock,
    );
    expect(result).toStrictEqual({
      mensagem: 'Pedido atualizado com sucesso',
      body: pedidoDTOMock,
    });
  });

  it('deve atualizar o status de pagamento do pedido com sucesso', async () => {
    const idPedidoMercadoPago = '15171882961';
    const topicMercadoPago = 'merchant_order';

    pedidoRepositoryMock.buscarPedido.mockReturnValue(pedidoModelMock);
    pedidoRepositoryMock.editarStatusPedido.mockReturnValue(pedidoModelMock);
    pedidoDTOFactoryMock.criarPedidoDTO.mockReturnValue(pedidoDTOMock);
    gatewayPagamentoServiceMock.consultarPedido.mockReturnValue(pedidoGatewayPagamentoDTO);

    const result = await pedidoUseCase.webhookPagamento(
      idPedidoMercadoPago,
      topicMercadoPago,
      mensagemGatewayPagamentoDTO,
    );

    expect(pedidoRepositoryMock.editarStatusPagamento).toHaveBeenCalledWith(
      pedidoId,
      true,
    );
    expect(pedidoRepositoryMock.editarStatusPedido).toHaveBeenCalledWith(
      pedidoId,
      'em preparacao',
    );
    expect(result).toStrictEqual({
      mensagem: 'Mensagem consumida com sucesso'
    });
  });

  it('deve retornar erro ao editar um pedido não existe', async () => {
    pedidoRepositoryMock.buscarPedido.mockReturnValue(null);

    await expect(
      pedidoUseCase.editarPedido(pedidoId, atualizaPedidoDTOMock),
    ).rejects.toThrow(
      new PedidoNaoLocalizadoErro('Pedido informado não existe'),
    );
    expect(pedidoRepositoryMock.buscarPedido).toHaveBeenCalledWith(pedidoId);
  });

  it('deve buscar um pedido por id', async () => {
    pedidoRepositoryMock.buscarPedido.mockReturnValue(pedidoModelMock);
    pedidoDTOFactoryMock.criarPedidoDTO.mockReturnValue(pedidoDTOMock);

    const result = await pedidoUseCase.buscarPedido(pedidoId);

    expect(pedidoRepositoryMock.buscarPedido).toHaveBeenCalledWith(pedidoId);
    expect(pedidoDTOFactoryMock.criarPedidoDTO).toHaveBeenCalledWith(
      pedidoModelMock,
    );
    expect(result).toStrictEqual(pedidoDTOMock);
  });

  it('deve retornar erro ao buscar um pedido que não existe', async () => {
    pedidoRepositoryMock.buscarPedido.mockReturnValue(null);

    await expect(pedidoUseCase.buscarPedido(pedidoId)).rejects.toThrow(
      new PedidoNaoLocalizadoErro('Pedido informado não existe'),
    );
    expect(pedidoRepositoryMock.buscarPedido).toHaveBeenCalledWith(pedidoId);
  });

  it('deve listar todos os pedidos', async () => {
    pedidoRepositoryMock.listarPedidos.mockReturnValue([pedidoModelMock]);
    pedidoDTOFactoryMock.criarListaPedidoDTO.mockReturnValue([pedidoDTOMock]);

    const result = await pedidoUseCase.listarPedidos();

    expect(pedidoRepositoryMock.listarPedidos).toHaveBeenCalledWith();
    expect(pedidoDTOFactoryMock.criarListaPedidoDTO).toHaveBeenCalledWith([
      pedidoModelMock,
    ]);
    expect(result).toStrictEqual([pedidoDTOMock]);
  });

  it('deve retornar uma lista vazia de pedidos', async () => {
    pedidoRepositoryMock.listarPedidos.mockReturnValue([]);
    pedidoDTOFactoryMock.criarListaPedidoDTO.mockReturnValue([]);

    const result = await pedidoUseCase.listarPedidos();

    expect(pedidoRepositoryMock.listarPedidos).toHaveBeenCalledWith();
    expect(pedidoDTOFactoryMock.criarListaPedidoDTO).toHaveBeenCalledWith([]);
    expect(result).toStrictEqual([]);
  });

  it('deve listar fila de pedidos recebidos', async () => {
    pedidoRepositoryMock.listarPedidosRecebido.mockReturnValue([
      pedidoModelMock,
    ]);
    pedidoDTOFactoryMock.criarListaPedidoDTO.mockReturnValue([pedidoDTOMock]);

    const result = await pedidoUseCase.listarPedidosRecebido();

    expect(pedidoRepositoryMock.listarPedidosRecebido).toHaveBeenCalledWith();
    expect(pedidoDTOFactoryMock.criarListaPedidoDTO).toHaveBeenCalledWith([
      pedidoModelMock,
    ]);
    expect(result).toStrictEqual([pedidoDTOMock]);
  });

  it('deve retornar uma lista vazia de pedidos recebidos', async () => {
    pedidoRepositoryMock.listarPedidosRecebido.mockReturnValue([]);
    pedidoDTOFactoryMock.criarListaPedidoDTO.mockReturnValue([]);

    const result = await pedidoUseCase.listarPedidosRecebido();

    expect(pedidoRepositoryMock.listarPedidosRecebido).toHaveBeenCalledWith();
    expect(pedidoDTOFactoryMock.criarListaPedidoDTO).toHaveBeenCalledWith([]);
    expect(result).toStrictEqual([]);
  });
});
