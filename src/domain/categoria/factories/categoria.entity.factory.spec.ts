import { Test, TestingModule } from '@nestjs/testing';
import {
  categoriaEntityMock,
  categoriaEntityNotDescricaoMock,
  categoriaEntityNotIdMock,
} from 'src/mocks/categoria.mock';
import { CategoriaEntityFactory } from './categoria.entity.factory';

describe('CategoriaEntityFactory', () => {
  let categoriaEntityFactory: CategoriaEntityFactory;
  let nome: string;
  let descricao: string;
  let id: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoriaEntityFactory],
    }).compile();

    categoriaEntityFactory = module.get<CategoriaEntityFactory>(
      CategoriaEntityFactory,
    );
    nome = 'Lanche';
    descricao = 'Lanche X Tudo';
    id = '0a14aa4e-75e7-405f-8301-81f60646c93d';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve criar uma entidade categoria', () => {
    const result = categoriaEntityFactory.criarEntidadeCategoria(
      nome,
      descricao,
      id,
    );
    expect(result).toStrictEqual(categoriaEntityMock);
  });

  it('deve criar uma entidade categoria sem id', () => {
    const result = categoriaEntityFactory.criarEntidadeCategoria(
      nome,
      descricao,
    );
    expect(result).toStrictEqual(categoriaEntityNotIdMock);
  });

  it('deve criar uma entidade categoria sem descricao', () => {
    const result = categoriaEntityFactory.criarEntidadeCategoria(nome);
    expect(result).toStrictEqual(categoriaEntityNotDescricaoMock);
  });
});
