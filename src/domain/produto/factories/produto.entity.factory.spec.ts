import { Test, TestingModule } from '@nestjs/testing';
import { ProdutoEntityFactory } from './produto.entity.factory';
import {
  produtoEntityMock,
  produtoEntityNotDescricaoMock,
  produtoEntityNotIdMock,
} from 'src/mocks/produto.mock';
import { categoriaEntityMock } from 'src/mocks/categoria.mock';
import { CategoriaEntity } from 'src/domain/categoria/entities/categoria.entity';

describe('ProdutoEntityFactory', () => {
  let produtoEntityFactory: ProdutoEntityFactory;
  let nome: string;
  let categoria: CategoriaEntity;
  let valorUnitario: number;
  let imagemUrl: string;
  let descricao: string;
  let id: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProdutoEntityFactory],
    }).compile();

    produtoEntityFactory =
      module.get<ProdutoEntityFactory>(ProdutoEntityFactory);
    nome = 'Produto X';
    categoria = categoriaEntityMock;
    valorUnitario = 5.0;
    imagemUrl = 'http://';
    descricao = 'Teste produto x';
    id = '0a14aa4e-75e7-405f-8301-81f60646c93d';
  });

  it('deve criar uma entidade produto', () => {
    const produto = produtoEntityFactory.criarEntidadeProduto(
      nome,
      categoria,
      valorUnitario,
      imagemUrl,
      descricao,
      id,
    );

    expect(produto).toEqual(produtoEntityMock);
  });

  it('deve criar uma entidade produto sem id', () => {
    const produto = produtoEntityFactory.criarEntidadeProduto(
      nome,
      categoria,
      valorUnitario,
      imagemUrl,
      descricao,
    );

    expect(produto).toEqual(produtoEntityNotIdMock);
  });

  it('deve criar uma entidade produto sem descricao', () => {
    const produto = produtoEntityFactory.criarEntidadeProduto(
      nome,
      categoria,
      valorUnitario,
      imagemUrl,
    );

    expect(produto).toEqual(produtoEntityNotDescricaoMock);
  });
});
