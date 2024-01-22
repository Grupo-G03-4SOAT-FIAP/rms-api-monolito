import { Test, TestingModule } from '@nestjs/testing';
import {
  categoriaEntityMock,
  categoriaModelMock,
  categoriaRepositoryMock,
} from 'src/mocks/categoria.mock';
import { ProdutoFactory } from './produto.factory';
import { ICategoriaRepository } from 'src/domain/ports/categoria/categoria.repository.port';
import {
  atualizaProdutoDTOMock,
  criaProdutoDTOMock,
  produtoEntityMock,
} from 'src/mocks/produto.mock';
import { CategoriaNaoLocalizadaErro } from 'src/domain/exceptions/categoria.exception';

describe('ProdutoFactory', () => {
  let produtoFactory: ProdutoFactory;
  let categoriaId: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProdutoFactory,
        {
          provide: ICategoriaRepository,
          useValue: categoriaRepositoryMock,
        },
      ],
    }).compile();

    produtoFactory = module.get<ProdutoFactory>(ProdutoFactory);
    categoriaId = '0a14aa4e-75e7-405f-8301-81f60646c93d';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve criar a entidade produto com criaProdutoDTO', async () => {
    categoriaEntityMock.id = categoriaId;
    produtoEntityMock.categoria = categoriaEntityMock;
    categoriaRepositoryMock.buscarCategoriaPorId.mockReturnValue(
      categoriaModelMock,
    );

    const result =
      await produtoFactory.criarEntidadeProduto(criaProdutoDTOMock);

    expect(categoriaRepositoryMock.buscarCategoriaPorId).toHaveBeenCalledWith(
      categoriaId,
    );
    expect(result).toStrictEqual(produtoEntityMock);
  });

  it('deve criar a entidade produto com atualizaProdutoDTO', async () => {
    categoriaEntityMock.id = categoriaId;
    produtoEntityMock.categoria = categoriaEntityMock;
    categoriaRepositoryMock.buscarCategoriaPorId.mockReturnValue(
      categoriaModelMock,
    );

    const result = await produtoFactory.criarEntidadeProduto(
      atualizaProdutoDTOMock,
    );

    expect(categoriaRepositoryMock.buscarCategoriaPorId).toHaveBeenCalledWith(
      categoriaId,
    );
    expect(result).toStrictEqual(produtoEntityMock);
  });

  it('deve criar a entidade categoria de uma entidade produto', async () => {
    categoriaEntityMock.id = categoriaId;
    categoriaRepositoryMock.buscarCategoriaPorId.mockReturnValue(
      categoriaModelMock,
    );

    const result = await produtoFactory.criarEntidadeCategoria(categoriaId);

    expect(categoriaRepositoryMock.buscarCategoriaPorId).toHaveBeenCalledWith(
      categoriaId,
    );
    expect(result).toStrictEqual(categoriaEntityMock);
  });

  it('deve lançar uma exceção ao tentar criar a entidade produto com uma categoria inexistente', async () => {
    categoriaRepositoryMock.buscarCategoriaPorId.mockReturnValue(null);

    await expect(
      produtoFactory.criarEntidadeCategoria(categoriaId),
    ).rejects.toThrow(
      new CategoriaNaoLocalizadaErro('Categoria informada não existe'),
    );
    expect(categoriaRepositoryMock.buscarCategoriaPorId).toHaveBeenCalledWith(
      categoriaId,
    );
  });
});
