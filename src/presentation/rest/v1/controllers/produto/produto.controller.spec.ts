import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { ProdutoController } from './produto.controller';
import { IProdutoUseCase } from 'src/domain/produto/interfaces/produto.use_case.port';
import { CategoriaNaoLocalizadaErro } from 'src/domain/categoria/exceptions/categoria.exception';
import { ProdutoDuplicadoErro, ProdutoNaoLocalizadoErro } from 'src/domain/produto/exceptions/produto.exception';
import { atualizaProdutoDTOMock, criaProdutoDTOMock, produtoDTOMock, produtoUseCaseMock } from 'src/mocks/produto.mock';

describe('Produto', () => {
  let produtoController: ProdutoController;
  let produtoId: string;
  let categoriaId: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProdutoController,
        {
          provide: IProdutoUseCase,
          useValue: produtoUseCaseMock,
        },
      ],
    }).compile();

    produtoController = module.get<ProdutoController>(ProdutoController);
    produtoId = '0a14aa4e-75e7-405f-8301-81f60646c93d';
    categoriaId = '0a14aa4e-75e7-405f-8301-81f60646c93d';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve criar um produto', async () => {
    const HTTPResponse = {
      mensagem: 'Produto criado com sucesso',
      body: produtoDTOMock,
    };

    produtoUseCaseMock.criarProduto.mockReturnValue(HTTPResponse);

    const result = await produtoController.criar(criaProdutoDTOMock);

    expect(produtoUseCaseMock.criarProduto).toHaveBeenCalledWith(
      criaProdutoDTOMock,
    );
    expect(result).toStrictEqual(HTTPResponse);
  });

  it('deve criar um produto e retornar NotFoundError', async () => {
    produtoUseCaseMock.criarProduto.mockRejectedValue(
      new CategoriaNaoLocalizadaErro('Categoria informada não existe'),
    );

    await expect(produtoController.criar(criaProdutoDTOMock)).rejects.toThrow(
      new NotFoundException('Categoria informada não existe'),
    );
    expect(produtoUseCaseMock.criarProduto).toHaveBeenCalledWith(
      criaProdutoDTOMock,
    );
  });

  it('deve criar um produto e retornar ConflictError', async () => {
    produtoUseCaseMock.criarProduto.mockRejectedValue(
      new ProdutoDuplicadoErro('Existe um produto com esse nome'),
    );

    await expect(produtoController.criar(criaProdutoDTOMock)).rejects.toThrow(
      new ConflictException('Existe um produto com esse nome'),
    );
    expect(produtoUseCaseMock.criarProduto).toHaveBeenCalledWith(
      criaProdutoDTOMock,
    );
  });

  it('deve editar um produto', async () => {
    const HTTPResponse = {
      mensagem: 'Produto atualizado com sucesso',
      body: produtoDTOMock,
    };

    produtoUseCaseMock.editarProduto.mockReturnValue(HTTPResponse);

    const result = await produtoController.atualizar(
      produtoId,
      atualizaProdutoDTOMock,
    );

    expect(produtoUseCaseMock.editarProduto).toHaveBeenCalledWith(
      produtoId,
      criaProdutoDTOMock,
    );
    expect(result).toStrictEqual(HTTPResponse);
  });

  it('deve editar um produto e retornar NotFoundError', async () => {
    produtoUseCaseMock.editarProduto.mockRejectedValue(
      new ProdutoNaoLocalizadoErro('Produto informado não existe'),
    );

    await expect(
      produtoController.atualizar(produtoId, atualizaProdutoDTOMock),
    ).rejects.toThrow(new NotFoundException('Produto informado não existe'));
    expect(produtoUseCaseMock.editarProduto).toHaveBeenCalledWith(
      produtoId,
      atualizaProdutoDTOMock,
    );
  });

  it('deve editar um produto e retornar ConflictError', async () => {
    produtoUseCaseMock.editarProduto.mockRejectedValue(
      new ProdutoDuplicadoErro('Existe um produto com esse nome'),
    );

    await expect(
      produtoController.atualizar(produtoId, atualizaProdutoDTOMock),
    ).rejects.toThrow(new ConflictException('Existe um produto com esse nome'));
    expect(produtoUseCaseMock.editarProduto).toHaveBeenCalledWith(
      produtoId,
      atualizaProdutoDTOMock,
    );
  });

  it('deve deletar um produto', async () => {
    const HTTPResponse = {
      mensagem: 'Produto excluído com sucesso',
    };

    produtoUseCaseMock.excluirProduto.mockReturnValue(HTTPResponse);

    const result = await produtoController.remover(produtoId);

    expect(produtoUseCaseMock.excluirProduto).toHaveBeenCalledWith(produtoId);
    expect(result).toStrictEqual(HTTPResponse);
  });

  it('deve deletar um produto e retornar NotFoundError', async () => {
    produtoUseCaseMock.excluirProduto.mockRejectedValue(
      new ProdutoNaoLocalizadoErro('Produto informado não existe'),
    );

    await expect(produtoController.remover(produtoId)).rejects.toThrow(
      new NotFoundException('Produto informado não existe'),
    );
    expect(produtoUseCaseMock.excluirProduto).toHaveBeenCalledWith(produtoId);
  });

  it('deve buscar um produto', async () => {
    produtoUseCaseMock.buscarProduto.mockResolvedValue(produtoDTOMock);

    const result = await produtoController.buscar(produtoId);

    expect(produtoUseCaseMock.buscarProduto).toHaveBeenCalledWith(produtoId);
    expect(result).toStrictEqual(produtoDTOMock);
  });

  it('deve buscar um produto e retornar NotFoundError', async () => {
    produtoUseCaseMock.buscarProduto.mockRejectedValue(
      new ProdutoNaoLocalizadoErro('Produto informado não existe'),
    );

    await expect(produtoController.buscar(produtoId)).rejects.toThrow(
      new NotFoundException('Produto informado não existe'),
    );
    expect(produtoUseCaseMock.buscarProduto).toHaveBeenCalledWith(produtoId);
  });

  it('deve listar os produtos', async () => {
    produtoUseCaseMock.listarProdutos.mockResolvedValue([produtoDTOMock]);

    const result = await produtoController.listar();

    expect(produtoUseCaseMock.listarProdutos).toHaveBeenCalledWith();
    expect(result).toStrictEqual([produtoDTOMock]);
  });

  it('deve listar os produtos por categoria', async () => {
    produtoUseCaseMock.listarProdutosPorCategoria.mockResolvedValue([
      produtoDTOMock,
    ]);

    const result = await produtoController.listarPorCategoria(categoriaId);

    expect(produtoUseCaseMock.listarProdutosPorCategoria).toHaveBeenCalledWith(
      categoriaId,
    );
    expect(result).toStrictEqual([produtoDTOMock]);
  });

  it('deve listar os produtos por categoria e retornar NotFoundError', async () => {
    produtoUseCaseMock.listarProdutosPorCategoria.mockRejectedValue(
      new CategoriaNaoLocalizadaErro('Categoria informada não existe'),
    );

    await expect(
      produtoController.listarPorCategoria(categoriaId),
    ).rejects.toThrow(new NotFoundException('Categoria informada não existe'));
    expect(produtoUseCaseMock.listarProdutosPorCategoria).toHaveBeenCalledWith(
      categoriaId,
    );
  });
});
