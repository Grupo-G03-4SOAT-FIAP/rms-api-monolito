import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { CategoriaModel } from '../../models/categoria.model';
import { CategoriaRepository } from './categoria.repository';
import {
  categoriaEntityMock,
  categoriaModelMock,
  categoriaSQLDTOFactoryMock,
  categoriaTypeORMMock,
} from 'src/mocks/categoria.mock';
import { SQLDTOFactory } from '../../factories/sql.dto.factory';

class softDeleteMock {
  softDelete: jest.Mock = jest.fn();
}

const categoriaSoftDeleteMock = new softDeleteMock();

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
          provide: SQLDTOFactory,
          useValue: categoriaSQLDTOFactoryMock,
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
    categoriaSQLDTOFactoryMock.criarCategoriaDTO.mockReturnValue(
      categoriaEntityMock,
    );

    const result =
      await categoriaRepository.criarCategoria(categoriaEntityMock);

    expect(categoriaTypeORMMock.create).toHaveBeenCalledWith(
      categoriaEntityMock,
    );
    expect(categoriaTypeORMMock.save).toHaveBeenCalledWith(categoriaModelMock);
    expect(categoriaSQLDTOFactoryMock.criarCategoriaDTO).toHaveBeenCalledWith(
      categoriaModelMock,
    );
    expect(result).toStrictEqual(categoriaEntityMock);
  });

  it('deve editar uma categoria', async () => {
    categoriaTypeORMMock.create.mockReturnValue(categoriaModelMock);
    categoriaTypeORMMock.findOne.mockResolvedValue(
      Promise.resolve(categoriaModelMock),
    );
    categoriaSQLDTOFactoryMock.criarCategoriaDTO.mockReturnValue(
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
    expect(categoriaSQLDTOFactoryMock.criarCategoriaDTO).toHaveBeenCalledWith(
      categoriaModelMock,
    );
    expect(result).toStrictEqual(categoriaEntityMock);
  });

  it('deve excluir uma categoria no formato softdelete', async () => {
    categoriaSoftDeleteMock.softDelete.mockResolvedValue({ affected: 1 });

    const categoriaService = new CategoriaRepository(
      categoriaSQLDTOFactoryMock as any,
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
    categoriaSQLDTOFactoryMock.criarCategoriaDTO.mockReturnValue(
      categoriaEntityMock,
    );

    const result = await categoriaRepository.buscarCategoriaPorId(categoriaId);

    expect(categoriaTypeORMMock.findOne).toHaveBeenCalledWith({
      where: { id: categoriaId },
    });
    expect(categoriaSQLDTOFactoryMock.criarCategoriaDTO).toHaveBeenCalledWith(
      categoriaModelMock,
    );
    expect(result).toStrictEqual(categoriaEntityMock);
  });

  it('deve buscar uma categoria por id e retornar nulo', async () => {
    categoriaTypeORMMock.findOne.mockResolvedValue(null);

    const result = await categoriaRepository.buscarCategoriaPorId(categoriaId);

    expect(categoriaTypeORMMock.findOne).toHaveBeenCalledWith({
      where: { id: categoriaId },
    });
    expect(result).toStrictEqual(null);
  });

  it('deve buscar uma categoria por nome', async () => {
    categoriaTypeORMMock.findOne.mockReturnValue(
      Promise.resolve(categoriaModelMock),
    );
    categoriaSQLDTOFactoryMock.criarCategoriaDTO.mockReturnValue(
      categoriaEntityMock,
    );

    const result =
      await categoriaRepository.buscarCategoriaPorNome(nomeCategoria);

    expect(categoriaTypeORMMock.findOne).toHaveBeenCalledWith({
      where: { nome: nomeCategoria },
    });
    expect(categoriaSQLDTOFactoryMock.criarCategoriaDTO).toHaveBeenCalledWith(
      categoriaModelMock,
    );
    expect(result).toStrictEqual(categoriaEntityMock);
  });

  it('deve buscar uma categoria por nome e retornar nulo', async () => {
    categoriaTypeORMMock.findOne.mockResolvedValue(null);

    const result =
      await categoriaRepository.buscarCategoriaPorNome(nomeCategoria);

    expect(categoriaTypeORMMock.findOne).toHaveBeenCalledWith({
      where: { nome: nomeCategoria },
    });
    expect(result).toStrictEqual(null);
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
    categoriaSQLDTOFactoryMock.criarCategoriaDTO.mockReturnValue(
      categoriaEntityMock,
    );

    const result = await categoriaRepository.listarCategorias();

    expect(categoriaTypeORMMock.find).toHaveBeenCalledWith({});
    expect(categoriaSQLDTOFactoryMock.criarCategoriaDTO).toHaveBeenCalledWith(
      categoriaModelMock,
    );
    expect(result).toStrictEqual(listaCategoriaEntity);
  });

  it('deve retornar uma lista vazia de categorias', async () => {
    const listaCategorias = [];
    categoriaTypeORMMock.find.mockResolvedValue(
      Promise.resolve(listaCategorias),
    );

    const result = await categoriaRepository.listarCategorias();

    expect(categoriaTypeORMMock.find).toHaveBeenCalledWith({});
    expect(result).toStrictEqual(listaCategorias);
  });
});
