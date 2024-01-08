import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { CategoriaModel } from '../../models/categoria.model';
import { CategoriaRepository } from './categoria.repository';
import {
  categoriaEntityMock,
  categoriaModelMock,
  categoriaTypeORMMock,
} from 'src/mocks/categoria.mock';

class softDeleteMock {
  softDelete: jest.Mock = jest.fn();
}

const categoriaSoftDeleteMock = new softDeleteMock();

describe('CategoriaRepository', () => {
  let categoriaRepository: CategoriaRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriaRepository,
        {
          provide: getRepositoryToken(CategoriaModel),
          useValue: categoriaTypeORMMock,
        },
      ],
    }).compile();

    categoriaRepository = module.get<CategoriaRepository>(CategoriaRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve criar uma categoria', async () => {
    categoriaTypeORMMock.create.mockReturnValue(categoriaModelMock);
    categoriaTypeORMMock.save.mockResolvedValue(
      Promise.resolve(categoriaModelMock),
    );

    const result =
      await categoriaRepository.criarCategoria(categoriaEntityMock);

    expect(categoriaTypeORMMock.create).toHaveBeenCalledWith(
      categoriaEntityMock,
    );
    expect(categoriaTypeORMMock.save).toHaveBeenCalledWith(categoriaModelMock);
    expect(result).toBe(categoriaModelMock);
  });

  it('deve editar uma categoria', async () => {
    categoriaTypeORMMock.findOne.mockResolvedValue(
      Promise.resolve(categoriaModelMock),
    );

    const categoriaId = '0a14aa4e-75e7-405f-8301-81f60646c93d';

    const result = await categoriaRepository.editarCategoria(
      categoriaId,
      categoriaEntityMock,
    );

    expect(categoriaTypeORMMock.update).toHaveBeenCalledWith(
      categoriaId,
      categoriaEntityMock,
    );
    expect(categoriaTypeORMMock.findOne).toHaveBeenCalledWith({
      where: { id: categoriaId },
    });
    expect(result).toBe(categoriaModelMock);
  });

  it('deve excluir uma categoria no formato softdelete', async () => {
    const categoriaId = '0a14aa4e-75e7-405f-8301-81f60646c93d';

    categoriaSoftDeleteMock.softDelete.mockResolvedValue({ affected: 1 });

    const categoriaService = new CategoriaRepository(
      categoriaSoftDeleteMock as any,
    ); // Usar "any" para evitar problemas de tipo

    await categoriaService.excluirCategoria(categoriaId);

    expect(categoriaSoftDeleteMock.softDelete).toHaveBeenCalledWith({
      id: categoriaId,
    });
  });

  it('deve buscar uma categoria por id', async () => {
    categoriaTypeORMMock.findOne.mockResolvedValue(
      Promise.resolve(categoriaModelMock),
    );

    const categoriaId = '0a14aa4e-75e7-405f-8301-81f60646c93d';

    const result = await categoriaRepository.buscarCategoriaPorId(categoriaId);

    expect(categoriaTypeORMMock.findOne).toHaveBeenCalledWith({
      where: { id: categoriaId },
    });
    expect(result).toBe(categoriaModelMock);
  });

  it('deve buscar uma categoria por id e retornar nulo', async () => {
    categoriaTypeORMMock.findOne.mockResolvedValue(null);

    const categoriaId = '0a14aa4e-75e7-405f-8301-81f60646c93d';

    const result = await categoriaRepository.buscarCategoriaPorId(categoriaId);

    expect(categoriaTypeORMMock.findOne).toHaveBeenCalledWith({
      where: { id: categoriaId },
    });
    expect(result).toBe(null);
  });

  it('deve buscar uma categoria por nome', async () => {
    categoriaTypeORMMock.findOne.mockResolvedValue(
      Promise.resolve(categoriaModelMock),
    );

    const nomeCategoria = 'Lanche';

    const result =
      await categoriaRepository.buscarCategoriaPorNome(nomeCategoria);

    // Assert

    expect(categoriaTypeORMMock.findOne).toHaveBeenCalledWith({
      where: { nome: nomeCategoria },
    });
    expect(result).toBe(categoriaModelMock);
  });

  it('deve buscar uma categoria por nome e retornar nulo', async () => {
    categoriaTypeORMMock.findOne.mockResolvedValue(null);

    const nomeCategoria = 'Lanche';

    const result =
      await categoriaRepository.buscarCategoriaPorNome(nomeCategoria);

    expect(categoriaTypeORMMock.findOne).toHaveBeenCalledWith({
      where: { nome: nomeCategoria },
    });
    expect(result).toBe(null);
  });

  it('deve listar todas categorias', async () => {
    const listaCategorias = [
      categoriaModelMock,
      categoriaModelMock,
      categoriaModelMock,
    ];
    categoriaTypeORMMock.find.mockResolvedValue(
      Promise.resolve(listaCategorias),
    );

    const result = await categoriaRepository.listarCategorias();

    expect(categoriaTypeORMMock.find).toHaveBeenCalledWith({});
    expect(result).toBe(listaCategorias);
  });

  it('deve retornar uma lista vazia de categorias', async () => {
    const listaCategorias = [];
    categoriaTypeORMMock.find.mockResolvedValue(
      Promise.resolve(listaCategorias),
    );

    const result = await categoriaRepository.listarCategorias();

    expect(categoriaTypeORMMock.find).toHaveBeenCalledWith({});
    expect(result).toEqual(listaCategorias);
  });
});
