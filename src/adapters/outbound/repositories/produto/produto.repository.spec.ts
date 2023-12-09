import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { ProdutoEntity } from 'src/domain/entities/produto.entity';
import { CategoriaEntity } from 'src/domain/entities/categoria.entity';
import { Repository } from 'typeorm';
import { ProdutoModel } from '../../models/produto.model';
import { CategoriaModel } from '../../models/categoria.model';
import { ProdutoRepository } from './produto.repository';

const categoriaEntity = new CategoriaEntity(
  'Lanche',
  'Lanche X Tudo',
  '0a14aa4e-75e7-405f-8301-81f60646c93d',
);

const produtoEntity = new ProdutoEntity(
  'Produto X',
  categoriaEntity,
  5.0,
  'http://',
  'Teste Produto X',
  '0a14aa4e-75e7-405f-8301-81f60646c93d',
);

const categoriaModel = new CategoriaModel();
categoriaModel.id = '0a14aa4e-75e7-405f-8301-81f60646c93d';
categoriaModel.nome = 'Lanche';
categoriaModel.descricao = 'Lanche X Tudo';
categoriaModel.produtos = null;
categoriaModel.criadoEm = new Date().toISOString();
categoriaModel.atualizadoEm = new Date().toISOString();
categoriaModel.excluidoEm = new Date().toISOString();

const produtoModel = new ProdutoModel();
produtoModel.id = '0a14aa4e-75e7-405f-8301-81f60646c93d';
produtoModel.nome = 'Produto X';
produtoModel.descricao = 'Teste Produto X';
produtoModel.valorUnitario = 5.0;
produtoModel.imagemUrl = 'http://';
produtoModel.categoria = categoriaModel;
produtoModel.criadoEm = new Date().toISOString();
produtoModel.atualizadoEm = new Date().toISOString();
produtoModel.excluidoEm = new Date().toISOString();

class ProdutoRepositoryMock {
  softDelete: jest.Mock = jest.fn();
}

const produtoRepositoryMock = new ProdutoRepositoryMock();

