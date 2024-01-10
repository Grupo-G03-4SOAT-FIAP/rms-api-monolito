import { Test, TestingModule } from '@nestjs/testing';
import { PedidoController } from './pedido.controller';
import { IPedidoUseCase } from 'src/domain/ports/pedido/pedido.use_case.port';
import {
  criaPedidoDTOMock,
  pedidoDTOMock,
  pedidoUseCaseMock,
} from 'src/mocks/pedido.mock';
import { PedidoNaoLocalizadoErro } from 'src/domain/exceptions/pedido.exception';
import { NotFoundException } from '@nestjs/common';

describe('PedidoController', () => {
  let pedidoController: PedidoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PedidoController,
        {
          provide: IPedidoUseCase,
          useValue: pedidoUseCaseMock,
        },
      ],
    }).compile();

    pedidoController = module.get<PedidoController>(PedidoController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve fazer checkout de pedido', async () => {
    const HTTPResponse = {
      mensagem: 'Pedido criado com sucesso',
      body: pedidoDTOMock,
    };

    pedidoUseCaseMock.criarPedido.mockReturnValue(HTTPResponse);

    const result = await pedidoController.checkout(criaPedidoDTOMock);

    expect(result).toBe(HTTPResponse);
  });

  it('deve fazer checkout de pedido e retornar NotFoundException', async () => {
    pedidoUseCaseMock.criarPedido.mockReturnValue(
      new PedidoNaoLocalizadoErro('Cliente informado não existe'),
    );

    await expect(pedidoController.checkout(criaPedidoDTOMock)).rejects.toThrow(
      new NotFoundException('Cliente informado não existe'),
    );
    expect(pedidoUseCaseMock.criarPedido).toHaveBeenCalledWith(
      criaPedidoDTOMock,
    );
  });
});
