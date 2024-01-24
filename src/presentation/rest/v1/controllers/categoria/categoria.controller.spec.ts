import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CategoriaController } from './categoria.controller';
import { ICategoriaUseCase } from 'src/domain/categoria/interfaces/categoria.use_case.port';
import { CategoriaDuplicadaErro, CategoriaNaoLocalizadaErro } from 'src/domain/categoria/exceptions/categoria.exception';
import { atualizaCategoriaDTOMock, categoriaDTOMock, categoriaUseCaseMock, criaCategoriaDTOMock } from 'src/mocks/categoria.mock';

describe('Categoria', () => {
  let categoriaController: CategoriaController;
  let categoriaId: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriaController],
      providers: [
        {
          provide: ICategoriaUseCase,
          useValue: categoriaUseCaseMock,
        },
      ],
    }).compile();

    categoriaController = module.get<CategoriaController>(CategoriaController);
    categoriaId = '0a14aa4e-75e7-405f-8301-81f60646c93d';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve criar uma categoria', async () => {
    const HTTPResponse = {
      mensagem: 'Categoria criada com sucesso',
      body: categoriaDTOMock,
    };

    categoriaUseCaseMock.criarCategoria.mockReturnValue(HTTPResponse);

    const result = await categoriaController.criar(criaCategoriaDTOMock);

    expect(categoriaUseCaseMock.criarCategoria).toHaveBeenCalledWith(
      criaCategoriaDTOMock,
    );
    expect(result).toStrictEqual(HTTPResponse);
  });

  it('deve criar uma categoria e retornar ConflictError', async () => {
    categoriaUseCaseMock.criarCategoria.mockRejectedValue(
      new CategoriaDuplicadaErro('Existe uma categoria com esse nome'),
    );

    await expect(
      categoriaController.criar(criaCategoriaDTOMock),
    ).rejects.toThrow(
      new ConflictException('Existe uma categoria com esse nome'),
    );
    expect(categoriaUseCaseMock.criarCategoria).toHaveBeenCalledWith(
      criaCategoriaDTOMock,
    );
  });

  it('deve editar uma categoria', async () => {
    const HTTPResponse = {
      mensagem: 'Categoria atualizada com sucesso',
      body: categoriaDTOMock,
    };

    categoriaUseCaseMock.editarCategoria.mockReturnValue(HTTPResponse);

    const result = await categoriaController.atualizar(
      categoriaId,
      atualizaCategoriaDTOMock,
    );

    expect(categoriaUseCaseMock.editarCategoria).toHaveBeenCalledWith(
      categoriaId,
      atualizaCategoriaDTOMock,
    );
    expect(result).toStrictEqual(HTTPResponse);
  });

  it('deve editar uma categoria e retornar NotFoundError', async () => {
    categoriaUseCaseMock.editarCategoria.mockRejectedValue(
      new CategoriaNaoLocalizadaErro('Categoria informada não existe'),
    );

    await expect(
      categoriaController.atualizar(categoriaId, atualizaCategoriaDTOMock),
    ).rejects.toThrow(new NotFoundException('Categoria informada não existe'));
    expect(categoriaUseCaseMock.editarCategoria).toHaveBeenCalledWith(
      categoriaId,
      atualizaCategoriaDTOMock,
    );
  });

  it('deve editar uma categoria e retornar ConflictError', async () => {
    categoriaUseCaseMock.editarCategoria.mockRejectedValue(
      new CategoriaDuplicadaErro('Existe uma categoria com esse nome'),
    );

    await expect(
      categoriaController.atualizar(categoriaId, atualizaCategoriaDTOMock),
    ).rejects.toThrow(
      new ConflictException('Existe uma categoria com esse nome'),
    );
    expect(categoriaUseCaseMock.editarCategoria).toHaveBeenCalledWith(
      categoriaId,
      atualizaCategoriaDTOMock,
    );
  });

  it('deve deletar uma categoria', async () => {
    const HTTPResponse = {
      mensagem: 'Categoria excluída com sucesso',
    };

    categoriaUseCaseMock.excluirCategoria.mockReturnValue(HTTPResponse);

    const result = await categoriaController.remover(categoriaId);

    expect(categoriaUseCaseMock.excluirCategoria).toHaveBeenCalledWith(
      categoriaId,
    );
    expect(result).toStrictEqual(HTTPResponse);
  });

  it('deve deletar uma categoria e retornar NotFoundError', async () => {
    categoriaUseCaseMock.excluirCategoria.mockRejectedValue(
      new CategoriaNaoLocalizadaErro('Categoria informada não existe'),
    );

    await expect(categoriaController.remover(categoriaId)).rejects.toThrow(
      new NotFoundException('Categoria informada não existe'),
    );
    expect(categoriaUseCaseMock.excluirCategoria).toHaveBeenCalledWith(
      categoriaId,
    );
  });

  it('deve buscar uma categoria', async () => {
    categoriaUseCaseMock.buscarCategoria.mockReturnValue(categoriaDTOMock);

    const result = await categoriaController.buscar(categoriaId);

    expect(categoriaUseCaseMock.buscarCategoria).toHaveBeenCalledWith(
      categoriaId,
    );
    expect(result).toStrictEqual(categoriaDTOMock);
  });

  it('deve buscar uma categoria e retornar NotFoundError', async () => {
    categoriaUseCaseMock.buscarCategoria.mockRejectedValue(
      new CategoriaNaoLocalizadaErro('Categoria informada não existe'),
    );

    await expect(categoriaController.buscar(categoriaId)).rejects.toThrow(
      new NotFoundException('Categoria informada não existe'),
    );
    expect(categoriaUseCaseMock.buscarCategoria).toHaveBeenCalledWith(
      categoriaId,
    );
  });

  it('deve listar as categorias', async () => {
    categoriaUseCaseMock.listarCategorias.mockReturnValue([categoriaDTOMock]);

    const result = await categoriaController.listar();

    expect(categoriaUseCaseMock.listarCategorias).toHaveBeenCalledWith();
    expect(result).toStrictEqual([categoriaDTOMock]);
  });
});
