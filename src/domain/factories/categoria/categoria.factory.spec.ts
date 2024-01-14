import { Test, TestingModule } from '@nestjs/testing';
import { CategoriaFactory } from './categoria.factory';
import {
  CategoriaDTO,
  CriaCategoriaDTO,
} from 'src/adapters/inbound/rest/v1/presenters/categoria.dto';
import { CategoriaEntity } from 'src/domain/entities/categoria/categoria.entity';

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

    const entidade =
      categoriaFactory.criarEntidadeCategoriaFromCriaCategoriaDTO(
        criaCategoriaDTO,
      );

    expect(entidade).toEqual(expectedEntidade);
  });

  it('Deve ser possível criar um objeto categoriaDTO', async () => {
    const categoriaDTO = new CategoriaDTO();
    categoriaDTO.nome = 'nome';
    categoriaDTO.descricao = 'descricao';
    categoriaDTO.id = '0a14aa4e-75e7-405f-8601-81f60646c93d';

    const result = categoriaFactory.criarCategoriaDTO(
      categoriaDTO.nome,
      categoriaDTO.descricao,
      categoriaDTO.id,
    );
    expect(result).toEqual(categoriaDTO);
  });
});
