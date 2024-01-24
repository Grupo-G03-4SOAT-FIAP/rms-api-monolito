import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { ProdutoRepository } from './produto.repository';
import { ProdutoModel } from '../../models/produto.model';
import {
  produtoEntityMock,
  produtoModelMock,
  produtoTypeORMMock,
} from 'src/mocks/produto.mock';

class softDeleteMock {
  softDelete: jest.Mock = jest.fn();
}

const produtoSoftDeleteMock = new softDeleteMock();

describe('ProdutoRepository', () => {
  let produtoRepository: ProdutoRepository;
  let produtoId: string;
  let categoriaId: string;
  let nomeProduto: string;
  let relations: string[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProdutoRepository,
        {
          provide: getRepositoryToken(ProdutoModel),
          useValue: produtoTypeORMMock,
        },
      ],
    }).compile();

    produtoRepository = module.get<ProdutoRepository>(ProdutoRepository);
    produtoId = '0a14aa4e-75e7-405f-8301-81f60646c93d';
    categoriaId = '0a14aa4e-75e7-405f-8301-81f60646c93d';
    nomeProduto = 'Produto X';
    relations = ['categoria'];
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve criar um produto', async () => {
    produtoTypeORMMock.create.mockReturnValue(produtoModelMock);
    produtoTypeORMMock.save.mockResolvedValue(
      Promise.resolve(produtoModelMock),
    );

    const result = await produtoRepository.criarProduto(produtoEntityMock);

    expect(produtoTypeORMMock.create).toHaveBeenCalledWith(produtoEntityMock);
    expect(produtoTypeORMMock.save).toHaveBeenCalledWith(produtoModelMock);
    expect(result).toBe(produtoModelMock);
  });

  it('deve editar um produto', async () => {
    produtoTypeORMMock.create.mockReturnValue(produtoModelMock);
    produtoTypeORMMock.findOne.mockResolvedValue(
      Promise.resolve(produtoModelMock),
    );

    const result = await produtoRepository.editarProduto(
      produtoId,
      produtoEntityMock,
    );

    expect(produtoTypeORMMock.create).toHaveBeenCalledWith(produtoEntityMock);
    expect(produtoTypeORMMock.update).toHaveBeenCalledWith(
      produtoId,
      produtoModelMock,
    );
    expect(produtoTypeORMMock.findOne).toHaveBeenCalledWith({
      where: { id: produtoId },
      relations: relations,
    });
    expect(result).toBe(produtoModelMock);
  });

  it('deve excluir uma categoria', async () => {
    produtoSoftDeleteMock.softDelete.mockResolvedValue({ affected: 1 });

    const produtoService = new ProdutoRepository(produtoSoftDeleteMock as any); // Usar "any" para evitar problemas de tipo

    await produtoService.excluirProduto(produtoId);

    expect(produtoSoftDeleteMock.softDelete).toHaveBeenCalledWith({
      id: produtoId,
    });
  });

  it('deve buscar um produto por id', async () => {
    produtoTypeORMMock.findOne.mockResolvedValue(
      Promise.resolve(produtoModelMock),
    );

    const result = await produtoRepository.buscarProdutoPorId(produtoId);

    expect(produtoTypeORMMock.findOne).toHaveBeenCalledWith({
      where: { id: produtoId },
      relations: relations,
    });
    expect(result).toBe(produtoModelMock);
  });

  it('deve buscar um produto por id e retornar nulo', async () => {
    produtoTypeORMMock.findOne.mockResolvedValue(null);

    const result = await produtoRepository.buscarProdutoPorId(produtoId);

    expect(produtoTypeORMMock.findOne).toHaveBeenCalledWith({
      where: { id: produtoId },
      relations: relations,
    });
    expect(result).toBe(null);
  });

  it('deve buscar um produto por nome', async () => {
    produtoTypeORMMock.findOne.mockResolvedValue(
      Promise.resolve(produtoModelMock),
    );

    const result = await produtoRepository.buscarProdutoPorNome(nomeProduto);

    expect(produtoTypeORMMock.findOne).toHaveBeenCalledWith({
      where: { nome: nomeProduto },
      relations: relations,
    });
    expect(result).toBe(produtoModelMock);
  });

  it('deve buscar um produto por nome e retornar nulo', async () => {
    produtoTypeORMMock.findOne.mockResolvedValue(null);

    const result = await produtoRepository.buscarProdutoPorNome(nomeProduto);

    expect(produtoTypeORMMock.findOne).toHaveBeenCalledWith({
      where: { nome: nomeProduto },
      relations: relations,
    });
    expect(result).toBe(null);
  });

  it('deve listar todos produtos', async () => {
    const listaProdutos = [
      produtoModelMock,
      produtoModelMock,
      produtoModelMock,
    ];
    produtoTypeORMMock.find.mockResolvedValue(Promise.resolve(listaProdutos));

    const result = await produtoRepository.listarProdutos();

    expect(produtoTypeORMMock.find).toHaveBeenCalledWith({
      relations: relations,
    });
    expect(result).toBe(listaProdutos);
  });

  it('deve retornar uma lista vazia de produtos', async () => {
    const listaProdutos = [];
    produtoTypeORMMock.find.mockResolvedValue(Promise.resolve(listaProdutos));

    const resultado = await produtoRepository.listarProdutos();

    expect(produtoTypeORMMock.find).toHaveBeenCalledWith({
      relations: relations,
    });
    expect(resultado).toBe(listaProdutos);
  });

  it('deve listar produtos por categoria', async () => {
    const listaProdutos = [
      produtoModelMock,
      produtoModelMock,
      produtoModelMock,
    ];
    produtoTypeORMMock.find.mockResolvedValue(Promise.resolve(listaProdutos));

    const result =
      await produtoRepository.listarProdutosPorCategoria(categoriaId);

    expect(produtoTypeORMMock.find).toHaveBeenCalledWith({
      where: { categoria: { id: categoriaId } },
      relations: relations,
    });
    expect(result).toBe(listaProdutos);
  });

  it('deve retornar uma lista vazia de produtos por categoria', async () => {
    const listaProdutos = [];
    produtoTypeORMMock.find.mockResolvedValue(Promise.resolve(listaProdutos));

    const result =
      await produtoRepository.listarProdutosPorCategoria(categoriaId);

    expect(produtoTypeORMMock.find).toHaveBeenCalledWith({
      where: { categoria: { id: categoriaId } },
      relations: relations,
    });
    expect(result).toBe(listaProdutos);
  });
});
