import { Test, TestingModule } from '@nestjs/testing';
import { ICategoriaRepository } from '../../../domain/ports/categoria/categoria.repository.port';
import { CategoriaUseCase } from './categoria.use_case';
import { CategoriaModel } from '../../../adapters/outbound/models/categoria.model';
import {
  AtualizaCategoriaDTO,
  CategoriaDTO,
  CriaCategoriaDTO,
} from 'src/adapters/inbound/rest/v1/presenters/categoria.dto';
import {
  CategoriaDuplicadaErro,
  CategoriaNaoLocalizadaErro,
} from '../../../domain/exceptions/categoria.exception';

const makeCategoriaModel = (
  id: string,
  nome: string,
  descricao: string,
  produtos = null,
  criadoEm = new Date().toISOString(),
  atualizadoEm = new Date().toISOString(),
): CategoriaModel => {
  const categoriaModel = new CategoriaModel();
  categoriaModel.id = id;
  categoriaModel.nome = nome;
  categoriaModel.descricao = descricao;
  categoriaModel.produtos = produtos;
  categoriaModel.criadoEm = criadoEm;
  categoriaModel.atualizadoEm = atualizadoEm;
  return categoriaModel;
};

const categoriaModelMock = makeCategoriaModel(
  '0a14aa4e-75e7-405f-8301-81f60646c93d',
  'Lanche',
  'Lanche x tudo',
);

const novaCategoriaModelMock = makeCategoriaModel(
  '0a14aa4e-75e7-405f-8301-81f60646c93c',
  'Nova Categoria',
  'Nova Descrição',
);

const categoriaAtualizadaModelMock = makeCategoriaModel(
  '0a14aa4e-75e7-405f-8301-81f60646c93c',
  'Novo Nome',
  'Nova Descrição',
);

const listaCategoriasModel: CategoriaModel[] = [];
listaCategoriasModel.push(categoriaAtualizadaModelMock);
listaCategoriasModel.push(novaCategoriaModelMock);
listaCategoriasModel.push(categoriaModelMock);

const makeCriaCategoriaDTO = (
  nome: string,
  descricao: string,
): CriaCategoriaDTO => {
  const criaCategoriaDTO = new CriaCategoriaDTO();
  criaCategoriaDTO.nome = nome;
  criaCategoriaDTO.descricao = descricao;
  return criaCategoriaDTO;
};

const novaCategoriaDTO = makeCriaCategoriaDTO(
  novaCategoriaModelMock.nome,
  novaCategoriaModelMock.descricao,
);

const makeCategoriaDTO = (
  id: string,
  nome: string,
  descricao: string,
): CategoriaDTO => {
  const categoriaDTO = new CategoriaDTO();
  categoriaDTO.id = id;
  categoriaDTO.nome = nome;
  categoriaDTO.descricao = descricao;
  return categoriaDTO;
};

