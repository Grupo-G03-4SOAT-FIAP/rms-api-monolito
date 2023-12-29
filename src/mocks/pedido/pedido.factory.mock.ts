import { PedidoFactory } from 'src/domain/factories/pedido.factory';
import { IClienteRepository } from 'src/domain/ports/cliente/cliente.repository.port';
import { IProdutoRepository } from 'src/domain/ports/produto/produto.repository.port';
import { pedidoServiceMock } from './pedido.service.mock';

const clienteRepositoryMock: jest.Mocked<IClienteRepository> = {
  buscarClientePorCPF: jest.fn(),
} as Partial<
  jest.Mocked<IClienteRepository>
> as jest.Mocked<IClienteRepository>;

const produtoRepositoryMock: jest.Mocked<IProdutoRepository> = {
  buscarProdutoPorId: jest.fn(),
} as Partial<
  jest.Mocked<IProdutoRepository>
> as jest.Mocked<IProdutoRepository>;

const pedidoFactoryMock: jest.Mocked<PedidoFactory> = new PedidoFactory(
  pedidoServiceMock,
  clienteRepositoryMock,
  produtoRepositoryMock,
);

export {
  pedidoFactoryMock,
  clienteRepositoryMock,
  produtoRepositoryMock,
  pedidoServiceMock,
};
