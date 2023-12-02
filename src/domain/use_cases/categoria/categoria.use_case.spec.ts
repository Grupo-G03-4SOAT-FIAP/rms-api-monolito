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
  const categoriaDTO = new CriaCategoriaDTO();
  categoriaDTO.nome = nome;
  categoriaDTO.descricao = descricao;
  return categoriaDTO;
};

const novaCategoriaDto = makeCriaCategoriaDTO(
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
      const categoriaDto = makeCriaCategoriaDTO('Categoria 1', 'Descrição 1');
      jest
        .spyOn(categoriaRepository, 'buscarCategoriaPorNome')
        .mockReturnValue(Promise.resolve(categoriaModelMock));
      expect(categoriaUseCase.criarCategoria(categoriaDto)).rejects.toThrow(
        new CategoriaDuplicadaErro('Existe uma categoria com esse nome'),
      );
      expect(categoriaRepository.buscarCategoriaPorNome).toHaveBeenCalledTimes(
        1,
      );
    });

    it('Deve ser possível criar uma nova categoria', async () => {
      const result = makeCategoriaDTO(
        novaCategoriaModelMock.id,
        novaCategoriaModelMock.nome,
        novaCategoriaModelMock.descricao,
      );
      jest
        .spyOn(categoriaRepository, 'criarCategoria')
        .mockReturnValue(Promise.resolve(novaCategoriaModelMock));
      expect(await categoriaUseCase.criarCategoria(novaCategoriaDto)).toEqual({
        mensagem: 'Categoria criada com sucesso',
        body: result,
      });
      expect(categoriaRepository.buscarCategoriaPorNome).toHaveBeenCalledTimes(
        1,
      );
      expect(categoriaRepository.criarCategoria).toHaveBeenCalledTimes(1);
    });
  });

  describe('Editar categoria', () => {
    it('Deve ser lançado um erro se a categoria informada para edição não existe', async () => {
      const categoriaDto = new AtualizaCategoriaDTO();
      categoriaDto.nome = 'Categoria atualizada';
      categoriaDto.descricao = 'Descrição atualizada';
      jest
        .spyOn(categoriaRepository, 'buscarCategoriaPorId')
        .mockReturnValue(Promise.resolve(null));
      expect(
        categoriaUseCase.editarCategoria(
          '0a14aa4e-75e7-405f-8601-81f60646c93d',
          categoriaDto,
        ),
      ).rejects.toThrow(
        new CategoriaNaoLocalizadaErro('Categoria informada não existe'),
      );
      expect(categoriaRepository.buscarCategoriaPorId).toHaveBeenCalledTimes(1);
    });

    it('Deve ser lançado um erro se a categoria informada para edição tiver o mesmo nome de uma categoria já registrada', async () => {
      const atualizaCategoriaDto = new AtualizaCategoriaDTO();
      atualizaCategoriaDto.nome = novaCategoriaDto.nome;
      jest
        .spyOn(categoriaRepository, 'buscarCategoriaPorId')
        .mockReturnValue(Promise.resolve(categoriaModelMock));
      jest
        .spyOn(categoriaRepository, 'buscarCategoriaPorNome')
        .mockReturnValue(Promise.resolve(novaCategoriaModelMock));
      expect(
        categoriaUseCase.editarCategoria(
          categoriaModelMock.id,
          atualizaCategoriaDto,
        ),
      ).rejects.toThrow(
        new CategoriaDuplicadaErro('Existe uma categoria com esse nome'),
      );
      expect(categoriaRepository.buscarCategoriaPorId).toHaveBeenCalledTimes(1);
    });

    it('Deve ser possível editar uma categoria', async () => {
      const atualizaCategoriaDto = new AtualizaCategoriaDTO();
      const result = makeCategoriaDTO(
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
      expect(
        await categoriaUseCase.editarCategoria(
          categoriaAtualizadaModelMock.id,
          atualizaCategoriaDto,
        ),
      ).toEqual({
        mensagem: 'Categoria atualizada com sucesso',
        body: result,
      });
      expect(categoriaRepository.buscarCategoriaPorId).toHaveBeenCalledTimes(1);
      expect(categoriaRepository.editarCategoria).toHaveBeenCalledTimes(1);
    });
  });

  describe('Excluir categoria', () => {
    it('Deve ser retornado um erro se o id da categoria informada para exclusão não existir na base de dados', async () => {
      jest
        .spyOn(categoriaRepository, 'buscarCategoriaPorId')
        .mockReturnValue(Promise.resolve(null));
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
      jest
        .spyOn(categoriaRepository, 'buscarCategoriaPorId')
        .mockReturnValue(Promise.resolve(categoriaAtualizadaModelMock));
      expect(
        await categoriaUseCase.excluirCategoria(
          categoriaAtualizadaModelMock.id,
        ),
      ).toEqual({
        mensagem: 'Categoria excluida com sucesso',
      });
      expect(categoriaRepository.buscarCategoriaPorId).toHaveBeenCalledTimes(1);
      expect(categoriaRepository.excluirCategoria).toHaveBeenCalledTimes(1);
    });
  });

  describe('Buscar Categoria', () => {
    it('Deve deve retornado um erro ao tentar buscar uma categoria que o ID não esteja cadastrado no banco de dados', async () => {
      jest
        .spyOn(categoriaRepository, 'buscarCategoriaPorId')
        .mockReturnValue(Promise.resolve(null));
      expect(
        categoriaUseCase.buscarCategoria(
          '0a14aa4e-7587-405f-8601-81f60646c93d',
        ),
      ).rejects.toThrow(
        new CategoriaNaoLocalizadaErro('Categoria informada não existe'),
      );
      expect(categoriaRepository.buscarCategoriaPorId).toHaveBeenCalledTimes(1);
    });

    it('Deve ser possível buscar uma categoria via ID', async () => {
      const result = makeCategoriaDTO(
        categoriaAtualizadaModelMock.id,
        categoriaAtualizadaModelMock.nome,
        categoriaAtualizadaModelMock.descricao,
      );
      jest
        .spyOn(categoriaRepository, 'buscarCategoriaPorId')
        .mockReturnValue(Promise.resolve(categoriaAtualizadaModelMock));
      expect(
        await categoriaUseCase.buscarCategoria(categoriaAtualizadaModelMock.id),
      ).toEqual(result);
    });
  });

  describe('Listar Categorias', () => {
    it('Deve ser possível retornar uma lista com todas as categorias cadastradas', async () => {
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

      const expectedResult: CategoriaDTO[] = [
        categoria1DTO,
        categoria2DTO,
        categoria3DTO,
      ];
      jest
        .spyOn(categoriaRepository, 'listarCategorias')
        .mockReturnValue(Promise.resolve(listaCategoriasModel));
      const listResult = await categoriaUseCase.listarCategorias();
      expect(listResult).toEqual(expectedResult);
    });

    it('Deve ser retornada uma lista vazia em casos onde não tem categorias criadas', async () => {
      jest
        .spyOn(categoriaRepository, 'listarCategorias')
        .mockReturnValue(Promise.resolve([]));
      const listResult = await categoriaUseCase.listarCategorias();
      expect(listResult).toEqual([]);
    });
  });
});
