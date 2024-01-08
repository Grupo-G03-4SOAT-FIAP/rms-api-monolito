import { Repository } from 'typeorm';
import { ProdutoModel } from 'src/adapters/outbound/models/produto.model';
import { ProdutoEntity } from 'src/domain/entities/produto/produto.entity';
import { categoriaEntityMock, categoriaModelMock } from './categoria.mock';
import { ProdutoDTO } from 'src/adapters/inbound/rest/v1/presenters/produto.dto';
import { CategoriaDTO } from 'src/adapters/inbound/rest/v1/presenters/categoria.dto';

const produtoModelMock = new ProdutoModel();
produtoModelMock.id = '0a14aa4e-75e7-405f-8301-81f60646c93d';
produtoModelMock.nome = 'Produto X';
produtoModelMock.descricao = 'Teste produto x';
produtoModelMock.valorUnitario = 5.0;
produtoModelMock.imagemUrl = 'http://';
produtoModelMock.categoria = categoriaModelMock;
produtoModelMock.criadoEm = new Date().toISOString();
produtoModelMock.atualizadoEm = new Date().toISOString();
produtoModelMock.excluidoEm = new Date().toISOString();

const produtoEntityMock = new ProdutoEntity(
  'Produto X',
  categoriaEntityMock,
  5.0,
  'http://',
  'Teste produto x',
  '0a14aa4e-75e7-405f-8301-81f60646c93d',
);

const makeProdutoDTO = (
  id: string,
  nome: string,
  descricao: string,
  valorUnitario: number,
  imagemUrl: string,
  categoria: CategoriaDTO,
): ProdutoDTO => {
  const produtoDTO = new ProdutoDTO();
  produtoDTO.id = id;
  produtoDTO.nome = nome;
  produtoDTO.descricao = descricao;
  produtoDTO.valorUnitario = valorUnitario;
  produtoDTO.imagemUrl = imagemUrl;
  produtoDTO.categoria = categoria;
  return produtoDTO;
};

const produtoDTOMock = makeProdutoDTO(
  produtoModelMock.id,
  produtoModelMock.nome,
  produtoModelMock.descricao,
  produtoModelMock.valorUnitario,
  produtoModelMock.imagemUrl,
  produtoModelMock.categoria,
);

const produtoTypeORMMock: jest.Mocked<Repository<ProdutoModel>> = {
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
} as Partial<jest.Mocked<Repository<ProdutoModel>>> as jest.Mocked<
  Repository<ProdutoModel>
>;

const produtoRepositoryMock = {
  criarProduto: jest.fn(),
  editarProduto: jest.fn(),
  excluirProduto: jest.fn(),
  buscarProdutoPorId: jest.fn(),
  buscarProdutoPorNome: jest.fn(),
  listarProdutos: jest.fn(),
  listarProdutosPorCategoria: jest.fn(),
};

export {
  produtoModelMock,
  produtoEntityMock,
  produtoDTOMock,
  produtoTypeORMMock,
  produtoRepositoryMock,
};
