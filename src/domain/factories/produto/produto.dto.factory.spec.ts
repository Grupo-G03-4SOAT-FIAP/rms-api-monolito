import { Test, TestingModule } from '@nestjs/testing';
import { ProdutoDTOFactory } from './produto.dto.factory';
import { produtoDTOMock, produtoModelMock } from 'src/mocks/produto.mock';
import { ICategoriaDTOFactory } from 'src/domain/ports/categoria/categoria.dto.factory.port';
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

  it('deve criar um produtoDTO', async () => {
    categoriaDTOFactoryMock.criarCategoriaDTO.mockReturnValue(categoriaDTOMock);

    const result = await produtoDTOFactory.criarProdutoDTO(produtoModelMock);

    expect(categoriaDTOFactoryMock.criarCategoriaDTO).toHaveBeenCalledWith(
      produtoModelMock.categoria,
    );
    expect(result).toStrictEqual(produtoDTOMock);
  });

  it('deve criar uma lista de produtoDTO', async () => {
    categoriaDTOFactoryMock.criarCategoriaDTO.mockReturnValue(categoriaDTOMock);

    const result = await produtoDTOFactory.criarListaProdutoDTO([
      produtoModelMock,
    ]);

    expect(categoriaDTOFactoryMock.criarCategoriaDTO).toHaveBeenCalledWith(
      produtoModelMock.categoria,
    );
    expect(result).toStrictEqual([produtoDTOMock]);
  });

  it('deve criar uma lista vazia de produtoDTO', async () => {
    const result = await produtoDTOFactory.criarListaProdutoDTO([]);
    expect(result).toStrictEqual([]);
  });
});
