import { Test, TestingModule } from '@nestjs/testing';
import { ProdutoDTOFactory } from './produto.dto.factory';
import { produtoDTOMock, produtoEntityMock, produtoEntityNotIdMock, produtoModelMock } from 'src/mocks/produto.mock';
import { ICategoriaDTOFactory } from 'src/domain/categoria/interfaces/categoria.dto.factory.port';
import {
  categoriaDTOFactoryMock,
  categoriaDTOMock,
} from 'src/mocks/categoria.mock';

describe('ProdutoDTOFactory', () => {
  let produtoDTOFactory: ProdutoDTOFactory;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProdutoDTOFactory,
        {
          provide: ICategoriaDTOFactory,
          useValue: categoriaDTOFactoryMock,
        },
      ],
    }).compile();

    produtoDTOFactory = module.get<ProdutoDTOFactory>(ProdutoDTOFactory);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve criar um produtoDTO', () => {
    categoriaDTOFactoryMock.criarCategoriaDTO.mockReturnValue(categoriaDTOMock);

    const result = produtoDTOFactory.criarProdutoDTO(produtoEntityMock);

    expect(categoriaDTOFactoryMock.criarCategoriaDTO).toHaveBeenCalledWith(
      produtoEntityMock.categoria,
    );
    expect(result).toStrictEqual(produtoDTOMock);
  });

  it('deve criar uma lista de produtoDTO', () => {
    categoriaDTOFactoryMock.criarCategoriaDTO.mockReturnValue(categoriaDTOMock);

    const result = produtoDTOFactory.criarListaProdutoDTO([produtoEntityMock]);

    expect(categoriaDTOFactoryMock.criarCategoriaDTO).toHaveBeenCalledWith(
      produtoEntityMock.categoria,
    );
    expect(result).toStrictEqual([produtoDTOMock]);
  });

  it('deve criar uma lista vazia de produtoDTO', () => {
    const result = produtoDTOFactory.criarListaProdutoDTO([]);
    expect(result).toStrictEqual([]);
  });
});