describe('ProdutoRepository', () => {
  let produtoRepository: ProdutoRepository;
  let mockProdutoModel: jest.Mocked<Repository<ProdutoModel>>;

  beforeEach(async () => {
    mockProdutoModel = {
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
    } as Partial<Repository<ProdutoModel>> as jest.Mocked<
      Repository<ProdutoModel>
    >;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProdutoRepository,
        {
          provide: getRepositoryToken(ProdutoModel),
          useValue: mockProdutoModel,
        },
      ],
    }).compile();

    produtoRepository = module.get<ProdutoRepository>(ProdutoRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve criar um produto', async () => {
    mockProdutoModel.create.mockReturnValue(produtoModel);
    mockProdutoModel.save.mockResolvedValue(Promise.resolve(produtoModel));

    const resultado = await produtoRepository.criarProduto(produtoEntity);

    expect(mockProdutoModel.create).toHaveBeenCalledWith(produtoEntity);
    expect(mockProdutoModel.save).toHaveBeenCalledWith(produtoModel);
    expect(resultado).toBe(produtoModel);
  });

  it('deve editar um produto', async () => {
    mockProdutoModel.create.mockReturnValue(produtoModel);
    mockProdutoModel.save.mockResolvedValue(Promise.resolve(produtoModel));
    mockProdutoModel.findOne.mockResolvedValue(Promise.resolve(produtoModel));

    const produtoId = '0a14aa4e-75e7-405f-8301-81f60646c93d';
    const resultado = await produtoRepository.editarProduto(
      produtoId,
      produtoEntity,
    );

    expect(mockProdutoModel.create).toHaveBeenCalledWith(produtoEntity);
    expect(mockProdutoModel.update).toHaveBeenCalledWith(
      produtoId,
      produtoModel,
    );
    expect(mockProdutoModel.findOne).toHaveBeenCalledWith({
      where: { id: produtoId },
      relations: ['categoria'],
    });
    expect(resultado).toBe(produtoModel);
  });

  it('deve excluir uma categoria', async () => {
    const produtoId = '0a14aa4e-75e7-405f-8301-81f60646c93d';
    produtoRepositoryMock.softDelete.mockResolvedValue({ affected: 1 });

    const produtoService = new ProdutoRepository(produtoRepositoryMock as any); // Usar "any" para evitar problemas de tipo

    await produtoService.excluirProduto(produtoId);

    expect(produtoRepositoryMock.softDelete).toHaveBeenCalledWith({
      id: produtoId,
    });
  });

  it('deve buscar um produto por id', async () => {
    mockProdutoModel.findOne.mockResolvedValue(Promise.resolve(produtoModel));

    const produtoId = '0a14aa4e-75e7-405f-8301-81f60646c93d';
    const resultado = await produtoRepository.buscarProdutoPorId(produtoId);

    expect(mockProdutoModel.findOne).toHaveBeenCalledWith({
      where: { id: produtoId },
      relations: ['categoria'],
    });
    expect(resultado).toBe(produtoModel);
  });

  it('deve buscar um produto por id e retornar nulo', async () => {
    mockProdutoModel.findOne.mockResolvedValue(null);

    const produtoId = '0a14aa4e-75e7-405f-8301-81f60646c93d';
    const resultado = await produtoRepository.buscarProdutoPorId(produtoId);

    expect(mockProdutoModel.findOne).toHaveBeenCalledWith({
      where: { id: produtoId },
      relations: ['categoria'],
    });
    expect(resultado).toBe(null);
  });

  it('deve buscar um produto por nome', async () => {
    mockProdutoModel.findOne.mockResolvedValue(Promise.resolve(produtoModel));

    const nomeProduto = 'Produto X';
    const resultado = await produtoRepository.buscarProdutoPorNome(nomeProduto);

    expect(mockProdutoModel.findOne).toHaveBeenCalledWith({
      where: { nome: nomeProduto },
      relations: ['categoria'],
    });
    expect(resultado).toBe(produtoModel);
  });

  it('deve buscar um produto por nome e retornar nulo', async () => {
    mockProdutoModel.findOne.mockResolvedValue(null);

    const nomeProduto = 'Produto X';
    const resultado = await produtoRepository.buscarProdutoPorNome(nomeProduto);

    expect(mockProdutoModel.findOne).toHaveBeenCalledWith({
      where: { nome: nomeProduto },
      relations: ['categoria'],
    });
    expect(resultado).toBe(null);
  });

  it('deve listar todos produtos', async () => {
    const listaProdutos = [produtoModel, produtoModel, produtoModel];
    mockProdutoModel.find.mockResolvedValue(Promise.resolve(listaProdutos));

    const resultado = await produtoRepository.listarProdutos();

    expect(mockProdutoModel.find).toHaveBeenCalledWith({
      relations: ['categoria'],
    });
    expect(resultado).toBe(listaProdutos);
  });

  it('deve retornar uma lista vazia de produtos', async () => {
    const listaProdutos = [];
    mockProdutoModel.find.mockResolvedValue(Promise.resolve(listaProdutos));

    const resultado = await produtoRepository.listarProdutos();

    expect(mockProdutoModel.find).toHaveBeenCalledWith({
      relations: ['categoria'],
    });
    expect(resultado).toBe(listaProdutos);
  });

  it('deve listar produtos por categoria', async () => {
    const listaProdutos = [produtoModel, produtoModel, produtoModel];
    mockProdutoModel.find.mockResolvedValue(Promise.resolve(listaProdutos));

    const categoriaId = '0a14aa4e-75e7-405f-8301-81f60646c93d';
    const resultado =
      await produtoRepository.listarProdutosPorCategoria(categoriaId);

    expect(mockProdutoModel.find).toHaveBeenCalledWith({
      where: { categoria: { id: categoriaId } },
      relations: ['categoria'],
    });
    expect(resultado).toBe(listaProdutos);
  });

  it('deve retornar uma lista vazia de produtos por categoria', async () => {
    const listaProdutos = [];
    mockProdutoModel.find.mockResolvedValue(Promise.resolve(listaProdutos));

    const categoriaId = '0a14aa4e-75e7-405f-8301-81f60646c93d';
    const resultado =
      await produtoRepository.listarProdutosPorCategoria(categoriaId);

    expect(mockProdutoModel.find).toHaveBeenCalledWith({
      where: { categoria: { id: categoriaId } },
      relations: ['categoria'],
    });
    expect(resultado).toBe(listaProdutos);
  });
});
