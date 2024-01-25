import { Test, TestingModule } from '@nestjs/testing';
import { CategoriaUseCase } from './categoria.use_case';
import { ICategoriaRepository } from 'src/domain/categoria/interfaces/categoria.repository.port';
import { ICategoriaFactory } from 'src/domain/categoria/interfaces/categoria.factory.port';
import { ICategoriaDTOFactory } from 'src/domain/categoria/interfaces/categoria.dto.factory.port';
import {
  CategoriaDuplicadaErro,
  CategoriaNaoLocalizadaErro,
} from 'src/domain/categoria/exceptions/categoria.exception';
import {
  categoriaDTOFactoryMock,
  categoriaDTOMock,
  categoriaEntityMock,
  categoriaFactoryMock,
  categoriaRepositoryMock,
  criaCategoriaDTOMock,
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
    categoriaRepositoryMock.criarCategoria.mockReturnValue(categoriaEntityMock);
    categoriaDTOFactoryMock.criarCategoriaDTO.mockReturnValue(categoriaDTOMock);

    const result = await categoriaUseCase.criarCategoria(criaCategoriaDTOMock);

    expect(categoriaFactoryMock.criarEntidadeCategoria).toHaveBeenCalledWith(
      categoriaEntityMock.nome,
      categoriaEntityMock.descricao,
    );
    expect(categoriaRepositoryMock.criarCategoria).toHaveBeenCalledWith(
      categoriaEntityMock,
    );
    expect(categoriaDTOFactoryMock.criarCategoriaDTO).toHaveBeenCalledWith(
      categoriaEntityMock,
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
      categoriaEntityMock,
    );

    await expect(
      categoriaUseCase.criarCategoria(criaCategoriaDTOMock),
    ).rejects.toThrow(
      new CategoriaDuplicadaErro('Existe uma categoria com esse nome'),
    );
    expect(categoriaFactoryMock.criarEntidadeCategoria).toHaveBeenCalledWith(
      categoriaEntityMock.nome,
      categoriaEntityMock.descricao,
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
      categoriaEntityMock,
    );
    categoriaRepositoryMock.buscarCategoriaPorNome.mockReturnValue(null);
    categoriaRepositoryMock.editarCategoria.mockReturnValue(
      categoriaEntityMock,
    );
    categoriaDTOFactoryMock.criarCategoriaDTO.mockReturnValue(categoriaDTOMock);

    const result = await categoriaUseCase.editarCategoria(
      categoriaId,
      criaCategoriaDTOMock,
    );

    expect(categoriaFactoryMock.criarEntidadeCategoria).toHaveBeenCalledWith(
      categoriaEntityMock.nome,
      categoriaEntityMock.descricao,
    );
    expect(categoriaRepositoryMock.buscarCategoriaPorId).toHaveBeenCalledWith(
      categoriaId,
    );
    expect(categoriaRepositoryMock.editarCategoria).toHaveBeenCalledWith(
      categoriaId,
      categoriaEntityMock,
    );
    expect(categoriaDTOFactoryMock.criarCategoriaDTO).toHaveBeenCalledWith(
      categoriaEntityMock,
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
      categoriaEntityMock,
    );
    categoriaRepositoryMock.buscarCategoriaPorNome.mockReturnValue(
      categoriaEntityMock,
    );

    await expect(
      categoriaUseCase.editarCategoria(categoriaId, criaCategoriaDTOMock),
    ).rejects.toThrow(
      new CategoriaDuplicadaErro('Existe uma categoria com esse nome'),
    );
    expect(categoriaFactoryMock.criarEntidadeCategoria).toHaveBeenCalledWith(
      categoriaEntityMock.nome,
      categoriaEntityMock.descricao,
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
      categoriaEntityMock.nome,
      categoriaEntityMock.descricao,
    );
    expect(categoriaRepositoryMock.buscarCategoriaPorId).toHaveBeenCalledWith(
      categoriaId,
    );
  });

  it('deve excluir uma categoria com sucesso', async () => {
    categoriaRepositoryMock.buscarCategoriaPorId.mockReturnValue(
      categoriaEntityMock,
    );
    categoriaRepositoryMock.excluirCategoria.mockReturnValue(
      categoriaEntityMock,
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
      categoriaEntityMock,
    );
    categoriaDTOFactoryMock.criarCategoriaDTO.mockReturnValue(categoriaDTOMock);

    const result = await categoriaUseCase.buscarCategoria(categoriaId);

    expect(categoriaRepositoryMock.buscarCategoriaPorId).toHaveBeenCalledWith(
      categoriaId,
    );
    expect(categoriaDTOFactoryMock.criarCategoriaDTO).toHaveBeenCalledWith(
      categoriaEntityMock,
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
      categoriaEntityMock,
    ]);
    categoriaDTOFactoryMock.criarListaCategoriaDTO.mockReturnValue([
      categoriaDTOMock,
    ]);

    const result = await categoriaUseCase.listarCategorias();

    expect(categoriaRepositoryMock.listarCategorias).toHaveBeenCalled();
    expect(categoriaDTOFactoryMock.criarListaCategoriaDTO).toHaveBeenCalledWith(
      [categoriaEntityMock],
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
