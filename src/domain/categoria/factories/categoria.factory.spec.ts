import { Test, TestingModule } from '@nestjs/testing';
import { CategoriaFactory } from './categoria.factory';
import { CategoriaEntity } from '../entities/categoria.entity';

describe('Categoria Factory', () => {
  let categoriaFactory: CategoriaFactory;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoriaFactory],
    }).compile();

    categoriaFactory = module.get<CategoriaFactory>(CategoriaFactory);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Deve ser possível criar uma entidade da categoria', async () => {
    const nome = 'Categoria Nome Teste';
    const descricao = 'Categoria Descrição Teste';
    const id = 'Categoria id Test';
    const expectedEntidade = new CategoriaEntity(nome, descricao, id);

    const entidade = categoriaFactory.criarEntidadeCategoria(
      nome,
      descricao,
      id,
    );

    expect(entidade).toEqual(expectedEntidade);
  });
});
