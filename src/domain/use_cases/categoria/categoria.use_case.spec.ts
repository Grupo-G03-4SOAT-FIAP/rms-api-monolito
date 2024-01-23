import { Test, TestingModule } from '@nestjs/testing';
import { ICategoriaRepository } from '../../../domain/ports/categoria/categoria.repository.port';
import { CategoriaUseCase } from './categoria.use_case';
import {
  CategoriaDuplicadaErro,
  CategoriaNaoLocalizadaErro,
} from '../../../domain/exceptions/categoria.exception';
import { ICategoriaFactory } from 'src/domain/ports/categoria/categoria.factory.port';
import { ICategoriaDTOFactory } from 'src/domain/ports/categoria/categoria.dto.factory.port';
import {
  categoriaModelMock,
  categoriaRepositoryMock,
  categoriaFactoryMock,
  categoriaDTOFactoryMock,
  criaCategoriaDTOMock,
  categoriaDTOMock,
  categoriaEntityMock,
} from 'src/mocks/categoria.mock';

describe('CategoriaUseCase', () => {
  let categoriaUseCase: CategoriaUseCase;
  let categoriaId: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriaUseCase,
        {
          provide: ICategoriaRepository,
          useValue: categoriaRepositoryMock,
        },
        {
          provide: ICategoriaFactory,
          useValue: categoriaFactoryMock,
        },
        {
          provide: ICategoriaDTOFactory,
          useValue: categoriaDTOFactoryMock,
        },
      ],
    }).compile();

    categoriaUseCase = module.get<CategoriaUseCase>(CategoriaUseCase);
    categoriaId = '0a14aa4e-75e7-405f-8301-81f60646c93d';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve criar uma categoria com sucesso', async () => {
    categoriaFactoryMock.criarEntidadeCategoria.mockReturnValue(
      categoriaEntityMock,
    );
    categoriaRepositoryMock.buscarCategoriaPorNome.mockReturnValue(null);
    categoriaRepositoryMock.criarCategoria.mockReturnValue(categoriaModelMock);
    categoriaDTOFactoryMock.criarCategoriaDTO.mockReturnValue(categoriaDTOMock);

    const result = await categoriaUseCase.criarCategoria(criaCategoriaDTOMock);

    expect(categoriaFactoryMock.criarEntidadeCategoria).toHaveBeenCalledWith(
      criaCategoriaDTOMock,
    );
    expect(categoriaRepositoryMock.criarCategoria).toHaveBeenCalledWith(
      categoriaEntityMock,
    );
    expect(categoriaDTOFactoryMock.criarCategoriaDTO).toHaveBeenCalledWith(
      categoriaModelMock,
    );
    expect(result).toStrictEqual({
      mensagem: 'Categoria criada com sucesso',
      body: categoriaDTOMock,
    });
  });

  it('deve retornar erro ao criar uma categoria com nome duplicado', async () => {
    categoriaFactoryMock.criarEntidadeCategoria.mockReturnValue(
      categoriaEntityMock,
    );
    categoriaRepositoryMock.buscarCategoriaPorNome.mockReturnValue(
      categoriaModelMock,
    );

    await expect(
      categoriaUseCase.criarCategoria(criaCategoriaDTOMock),
    ).rejects.toThrow(
      new CategoriaDuplicadaErro('Existe uma categoria com esse nome'),
    );
    expect(categoriaFactoryMock.criarEntidadeCategoria).toHaveBeenCalledWith(
      criaCategoriaDTOMock,
    );
    expect(categoriaRepositoryMock.buscarCategoriaPorNome).toHaveBeenCalledWith(
      categoriaEntityMock.nome,
    );
  });

  it('deve editar uma categoria com sucesso', async () => {
    categoriaFactoryMock.criarEntidadeCategoria.mockReturnValue(
      categoriaEntityMock,
    );
    categoriaRepositoryMock.buscarCategoriaPorId.mockReturnValue(
      categoriaModelMock,
    );
    categoriaRepositoryMock.buscarCategoriaPorNome.mockReturnValue(null);
    categoriaRepositoryMock.editarCategoria.mockReturnValue(categoriaModelMock);
    categoriaDTOFactoryMock.criarCategoriaDTO.mockReturnValue(categoriaDTOMock);

    const result = await categoriaUseCase.editarCategoria(
      categoriaId,
      criaCategoriaDTOMock,
    );

    expect(categoriaFactoryMock.criarEntidadeCategoria).toHaveBeenCalledWith(
      criaCategoriaDTOMock,
    );
    expect(categoriaRepositoryMock.buscarCategoriaPorId).toHaveBeenCalledWith(
      categoriaId,
    );
    expect(categoriaRepositoryMock.editarCategoria).toHaveBeenCalledWith(
      categoriaId,
      categoriaEntityMock,
    );
    expect(categoriaDTOFactoryMock.criarCategoriaDTO).toHaveBeenCalledWith(
      categoriaModelMock,
    );
    expect(result).toStrictEqual({
      mensagem: 'Categoria atualizada com sucesso',
      body: categoriaDTOMock,
    });
  });

  it('deve retornar erro ao editar uma categoria com nome duplicado', async () => {
    categoriaFactoryMock.criarEntidadeCategoria.mockReturnValue(
      categoriaEntityMock,
    );
    categoriaRepositoryMock.buscarCategoriaPorId.mockReturnValue(
      categoriaModelMock,
    );
    categoriaRepositoryMock.buscarCategoriaPorNome.mockReturnValue(
      categoriaModelMock,
    );

    await expect(
      categoriaUseCase.editarCategoria(categoriaId, criaCategoriaDTOMock),
    ).rejects.toThrow(
      new CategoriaDuplicadaErro('Existe uma categoria com esse nome'),
    );
    expect(categoriaFactoryMock.criarEntidadeCategoria).toHaveBeenCalledWith(
      criaCategoriaDTOMock,
    );
    expect(categoriaRepositoryMock.buscarCategoriaPorId).toHaveBeenCalledWith(
      categoriaId,
    );
    expect(categoriaRepositoryMock.buscarCategoriaPorNome).toHaveBeenCalledWith(
      categoriaEntityMock.nome,
    );
  });

  it('deve retornar erro ao editar uma categoria que não existe', async () => {
    categoriaFactoryMock.criarEntidadeCategoria.mockReturnValue(
      categoriaEntityMock,
    );
    categoriaRepositoryMock.buscarCategoriaPorId.mockReturnValue(null);

    await expect(
      categoriaUseCase.editarCategoria(categoriaId, criaCategoriaDTOMock),
    ).rejects.toThrow(
      new CategoriaNaoLocalizadaErro('Categoria informada não existe'),
    );
    expect(categoriaFactoryMock.criarEntidadeCategoria).toHaveBeenCalledWith(
      criaCategoriaDTOMock,
    );
    expect(categoriaRepositoryMock.buscarCategoriaPorId).toHaveBeenCalledWith(
      categoriaId,
    );
  });

  it('deve excluir uma categoria com sucesso', async () => {
    categoriaRepositoryMock.buscarCategoriaPorId.mockReturnValue(
      categoriaModelMock,
    );
    categoriaRepositoryMock.excluirCategoria.mockReturnValue(
      categoriaModelMock,
    );

    const result = await categoriaUseCase.excluirCategoria(categoriaId);

    expect(categoriaRepositoryMock.buscarCategoriaPorId).toHaveBeenCalledWith(
      categoriaId,
    );
    expect(categoriaRepositoryMock.excluirCategoria).toHaveBeenCalledWith(
      categoriaId,
    );
    expect(result).toStrictEqual({
      mensagem: 'Categoria excluída com sucesso',
    });
  });

  it('deve retornar erro ao excluir uma categoria que não existe', async () => {
    categoriaRepositoryMock.buscarCategoriaPorId.mockReturnValue(null);

    await expect(
      categoriaUseCase.excluirCategoria(categoriaId),
    ).rejects.toThrow(
      new CategoriaNaoLocalizadaErro('Categoria informada não existe'),
    );
    expect(categoriaRepositoryMock.buscarCategoriaPorId).toHaveBeenCalledWith(
      categoriaId,
    );
  });

  it('deve buscar uma categoria por id com sucesso', async () => {
    categoriaRepositoryMock.buscarCategoriaPorId.mockReturnValue(
      categoriaModelMock,
    );
    categoriaDTOFactoryMock.criarCategoriaDTO.mockReturnValue(categoriaDTOMock);

    const result = await categoriaUseCase.buscarCategoria(categoriaId);

    expect(categoriaRepositoryMock.buscarCategoriaPorId).toHaveBeenCalledWith(
      categoriaId,
    );
    expect(categoriaDTOFactoryMock.criarCategoriaDTO).toHaveBeenCalledWith(
      categoriaModelMock,
    );
    expect(result).toStrictEqual(categoriaDTOMock);
  });

  it('deve retornar erro ao buscar uma categoria por id que não existe', async () => {
    categoriaRepositoryMock.buscarCategoriaPorId.mockReturnValue(null);

    await expect(categoriaUseCase.buscarCategoria(categoriaId)).rejects.toThrow(
      new CategoriaNaoLocalizadaErro('Categoria informada não existe'),
    );
    expect(categoriaRepositoryMock.buscarCategoriaPorId).toHaveBeenCalledWith(
      categoriaId,
    );
  });

  it('deve listar categorias com sucesso', async () => {
    categoriaRepositoryMock.listarCategorias.mockReturnValue([
      categoriaModelMock,
    ]);
    categoriaDTOFactoryMock.criarListaCategoriaDTO.mockReturnValue([
      categoriaDTOMock,
    ]);

    const result = await categoriaUseCase.listarCategorias();

    expect(categoriaRepositoryMock.listarCategorias).toHaveBeenCalled();
    expect(categoriaDTOFactoryMock.criarListaCategoriaDTO).toHaveBeenCalledWith(
      [categoriaModelMock],
    );
    expect(result).toStrictEqual([categoriaDTOMock]);
  });

  it('deve retornar lista vazia ao listar categorias', async () => {
    categoriaRepositoryMock.listarCategorias.mockReturnValue([]);
    categoriaDTOFactoryMock.criarListaCategoriaDTO.mockReturnValue([]);

    const result = await categoriaUseCase.listarCategorias();

    expect(categoriaRepositoryMock.listarCategorias).toHaveBeenCalled();
    expect(categoriaDTOFactoryMock.criarListaCategoriaDTO).toHaveBeenCalledWith(
      [],
    );
    expect(result).toStrictEqual([]);
  });
});
