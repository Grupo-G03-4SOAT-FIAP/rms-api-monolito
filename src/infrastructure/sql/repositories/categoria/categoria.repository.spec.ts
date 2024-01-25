import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { CategoriaModel } from '../../models/categoria.model';
import { CategoriaRepository } from './categoria.repository';
import {
  categoriaEntityMock,
  categoriaFactoryMock,
  categoriaModelMock,
  categoriaTypeORMMock,
} from 'src/mocks/categoria.mock';
import { ICategoriaFactory } from 'src/domain/categoria/interfaces/categoria.factory.port';

class softDeleteMock {
  softDelete: jest.Mock = jest.fn();
}

const categoriaSoftDeleteMock = new softDeleteMock();
let categoriaEntidadeFactory: ICategoriaFactory;

describe('CategoriaRepository', () => {
  let categoriaRepository: CategoriaRepository;
  let categoriaId: string;
  let nomeCategoria: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriaRepository,
        {
          provide: getRepositoryToken(CategoriaModel),
          useValue: categoriaTypeORMMock,
        },
        {
          provide: ICategoriaFactory,
          useValue: categoriaFactoryMock,
        },
      ],
    }).compile();

    categoriaRepository = module.get<CategoriaRepository>(CategoriaRepository);
    categoriaId = '0a14aa4e-75e7-405f-8301-81f60646c93d';
    nomeCategoria = 'Lanche';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve criar uma categoria', async () => {
    categoriaTypeORMMock.create.mockReturnValue(categoriaModelMock);
    categoriaTypeORMMock.save.mockResolvedValue(
      Promise.resolve(categoriaModelMock),
    );
    categoriaFactoryMock.criarEntidadeCategoria.mockReturnValue(
      categoriaEntityMock,
    );

    const result =
      await categoriaRepository.criarCategoria(categoriaEntityMock);

    expect(categoriaTypeORMMock.create).toHaveBeenCalledWith(
      categoriaEntityMock,
    );
    expect(categoriaTypeORMMock.save).toHaveBeenCalledWith(categoriaModelMock);
    expect(result).toBe(categoriaEntityMock);
  });

  it('deve editar uma categoria', async () => {
    categoriaTypeORMMock.create.mockReturnValue(categoriaModelMock);
    categoriaTypeORMMock.findOne.mockResolvedValue(
      Promise.resolve(categoriaModelMock),
    );
    categoriaFactoryMock.criarEntidadeCategoria.mockReturnValue(
      categoriaEntityMock,
    );

    const result = await categoriaRepository.editarCategoria(
      categoriaId,
      categoriaEntityMock,
    );

    expect(categoriaTypeORMMock.create).toHaveBeenCalledWith(
      categoriaEntityMock,
    );
    expect(categoriaTypeORMMock.update).toHaveBeenCalledWith(
      categoriaId,
      categoriaModelMock,
    );
    expect(categoriaTypeORMMock.findOne).toHaveBeenCalledWith({
      where: { id: categoriaId },
    });
    expect(result).toBe(categoriaEntityMock);
  });

  it('deve excluir uma categoria no formato softdelete', async () => {
    categoriaSoftDeleteMock.softDelete.mockResolvedValue({ affected: 1 });

    const categoriaService = new CategoriaRepository(
      categoriaSoftDeleteMock as any, // Usar "any" para evitar problemas de tipo
      categoriaEntidadeFactory,
    );

    await categoriaService.excluirCategoria(categoriaId);

    expect(categoriaSoftDeleteMock.softDelete).toHaveBeenCalledWith({
      id: categoriaId,
    });
  });

  it('deve buscar uma categoria por id', async () => {
    categoriaTypeORMMock.findOne.mockResolvedValue(
      Promise.resolve(categoriaModelMock),
    );
    categoriaFactoryMock.criarEntidadeCategoria.mockReturnValue(
      categoriaEntityMock,
    );

    const result = await categoriaRepository.buscarCategoriaPorId(categoriaId);

    expect(categoriaTypeORMMock.findOne).toHaveBeenCalledWith({
      where: { id: categoriaId },
    });
    expect(result).toBe(categoriaEntityMock);
  });

  it('deve buscar uma categoria por id e retornar nulo', async () => {
    categoriaTypeORMMock.findOne.mockResolvedValue(null);

    const result = await categoriaRepository.buscarCategoriaPorId(categoriaId);

    expect(categoriaTypeORMMock.findOne).toHaveBeenCalledWith({
      where: { id: categoriaId },
    });
    expect(result).toBe(null);
  });

  it('deve buscar uma categoria por nome', async () => {
    categoriaTypeORMMock.findOne.mockReturnValue(
      Promise.resolve(categoriaModelMock),
    );
    categoriaFactoryMock.criarEntidadeCategoria.mockReturnValue(
      categoriaEntityMock,
    );

    const result =
      await categoriaRepository.buscarCategoriaPorNome(nomeCategoria);

    expect(categoriaTypeORMMock.findOne).toHaveBeenCalledWith({
      where: { nome: nomeCategoria },
    });
    expect(result).toBe(categoriaEntityMock);
  });

  it('deve buscar uma categoria por nome e retornar nulo', async () => {
    categoriaTypeORMMock.findOne.mockResolvedValue(null);

    const result =
      await categoriaRepository.buscarCategoriaPorNome(nomeCategoria);

    expect(categoriaTypeORMMock.findOne).toHaveBeenCalledWith({
      where: { nome: nomeCategoria },
    });
    expect(result).toBe(null);
  });

  it('deve listar todas categorias', async () => {
    const listaCategoriaModel = [
      categoriaModelMock,
      categoriaModelMock,
      categoriaModelMock,
    ];
    const listaCategoriaEntity = [
      categoriaEntityMock,
      categoriaEntityMock,
      categoriaEntityMock,
    ];
    categoriaTypeORMMock.find.mockReturnValue(
      Promise.resolve(listaCategoriaModel),
    );
    categoriaFactoryMock.criarEntidadeCategoria.mockReturnValue(
      categoriaEntityMock,
    );

    const result = await categoriaRepository.listarCategorias();

    expect(categoriaTypeORMMock.find).toHaveBeenCalledWith({});
    expect(result).toStrictEqual(listaCategoriaEntity);
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
