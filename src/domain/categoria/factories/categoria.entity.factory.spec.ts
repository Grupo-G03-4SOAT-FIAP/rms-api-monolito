import { Test, TestingModule } from '@nestjs/testing';
import { CategoriaFactory } from './categoria.entity.factory';
import {
  categoriaEntityMock,
  categoriaEntityNotDescricaoMock,
  categoriaEntityNotIdMock,
} from 'src/mocks/categoria.mock';

describe('Categoria Factory', () => {
  let categoriaFactory: CategoriaFactory;
  let nome: string;
  let descricao: string;
  let id: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoriaFactory],
    }).compile();

    categoriaFactory = module.get<CategoriaFactory>(CategoriaFactory);
    nome = 'Lanche';
    descricao = 'Lanche X Tudo';
    id = '0a14aa4e-75e7-405f-8301-81f60646c93d';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve criar uma entidade categoria', () => {
    const result = categoriaFactory.criarEntidadeCategoria(nome, descricao, id);
    expect(result).toStrictEqual(categoriaEntityMock);
  });

  it('deve criar uma entidade categoria sem id', () => {
    const result = categoriaFactory.criarEntidadeCategoria(nome, descricao);
    expect(result).toStrictEqual(categoriaEntityNotIdMock);
  });

  it('deve criar uma entidade categoria sem descricao', () => {
    const result = categoriaFactory.criarEntidadeCategoria(nome);
    expect(result).toStrictEqual(categoriaEntityNotDescricaoMock);
  });
});
