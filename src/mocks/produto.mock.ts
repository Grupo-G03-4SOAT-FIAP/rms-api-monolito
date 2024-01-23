import { Repository } from 'typeorm';
import { ProdutoModel } from 'src/adapters/outbound/models/produto.model';
import { ProdutoEntity } from 'src/domain/entities/produto/produto.entity';
import {
  categoriaDTOMock,
  categoriaEntityMock,
  categoriaModelMock,
} from './categoria.mock';
import {
  AtualizaProdutoDTO,
  CriaProdutoDTO,
  ProdutoDTO,
} from 'src/adapters/inbound/rest/v1/presenters/produto.dto';

// Mock para simular dados da tabela produto no banco de dados
export const produtoModelMock = new ProdutoModel();
produtoModelMock.id = '0a14aa4e-75e7-405f-8301-81f60646c93d';
produtoModelMock.nome = 'Produto X';
produtoModelMock.descricao = 'Teste produto x';
produtoModelMock.valorUnitario = 5.0;
produtoModelMock.imagemUrl = 'http://';
produtoModelMock.categoria = categoriaModelMock;
produtoModelMock.criadoEm = new Date().toISOString();
produtoModelMock.atualizadoEm = new Date().toISOString();
produtoModelMock.excluidoEm = new Date().toISOString();

// Mock para simular dados da entidade produto
export const produtoEntityMock = new ProdutoEntity(
  'Produto X',
  categoriaEntityMock,
  5.0,
  'http://',
  'Teste produto x',
);

// Mock para simular o DTO com os dados recebidos pelo usuario ao criar um produto
export const criaProdutoDTOMock = new CriaProdutoDTO();
criaProdutoDTOMock.nome = 'Produto X';
criaProdutoDTOMock.descricao = 'Teste produto x';
criaProdutoDTOMock.valorUnitario = 5.0;
criaProdutoDTOMock.imagemUrl = 'http://';
criaProdutoDTOMock.categoriaId = '0a14aa4e-75e7-405f-8301-81f60646c93d';

// Mock para simular o DTO com os dados recebidos pelo usuario ao atualizar um produto
export const atualizaProdutoDTOMock = new AtualizaProdutoDTO();
atualizaProdutoDTOMock.nome = 'Produto X';
atualizaProdutoDTOMock.descricao = 'Teste produto x';
atualizaProdutoDTOMock.valorUnitario = 5.0;
atualizaProdutoDTOMock.imagemUrl = 'http://';
atualizaProdutoDTOMock.categoriaId = '0a14aa4e-75e7-405f-8301-81f60646c93d';

// Mock para simular o DTO com dados de produto enviados para o usuario ao responder uma requisição
export const produtoDTOMock = new ProdutoDTO();
produtoDTOMock.id = produtoModelMock.id;
produtoDTOMock.nome = produtoModelMock.nome;
produtoDTOMock.descricao = produtoModelMock.descricao;
produtoDTOMock.valorUnitario = produtoModelMock.valorUnitario;
produtoDTOMock.imagemUrl = produtoModelMock.imagemUrl;
produtoDTOMock.categoria = categoriaDTOMock;

// Mock jest das funções do typeORM interagindo com a tabela produto
export const produtoTypeORMMock: jest.Mocked<Repository<ProdutoModel>> = {
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
} as Partial<jest.Mocked<Repository<ProdutoModel>>> as jest.Mocked<
  Repository<ProdutoModel>
>;

// Mock jest das funções do repository produto
export const produtoRepositoryMock = {
  criarProduto: jest.fn(),
  editarProduto: jest.fn(),
  excluirProduto: jest.fn(),
  buscarProdutoPorId: jest.fn(),
  buscarProdutoPorNome: jest.fn(),
  listarProdutos: jest.fn(),
  listarProdutosPorCategoria: jest.fn(),
};

// Mock jest das funções da factory que cria entidade produto
export const produtoFactoryMock = {
  criarEntidadeCategoria: jest.fn(),
  criarEntidadeProduto: jest.fn(),
};

// Mock jest das funções da factory que cria DTO produto
export const produtoDTOFactoryMock = {
  criarProdutoDTO: jest.fn(),
  criarListaProdutoDTO: jest.fn(),
};

// Mock jest das funções do use case produto
export const produtoUseCaseMock = {
  criarProduto: jest.fn(),
  editarProduto: jest.fn(),
  excluirProduto: jest.fn(),
  buscarProduto: jest.fn(),
  listarProdutos: jest.fn(),
  listarProdutosPorCategoria: jest.fn(),
};
