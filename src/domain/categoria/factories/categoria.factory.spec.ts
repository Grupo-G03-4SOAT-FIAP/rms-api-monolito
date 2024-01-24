import { Test, TestingModule } from '@nestjs/testing';
import { CategoriaFactory } from './categoria.factory';
import { CriaCategoriaDTO } from 'src/presentation/rest/v1/presenters/categoria/categoria.dto';
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

  it('Deve ser possível criar uma entidade da categoria baseada na criaCategoriaDTO', async () => {
    const criaCategoriaDTO = new CriaCategoriaDTO();
    criaCategoriaDTO.nome = 'Categoria Nome Teste';
    criaCategoriaDTO.descricao = 'Categoria Descrição Teste';

    const expectedEntidade = new CategoriaEntity(
      criaCategoriaDTO.nome,
      criaCategoriaDTO.descricao,
    );

    const entidade = categoriaFactory.criarEntidadeCategoria(criaCategoriaDTO);

    expect(entidade).toEqual(expectedEntidade);
  });
});
