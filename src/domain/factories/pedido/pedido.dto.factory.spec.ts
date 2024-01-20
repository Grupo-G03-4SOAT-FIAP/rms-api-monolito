import { Test, TestingModule } from '@nestjs/testing';
import { PedidoDTOFactory } from './pedido.dto.factory';
import { pedidoDTOMock, pedidoModelMock } from 'src/mocks/pedido.mock';
import { produtoDTOFactoryMock, produtoDTOMock } from 'src/mocks/produto.mock';
import { clienteDTOFactoryMock, clienteDTOMock } from 'src/mocks/cliente.mock';
import { IProdutoDTOFactory } from 'src/domain/ports/produto/produto.dto.factory.port';
import { IClienteDTOFactory } from 'src/domain/ports/cliente/cliente.dto.factory.port';
import {
  itemPedidoDTOMock,
  itemPedidoModelMock,
} from 'src/mocks/item_pedido.mock';

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

  it('deve criar um pedidoDTO', () => {
    produtoDTOFactoryMock.criarProdutoDTO.mockReturnValue(produtoDTOMock);
    clienteDTOFactoryMock.criarClienteDTO.mockReturnValue(clienteDTOMock);

    const result = pedidoDTOFactory.criarPedidoDTO(pedidoModelMock);

    expect(clienteDTOFactoryMock.criarClienteDTO).toHaveBeenCalledWith(
      pedidoModelMock.cliente,
    );
    expect(result).toStrictEqual(pedidoDTOMock);
  });

  it('deve criar uma lista de pedidoDTO', () => {
    produtoDTOFactoryMock.criarProdutoDTO.mockReturnValue(produtoDTOMock);
    clienteDTOFactoryMock.criarClienteDTO.mockReturnValue(clienteDTOMock);

    const result = pedidoDTOFactory.criarListaPedidoDTO([pedidoModelMock]);

    expect(clienteDTOFactoryMock.criarClienteDTO).toHaveBeenCalledWith(
      pedidoModelMock.cliente,
    );
    expect(result).toStrictEqual([pedidoDTOMock]);
  });

  it('deve criar uma lista vazia de pedidoDTO', () => {
    const result = pedidoDTOFactory.criarListaPedidoDTO([]);
    expect(result).toStrictEqual([]);
  });

  it('deve criar uma lista de itemPedidoDTO', () => {
    produtoDTOFactoryMock.criarProdutoDTO.mockReturnValue(produtoDTOMock);

    const result = pedidoDTOFactory.criarListaItemPedidoDTO(
      pedidoModelMock.itensPedido,
    );

    expect(produtoDTOFactoryMock.criarProdutoDTO).toHaveBeenCalledWith(
      itemPedidoModelMock.produto,
    );
    expect(result).toStrictEqual([itemPedidoDTOMock]);
  });
});
