import { Test, TestingModule } from '@nestjs/testing';
import { CategoriaDTOFactory } from './categoria.dto.factory';
import { categoriaDTOMock, categoriaModelMock } from 'src/mocks/categoria.mock';

describe('CategoriaDTOFactory', () => {
  let categoriaDTOFactory: CategoriaDTOFactory;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoriaDTOFactory],
    }).compile();

    categoriaDTOFactory = module.get<CategoriaDTOFactory>(CategoriaDTOFactory);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve criar um categoriaDTO', () => {
    const result = categoriaDTOFactory.criarCategoriaDTO(categoriaModelMock);
    expect(result).toStrictEqual(categoriaDTOMock);
  });

  it('deve criar uma lista de categoriaDTO', () => {
    const result = categoriaDTOFactory.criarListaCategoriaDTO([
      categoriaModelMock,
    ]);
    expect(result).toStrictEqual([categoriaDTOMock]);
  });

  it('deve criar uma lista vazia de categoriaDTO', () => {
    const result = categoriaDTOFactory.criarListaCategoriaDTO([]);
    expect(result).toStrictEqual([]);
  });
});