describe('Categoria Use case', () => {

  let categoriaUseCase: CategoriaUseCase;
  let categoriaRepository: ICategoriaRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriaUseCase,
        {
          provide: ICategoriaRepository,
          useValue: {
            buscarCategoriaPorNome: jest.fn(),
            buscarCategoriaPorId: jest.fn(),
            criarCategoria: jest.fn(),
            editarCategoria: jest.fn(),
            excluirCategoria: jest.fn(),
            listarCategorias: jest.fn(),
          },
        },
      ],
    }).compile();
    categoriaUseCase = module.get<CategoriaUseCase>(CategoriaUseCase);
    categoriaRepository =
      module.get<ICategoriaRepository>(ICategoriaRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Deve ter uma definição para Categoria Use Case e Categoria Repository', async () => {
    expect(categoriaUseCase).toBeDefined();
    expect(categoriaRepository).toBeDefined();
  });

  describe('Criar categoria', () => {

    it('Deve ser lançado um erro ao tentar criar uma categoria com um nome já registrado no sistema', async () => {

      // Arrange

      const categoriaDTO = makeCriaCategoriaDTO('lanche', 'lanche x tudo');

      jest
        .spyOn(categoriaRepository, 'buscarCategoriaPorNome')
        .mockReturnValue(Promise.resolve(categoriaModelMock));

      // Act
      // Assert

      expect(
        categoriaUseCase.criarCategoria(categoriaDTO)
      ).rejects.toThrow(
        new CategoriaDuplicadaErro('Existe uma categoria com esse nome'),
      );

      expect(categoriaRepository.buscarCategoriaPorNome).toHaveBeenCalledTimes(1);

    });

    it('Deve ser possível criar uma nova categoria', async () => {

      // Arrange

      const categoriaDTO = makeCategoriaDTO(
        novaCategoriaModelMock.id,
        novaCategoriaModelMock.nome,
        novaCategoriaModelMock.descricao,
      );

      jest
        .spyOn(categoriaRepository, 'criarCategoria')
        .mockReturnValue(Promise.resolve(novaCategoriaModelMock));

      // Act

      const result = await categoriaUseCase.criarCategoria(novaCategoriaDTO);

      // Assert

      expect(result).toEqual({
        mensagem: 'Categoria criada com sucesso',
        body: categoriaDTO,
      });

      expect(categoriaRepository.buscarCategoriaPorNome).toHaveBeenCalledTimes(1);
      expect(categoriaRepository.criarCategoria).toHaveBeenCalledTimes(1);

    });

  });

  describe('Editar categoria', () => {

    it('Deve ser lançado um erro se a categoria informada para edição não existe', async () => {

      // Arrange

      const categoriaDTO = new AtualizaCategoriaDTO();
      categoriaDTO.nome = 'Categoria atualizada';
      categoriaDTO.descricao = 'Descrição atualizada';

      jest
        .spyOn(categoriaRepository, 'buscarCategoriaPorId')
        .mockReturnValue(Promise.resolve(null));

      // Act
      // Assert

      expect(
        categoriaUseCase.editarCategoria(
          '0a14aa4e-75e7-405f-8601-81f60646c93d',
          categoriaDTO,
        ),
      ).rejects.toThrow(
        new CategoriaNaoLocalizadaErro('Categoria informada não existe'),
      );

      expect(categoriaRepository.buscarCategoriaPorId).toHaveBeenCalledTimes(1);

    });

    it('Deve ser lançado um erro se a categoria informada para edição tiver o mesmo nome de uma categoria já registrada', async () => {

      // Arrange

      const atualizaCategoriaDTO = new AtualizaCategoriaDTO();
      atualizaCategoriaDTO.nome = novaCategoriaDTO.nome;

      jest
        .spyOn(categoriaRepository, 'buscarCategoriaPorId')
        .mockReturnValue(Promise.resolve(categoriaModelMock));

      jest
        .spyOn(categoriaRepository, 'buscarCategoriaPorNome')
        .mockReturnValue(Promise.resolve(novaCategoriaModelMock));

      // Act
      // Assert

      expect(
        categoriaUseCase.editarCategoria(
          categoriaModelMock.id,
          atualizaCategoriaDTO,
        ),
      ).rejects.toThrow(
        new CategoriaDuplicadaErro('Existe uma categoria com esse nome'),
      );

      expect(categoriaRepository.buscarCategoriaPorId).toHaveBeenCalledTimes(1);

    });

    it('Deve ser possível editar uma categoria', async () => {

      // Arrange

      const atualizaCategoriaDto = new AtualizaCategoriaDTO();
      const categoriaDTO = makeCategoriaDTO(
        categoriaAtualizadaModelMock.id,
        categoriaAtualizadaModelMock.nome,
        categoriaAtualizadaModelMock.descricao,
      );

      jest
        .spyOn(categoriaRepository, 'buscarCategoriaPorId')
        .mockReturnValue(Promise.resolve(categoriaAtualizadaModelMock));

      jest
        .spyOn(categoriaRepository, 'editarCategoria')
        .mockReturnValue(Promise.resolve(categoriaAtualizadaModelMock));

      // Act

      const result = await categoriaUseCase.editarCategoria(categoriaAtualizadaModelMock.id, atualizaCategoriaDto);

      // Assert

      expect(result).toEqual({
        mensagem: 'Categoria atualizada com sucesso',
        body: categoriaDTO,
      });

      expect(categoriaRepository.buscarCategoriaPorId).toHaveBeenCalledTimes(1);
      expect(categoriaRepository.editarCategoria).toHaveBeenCalledTimes(1);

    });

  });

  describe('Excluir categoria', () => {

    it('Deve ser retornado um erro se o id da categoria informada para exclusão não existir na base de dados', async () => {

      // Arrange

      jest
        .spyOn(categoriaRepository, 'buscarCategoriaPorId')
        .mockReturnValue(Promise.resolve(null));

      // Act
      // Assert

      expect(
        categoriaUseCase.excluirCategoria(
          '0a14aa4e-75e7-405f-8601-81f60646c93d',
        ),
      ).rejects.toThrow(
        new CategoriaNaoLocalizadaErro('Categoria informada não existe'),
      );

      expect(categoriaRepository.buscarCategoriaPorId).toHaveBeenCalledTimes(1);

    });

    it('Deve ser possível excluir uma categoria', async () => {

      // Arrange

      jest
        .spyOn(categoriaRepository, 'buscarCategoriaPorId')
        .mockReturnValue(Promise.resolve(categoriaAtualizadaModelMock));

      // Act

      const result = await categoriaUseCase.excluirCategoria(categoriaAtualizadaModelMock.id);

      // Assert

      expect(result).toEqual({
        mensagem: 'Categoria excluida com sucesso',
      });

      expect(categoriaRepository.buscarCategoriaPorId).toHaveBeenCalledTimes(1);
      expect(categoriaRepository.excluirCategoria).toHaveBeenCalledTimes(1);

    });

  });

  describe('Buscar Categoria', () => {

    it('Deve deve retornado um erro ao tentar buscar uma categoria que o ID não esteja cadastrado no banco de dados', async () => {

      // Arrange

      jest
        .spyOn(categoriaRepository, 'buscarCategoriaPorId')
        .mockReturnValue(Promise.resolve(null));

      // Act
      // Assert

      expect(
        categoriaUseCase.buscarCategoria(
          '0a14aa4e-7587-405f-8601-81f60646c93d',
        ),
      ).rejects.toThrow(
        new CategoriaNaoLocalizadaErro('Categoria informada não existe'),
      );

      expect(categoriaRepository.buscarCategoriaPorId).toHaveBeenCalledTimes(1);

    });

    it('Deve ser possível buscar uma categoria por ID', async () => {

      // Arrange

      const categoriaDTO = makeCategoriaDTO(
        categoriaAtualizadaModelMock.id,
        categoriaAtualizadaModelMock.nome,
        categoriaAtualizadaModelMock.descricao,
      );

      jest
        .spyOn(categoriaRepository, 'buscarCategoriaPorId')
        .mockReturnValue(Promise.resolve(categoriaAtualizadaModelMock));

      // Act

      const result = await categoriaUseCase.buscarCategoria(categoriaAtualizadaModelMock.id)

      // Assert

      expect(result).toEqual(categoriaDTO);

    });

  });

  describe('Listar Categorias', () => {

    it('Deve ser possível retornar uma lista com todas as categorias cadastradas', async () => {

      // Arrange

      const categoria1DTO = makeCategoriaDTO(
        categoriaAtualizadaModelMock.id,
        categoriaAtualizadaModelMock.nome,
        categoriaAtualizadaModelMock.descricao,
      );

      const categoria2DTO = makeCategoriaDTO(
        novaCategoriaModelMock.id,
        novaCategoriaModelMock.nome,
        novaCategoriaModelMock.descricao,
      );

      const categoria3DTO = makeCategoriaDTO(
        categoriaModelMock.id,
        categoriaModelMock.nome,
        categoriaModelMock.descricao,
      );

      const listaCategorias: CategoriaDTO[] = [
        categoria1DTO,
        categoria2DTO,
        categoria3DTO,
      ];

      jest
        .spyOn(categoriaRepository, 'listarCategorias')
        .mockReturnValue(Promise.resolve(listaCategoriasModel));

      // Act

      const result = await categoriaUseCase.listarCategorias();

      // Assert

      expect(result).toEqual(listaCategorias);

    });

    it('Deve ser retornada uma lista vazia em casos onde não tem categorias criadas', async () => {

      // Arrange

      jest
        .spyOn(categoriaRepository, 'listarCategorias')
        .mockReturnValue(Promise.resolve([]));

      // Act

      const result = await categoriaUseCase.listarCategorias();

      // Assert

      expect(result).toEqual([]);

    });

  });

});
