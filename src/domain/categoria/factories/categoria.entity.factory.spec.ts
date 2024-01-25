import { Test, TestingModule } from '@nestjs/testing';
import { CategoriaEntity } from '../entities/categoria.entity';
import { ICategoriaEntityFactory } from '../interfaces/categoria.entity.factory.port';
import { CategoriaEntityFactory } from './categoria.entity.factory';

describe('CategoriaEntiryFactory', () => {
  let categoriaEntityFactory: ICategoriaEntityFactory;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoriaEntityFactory],
    }).compile();

    categoriaEntityFactory = module.get<CategoriaEntityFactory>(
      CategoriaEntityFactory,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Deve ser possível criar uma entidade utilizando uma factory de categoria entidade', async () => {
    const nome = 'Nome Categoria';
    const descricao = 'Descrição Categoria';
    const id = 'id Categoria';
    const categoriaentiry = categoriaEntityFactory.criarCategoriaEntidade(
      nome,
      descricao,
      id,
    );
    expect(categoriaentiry).toBeInstanceOf(CategoriaEntity);
    expect(categoriaentiry.nome).toEqual(nome);
    expect(categoriaentiry.descricao).toEqual(descricao);
    expect(categoriaentiry.id).toEqual(id);
  });
});
