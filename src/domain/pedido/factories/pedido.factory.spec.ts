import { Test, TestingModule } from '@nestjs/testing';
import { PedidoFactory } from './pedido.factory';
import { PedidoService } from '../services/pedido.service';
import { IProdutoRepository } from 'src/domain/produto/interfaces/produto.repository.port';
import { IClienteRepository } from 'src/domain/cliente/interfaces/cliente.repository.port';
import { ProdutoNaoLocalizadoErro } from 'src/domain/produto/exceptions/produto.exception';
import { ClienteNaoLocalizadoErro } from 'src/domain/cliente/exceptions/cliente.exception';
import {
  criaPedidoDTOMock,
  pedidoEntityMock,
  pedidoServiceMock,
} from 'src/mocks/pedido.mock';
import {
  produtoEntityNotIdMock,
  produtoModelMock,
  produtoRepositoryMock,
} from 'src/mocks/produto.mock';
import {
  clienteEntityMock,
  clienteRepositoryMock,
} from 'src/mocks/cliente.mock';
import { categoriaEntityMock } from 'src/mocks/categoria.mock';
import {
  criaItemPedidoDTOMock,
  itemPedidoEntityMock,
} from 'src/mocks/item_pedido.mock';

describe('PedidoFactory', () => {
  let pedidoFactory: PedidoFactory;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PedidoFactory,
        {
          provide: PedidoService,
          useValue: pedidoServiceMock,
        },
        {
          provide: IProdutoRepository,
          useValue: produtoRepositoryMock,
        },
        {
          provide: IClienteRepository,
          useValue: clienteRepositoryMock,
        },
      ],
    }).compile();

    pedidoFactory = module.get<PedidoFactory>(PedidoFactory);
    clienteEntityMock.id = '0a14aa4e-75e7-405f-8301-81f60646c93d';
    categoriaEntityMock.id = '0a14aa4e-75e7-405f-8301-81f60646c93d';
    produtoEntityNotIdMock.id = '0a14aa4e-75e7-405f-8301-81f60646c93d';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve criar a entidade pedido', async () => {
    pedidoServiceMock.gerarNumeroPedido.mockReturnValue('05012024');
    produtoRepositoryMock.buscarProdutoPorId.mockReturnValue(produtoModelMock);
    clienteRepositoryMock.buscarClientePorCPF.mockReturnValue(
      clienteEntityMock,
    );

    const result = await pedidoFactory.criarEntidadePedido(criaPedidoDTOMock);

    expect(pedidoServiceMock.gerarNumeroPedido).toHaveBeenCalled();
    expect(produtoRepositoryMock.buscarProdutoPorId).toHaveBeenCalled();
    expect(clienteRepositoryMock.buscarClientePorCPF).toHaveBeenCalled();
    expect(result).toStrictEqual(pedidoEntityMock);
  });

  it('deve criar itens do pedido', async () => {
    produtoRepositoryMock.buscarProdutoPorId.mockReturnValue(produtoModelMock);

    const result = await pedidoFactory.criarItemPedido(
      criaPedidoDTOMock.itensPedido,
    );

    expect(produtoRepositoryMock.buscarProdutoPorId).toHaveBeenCalledWith(
      criaPedidoDTOMock.itensPedido[0].produto,
    );
    expect(result).toStrictEqual([itemPedidoEntityMock]);
  });

  it('deve criar itens do pedido e retornar ProdutoNaoLocalizadoErro', async () => {
    const produtoId = criaPedidoDTOMock.itensPedido[0].produto;
    produtoRepositoryMock.buscarProdutoPorId.mockReturnValue(null);

    await expect(
      pedidoFactory.criarItemPedido([criaItemPedidoDTOMock]),
    ).rejects.toThrow(
      new ProdutoNaoLocalizadoErro(`Produto informado não existe ${produtoId}`),
    );
    expect(produtoRepositoryMock.buscarProdutoPorId).toHaveBeenCalledWith(
      produtoId,
    );
  });

  it('deve criar a entidade cliente', async () => {
    clienteRepositoryMock.buscarClientePorCPF.mockReturnValue(
      clienteEntityMock,
    );

    const result = await pedidoFactory.criarEntidadeCliente(
      criaPedidoDTOMock.cpfCliente,
    );

    expect(clienteRepositoryMock.buscarClientePorCPF).toHaveBeenCalled();
    expect(result).toStrictEqual(clienteEntityMock);
  });

  it('deve criar a entidade cliente com cliente undefined', async () => {
    clienteRepositoryMock.buscarClientePorCPF.mockReturnValue(
      clienteEntityMock,
    );

    const result = await pedidoFactory.criarEntidadeCliente();

    expect(result).toStrictEqual(null);
  });

  it('deve criar a entidade cliente e retornar ClienteNaoLocalizadoErro', async () => {
    clienteRepositoryMock.buscarClientePorCPF.mockReturnValue(null);

    await expect(
      pedidoFactory.criarEntidadeCliente(criaPedidoDTOMock.cpfCliente),
    ).rejects.toThrow(
      new ClienteNaoLocalizadoErro('Cliente informado não existe'),
    );
    expect(clienteRepositoryMock.buscarClientePorCPF).toHaveBeenCalledWith(
      criaPedidoDTOMock.cpfCliente,
    );
  });
});
