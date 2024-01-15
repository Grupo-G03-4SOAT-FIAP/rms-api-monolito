import { Test, TestingModule } from '@nestjs/testing';
import { PedidoDTOFactory } from './pedido.dto.factory';
import { pedidoDTOMock, pedidoModelMock } from 'src/mocks/pedido.mock';
import { produtoDTOFactoryMock, produtoDTOMock } from 'src/mocks/produto.mock';
import { clienteDTOFactoryMock, clienteDTOMock } from 'src/mocks/cliente.mock';
import { IProdutoDTOFactory } from 'src/domain/ports/produto/produto.dto.factory.port';
import { IClienteDTOFactory } from 'src/domain/ports/cliente/cliente.dto.factory.port';

describe('PedidoDTOFactory', () => {
  let pedidoDTOFactory: PedidoDTOFactory;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PedidoDTOFactory,
        {
          provide: IProdutoDTOFactory,
          useValue: produtoDTOFactoryMock,
        },
        {
          provide: IClienteDTOFactory,
          useValue: clienteDTOFactoryMock,
        },
      ],
    }).compile();

    pedidoDTOFactory = module.get<PedidoDTOFactory>(PedidoDTOFactory);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve criar um pedidoDTO', async () => {
    produtoDTOFactoryMock.criarListaProdutoDTO.mockReturnValue([
      produtoDTOMock,
    ]);
    clienteDTOFactoryMock.criarClienteDTO.mockReturnValue(clienteDTOMock);

    const result = await pedidoDTOFactory.criarPedidoDTO(pedidoModelMock);

    expect(produtoDTOFactoryMock.criarListaProdutoDTO).toHaveBeenCalledWith(
      pedidoModelMock.itensPedido,
    );
    expect(clienteDTOFactoryMock.criarClienteDTO).toHaveBeenCalledWith(
      pedidoModelMock.cliente,
    );
    expect(result).toStrictEqual(pedidoDTOMock);
  });

  it('deve criar uma lista de pedidoDTO', async () => {
    produtoDTOFactoryMock.criarListaProdutoDTO.mockReturnValue([
      produtoDTOMock,
    ]);
    clienteDTOFactoryMock.criarClienteDTO.mockReturnValue(clienteDTOMock);

    const result = await pedidoDTOFactory.criarListaPedidoDTO([
      pedidoModelMock,
    ]);

    expect(produtoDTOFactoryMock.criarListaProdutoDTO).toHaveBeenCalledWith(
      pedidoModelMock.itensPedido,
    );
    expect(clienteDTOFactoryMock.criarClienteDTO).toHaveBeenCalledWith(
      pedidoModelMock.cliente,
    );
    expect(result).toStrictEqual([pedidoDTOMock]);
  });

  it('deve criar uma lista vazia de pedidoDTO', async () => {
    const result = await pedidoDTOFactory.criarListaPedidoDTO([]);
    expect(result).toStrictEqual([]);
  });
});
