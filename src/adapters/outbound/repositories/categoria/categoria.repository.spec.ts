import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { CategoriaEntity } from 'src/domain/entities/categoria.entity';
import { Repository } from 'typeorm';
import { CategoriaModel } from '../../models/categoria.model';
import { CategoriaRepository } from './categoria.repository';

const categoriaEntity = new CategoriaEntity(
  'Lanche',
  'Lanche x tudo',
  '0a14aa4e-75e7-405f-8301-81f60646c93d',
);

const categoriaModel = new CategoriaModel();
categoriaModel.id = '0a14aa4e-75e7-405f-8301-81f60646c93d';
categoriaModel.nome = 'Lanche';
categoriaModel.descricao = 'Lanche x tudo';
categoriaModel.produtos = null;
categoriaModel.criadoEm = new Date().toISOString();
categoriaModel.atualizadoEm = new Date().toISOString();
categoriaModel.excluidoEm = new Date().toISOString();

class CategoriaRepositoryMock {
  softDelete: jest.Mock = jest.fn();
}

const categoriaRepositoryMock = new CategoriaRepositoryMock();

describe('CategoriaRepository', () => {
  let categoriaRepository: CategoriaRepository;
  let mockCategoriaModel: jest.Mocked<Repository<CategoriaModel>>;

  beforeEach(async () => {
    mockCategoriaModel = {
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
    } as Partial<Repository<CategoriaModel>> as jest.Mocked<
      Repository<CategoriaModel>
    >;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriaRepository,
        {
          provide: getRepositoryToken(CategoriaModel),
          useValue: mockCategoriaModel,
        },
      ],
    }).compile();

    categoriaRepository = module.get<CategoriaRepository>(CategoriaRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve criar uma categoria', async () => {
    mockCategoriaModel.create.mockReturnValue(categoriaModel);
    mockCategoriaModel.save.mockResolvedValue(Promise.resolve(categoriaModel));

    const resultado = await categoriaRepository.criarCategoria(categoriaEntity);

    expect(mockCategoriaModel.create).toHaveBeenCalledWith(categoriaEntity);
    expect(mockCategoriaModel.save).toHaveBeenCalledWith(categoriaModel);
    expect(resultado).toBe(categoriaModel);
  });

  it('deve editar uma categoria', async () => {
    mockCategoriaModel.findOne.mockResolvedValue(
      Promise.resolve(categoriaModel),
    );

    const categoriaId = '0a14aa4e-75e7-405f-8301-81f60646c93d';
    const resultado = await categoriaRepository.editarCategoria(
      categoriaId,
      categoriaEntity,
    );

    expect(mockCategoriaModel.update).toHaveBeenCalledWith(
      categoriaId,
      categoriaEntity,
    );
    expect(mockCategoriaModel.findOne).toHaveBeenCalledWith({
      where: { id: categoriaId },
    });
    expect(resultado).toBe(categoriaModel);
  });

  it('deve excluir uma categoria no formato softdelete', async () => {
    const categoriaId = '0a14aa4e-75e7-405f-8301-81f60646c93d';

    // Configurar o mock da função softDelete
    categoriaRepositoryMock.softDelete.mockResolvedValue({ affected: 1 });

    const categoriaService = new CategoriaRepository(
      categoriaRepositoryMock as any,
    ); // Usar "any" para evitar problemas de tipo

    await categoriaService.excluirCategoria(categoriaId);

    expect(categoriaRepositoryMock.softDelete).toHaveBeenCalledWith({
      id: categoriaId,
    });
  });

  it('deve buscar uma categoria por id', async () => {
    mockCategoriaModel.findOne.mockResolvedValue(
      Promise.resolve(categoriaModel),
    );

    const categoriaId = '0a14aa4e-75e7-405f-8301-81f60646c93d';
    const resultado =
      await categoriaRepository.buscarCategoriaPorId(categoriaId);

    expect(mockCategoriaModel.findOne).toHaveBeenCalledWith({
      where: { id: categoriaId },
    });
    expect(resultado).toBe(categoriaModel);
  });

  it('deve buscar uma categoria por id e retornar nulo', async () => {
    mockCategoriaModel.findOne.mockResolvedValue(null);

    const categoriaId = '0a14aa4e-75e7-405f-8301-81f60646c93d';
    const resultado =
      await categoriaRepository.buscarCategoriaPorId(categoriaId);

    expect(mockCategoriaModel.findOne).toHaveBeenCalledWith({
      where: { id: categoriaId },
    });
    expect(resultado).toBe(null);
  });

  it('deve buscar uma categoria por nome', async () => {
    mockCategoriaModel.findOne.mockResolvedValue(
      Promise.resolve(categoriaModel),
    );

    const nomeCategoria = 'Lanche';
    const resultado =
      await categoriaRepository.buscarCategoriaPorNome(nomeCategoria);

    expect(mockCategoriaModel.findOne).toHaveBeenCalledWith({
      where: { nome: nomeCategoria },
    });
    expect(resultado).toBe(categoriaModel);
  });

  it('deve buscar uma categoria por nome e retornar nulo', async () => {
    mockCategoriaModel.findOne.mockResolvedValue(null);

    const nomeCategoria = 'Lanche';
    const resultado =
      await categoriaRepository.buscarCategoriaPorNome(nomeCategoria);

    expect(mockCategoriaModel.findOne).toHaveBeenCalledWith({
      where: { nome: nomeCategoria },
    });
    expect(resultado).toBe(null);
  });

  it('deve listar todas categorias', async () => {
    const listaCategorias = [categoriaModel, categoriaModel, categoriaModel];
    mockCategoriaModel.find.mockResolvedValue(Promise.resolve(listaCategorias));

    const resultado = await categoriaRepository.listarCategorias();

    expect(mockCategoriaModel.find).toHaveBeenCalledWith({});
    expect(resultado).toBe(listaCategorias);
  });

  it('deve retornar uma lista vazia de categorias', async () => {
    const listaCategorias = [];
    mockCategoriaModel.find.mockResolvedValue(Promise.resolve(listaCategorias));

    const resultado = await categoriaRepository.listarCategorias();

    expect(mockCategoriaModel.find).toHaveBeenCalledWith({});
    expect(resultado).toEqual(listaCategorias);
  });
});
