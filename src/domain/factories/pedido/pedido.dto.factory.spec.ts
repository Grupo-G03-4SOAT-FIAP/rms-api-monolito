import { Test, TestingModule } from '@nestjs/testing';
import { PedidoDTOFactory } from './pedido.dto.factory';
import { pedidoDTOMock, pedidoModelMock } from 'src/mocks/pedido.mock';

describe('PedidoDTOFactory', () => {
  let pedidoDTOFactory: PedidoDTOFactory;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PedidoDTOFactory],
    }).compile();

    pedidoDTOFactory = module.get<PedidoDTOFactory>(PedidoDTOFactory);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve criar um pedidoDTO', async () => {
    const result = await pedidoDTOFactory.criarPedidoDTO(pedidoModelMock);
    expect(result).toStrictEqual(pedidoDTOMock);
  });

  it('deve criar uma lista de pedidoDTO', async () => {
    const result = await pedidoDTOFactory.criarListaPedidoDTO([
      pedidoModelMock,
    ]);
    expect(result).toStrictEqual([pedidoDTOMock]);
  });

  it('deve criar uma lista vazia de pedidoDTO', async () => {
    const result = await pedidoDTOFactory.criarListaPedidoDTO([]);
    expect(result).toStrictEqual([]);
  });
});
