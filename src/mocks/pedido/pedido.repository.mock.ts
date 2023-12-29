import { CategoriaModel } from 'src/adapters/outbound/models/categoria.model';
import { PedidoModel } from 'src/adapters/outbound/models/pedido.model';
import { ProdutoModel } from 'src/adapters/outbound/models/produto.model';
import { CategoriaEntity } from 'src/domain/entities/categoria.entity';
import { ClienteEntity } from 'src/domain/entities/cliente.entity';
import { PedidoEntity } from 'src/domain/entities/pedido.entity';
import { ProdutoEntity } from 'src/domain/entities/produto.entity';
import { Repository } from 'typeorm';
import { StatusPedido } from '../../utils/pedido.enum';

const clienteEntity = new ClienteEntity(
  'Jhon',
  'jhon@teste.com.br',
  '83904665030',
  '0a14aa4e-75e7-405f-8301-81f60646c93d',
);

const categoriaEntity = new CategoriaEntity(
  'Lanche',
  'Lanche x tudo',
  '0a14aa4e-75e7-405f-8301-81f60646c93d',
);

const produtoEntity = new ProdutoEntity(
  'Produto X',
  categoriaEntity,
  5.0,
  'http://',
  'Teste produto x',
  '0a14aa4e-75e7-405f-8301-81f60646c93d',
);

const pedidoEntity = new PedidoEntity(
  [produtoEntity],
  StatusPedido.RECEBIDO,
  '123456',
  clienteEntity,
  '0a14aa4e-75e7-405f-8301-81f60646c93d',
);

const categoriaModel = new CategoriaModel();
categoriaModel.id = '0a14aa4e-75e7-405f-8301-81f60646c93d';
categoriaModel.nome = 'Lanche';
categoriaModel.descricao = 'Lanche x tudo';
categoriaModel.produtos = null;
categoriaModel.criadoEm = new Date().toISOString();
categoriaModel.atualizadoEm = new Date().toISOString();
categoriaModel.excluidoEm = new Date().toISOString();

const produtoModel = new ProdutoModel();
produtoModel.id = '0a14aa4e-75e7-405f-8301-81f60646c93d';
produtoModel.nome = 'Produto X';
produtoModel.descricao = 'Teste produto x';
produtoModel.valorUnitario = 5.0;
produtoModel.imagemUrl = 'http://';
produtoModel.categoria = categoriaModel;
produtoModel.criadoEm = new Date().toISOString();
produtoModel.atualizadoEm = new Date().toISOString();
produtoModel.excluidoEm = new Date().toISOString();

const pedidoModel = new PedidoModel();
pedidoModel.id = '0a14aa4e-75e7-405f-8301-81f60646c93d';
pedidoModel.numeroPedido = '123456';
pedidoModel.itensPedido = [produtoModel];
pedidoModel.cliente = null;
pedidoModel.statusPedido = 'recebido';
pedidoModel.criadoEm = new Date().toISOString();
pedidoModel.atualizadoEm = new Date().toISOString();

const pedidoRepositoryMock: jest.Mocked<Repository<PedidoModel>> = {
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
} as Partial<jest.Mocked<Repository<PedidoModel>>> as jest.Mocked<
  Repository<PedidoModel>
>;

export { pedidoRepositoryMock, pedidoModel, pedidoEntity };
