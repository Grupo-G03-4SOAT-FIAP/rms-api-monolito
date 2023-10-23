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
  'Lanche x tudo',
  '0a14aa4e-75e7-405f-8301-81f60646c93d',
);

const produtoEntity = new ProdutoEntity(
  'Produto X',
  categoriaEntity,
  5.0,
  'http://',
  'Teste produto x',
  '0a14aa4e-75e7-405f-8301-81f60646c93d',
);

const categoriaModel = new CategoriaModel();
categoriaModel.id = '0a14aa4e-75e7-405f-8301-81f60646c93d';
categoriaModel.nome = 'Lanche';
categoriaModel.descricao = 'Lanche x tudo';
categoriaModel.produtos = null;
categoriaModel.ativo = true;
categoriaModel.criadoEm = new Date().toISOString();
categoriaModel.atualizadoEm = new Date().toISOString();
categoriaModel.excluidoEm = new Date().toISOString();

const produtoModel = new ProdutoModel();
produtoModel.id = '0a14aa4e-75e7-405f-8301-81f60646c93d';
produtoModel.nome = 'Produto X';
produtoModel.descricao = 'Teste produto x';
produtoModel.valorUnitario = 5.0;
produtoModel.imagemUrl = 'http://';
produtoModel.ativo = true;
produtoModel.categoria = categoriaModel;
produtoModel.criadoEm = new Date().toISOString();
produtoModel.atualizadoEm = new Date().toISOString();
produtoModel.excluidoEm = new Date().toISOString();

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
    const produtoId = '0a14aa4e-75e7-405f-8301-81f60646c93d';

    mockProdutoModel.findOne.mockResolvedValue(Promise.resolve(produtoModel));

    const resultado = await produtoRepository.editarProduto(
      produtoId,
      produtoEntity,
    );

    expect(mockProdutoModel.update).toHaveBeenCalledWith(
      produtoId,
      produtoEntity,
    );
    expect(mockProdutoModel.findOne).toHaveBeenCalledWith({
      where: { id: produtoId },
    });
    expect(resultado).toBe(produtoModel);
  });

  it('deve excluir uma categoria', async () => {
    const produtoId = '0a14aa4e-75e7-405f-8301-81f60646c93d';

    await produtoRepository.excluirProduto(produtoId);

    expect(mockProdutoModel.delete).toHaveBeenCalledWith({
      id: produtoId,
    });
  });

  it('deve buscar um produto', async () => {
    const pedidoId = '0a14aa4e-75e7-405f-8301-81f60646c93d';

    mockProdutoModel.findOne.mockResolvedValue(Promise.resolve(produtoModel));

    const resultado = await produtoRepository.buscarProduto(pedidoId);

    expect(mockProdutoModel.findOne).toHaveBeenCalledWith({
      where: { id: pedidoId },
    });
    expect(resultado).toBe(produtoModel);
  });

  it('deve listar todos produtos', async () => {
    const listaProdutos = [produtoModel, produtoModel, produtoModel];
    mockProdutoModel.find.mockResolvedValue(Promise.resolve(listaProdutos));

    const resultado = await produtoRepository.listarProdutos();

    expect(mockProdutoModel.find).toHaveBeenCalledWith({});
    expect(resultado).toBe(listaProdutos);
  });

  it('deve listar produtos por categoria', async () => {
    const categoriaId = '0a14aa4e-75e7-405f-8301-81f60646c93d';
    const listaProdutos = [produtoModel, produtoModel, produtoModel];
    mockProdutoModel.find.mockResolvedValue(Promise.resolve(listaProdutos));

    const resultado =
      await produtoRepository.listarProdutosPorCategoria(categoriaId);

    expect(mockProdutoModel.find).toHaveBeenCalledWith({
      where: { categoria: { id: categoriaId } },
    });
    expect(resultado).toBe(listaProdutos);
  });
});
