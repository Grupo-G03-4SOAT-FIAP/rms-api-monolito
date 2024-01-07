import { Test, TestingModule } from '@nestjs/testing';
import { CategoriaController } from './categoria.controller';
import { ICategoriaUseCase } from '../../../../../../domain/ports/categoria/categoria.use_case.port';
import {
  AtualizaCategoriaDTO,
  CategoriaDTO,
  CriaCategoriaDTO,
} from '../../presenters/categoria.dto';
import {
  CategoriaDuplicadaErro,
  CategoriaNaoLocalizadaErro,
} from '../../../../../../domain/exceptions/categoria.exception';

const novaCategoriaDTO = new CriaCategoriaDTO();
novaCategoriaDTO.nome = 'Nova categoria';
novaCategoriaDTO.descricao = 'Nova descrição';

describe('Categoria', () => {
  let categoriaController: CategoriaController;
  let categoriaUserCase: ICategoriaUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriaController],
      providers: [
        {
          provide: ICategoriaUseCase,
          useValue: {
            criarCategoria: jest.fn(),
            editarCategoria: jest.fn(),
            excluirCategoria: jest.fn(),
            buscarCategoria: jest.fn(),
            listarCategorias: jest.fn(),
          },
        },
      ],
    }).compile();
    categoriaController = module.get<CategoriaController>(CategoriaController);
    categoriaUserCase = module.get<ICategoriaUseCase>(ICategoriaUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Deve ter uma definição para Categoria Controller e Categoria Use Case', async () => {
    expect(categoriaController).toBeDefined();
    expect(categoriaUserCase).toBeDefined();
  });

  describe('Criar categoria', () => {
    it('Deve ser retornado uma exception se ocorrer um erro para criar uma categoria', async () => {
      // Arrange

      jest
        .spyOn(categoriaUserCase, 'criarCategoria')
        .mockRejectedValue(new Error());

      // Act
      // Assert

      expect(categoriaController.criar(novaCategoriaDTO)).rejects.toThrow();
    });

    it('Deve ser retornado uma exception ao tentar criar uma categoria duplicada', async () => {
      // Arrange

      jest
        .spyOn(categoriaUserCase, 'criarCategoria')
        .mockRejectedValue(
          new CategoriaDuplicadaErro('Existe uma categoria com esse nome'),
        );

      // Act
      // Assert

      expect(categoriaController.criar(novaCategoriaDTO)).rejects.toThrow(
        new CategoriaDuplicadaErro('Existe uma categoria com esse nome'),
      );
    });

    it('Deve ser possível criar uma nova categoria', async () => {
      // Arrange

      const categoriaDTO = new CategoriaDTO();
      categoriaDTO.id = '0a14aa4e-75e7-405f-8301-81f60646c93c';
      categoriaDTO.nome = novaCategoriaDTO.nome;
      categoriaDTO.descricao = novaCategoriaDTO.descricao;

      jest.spyOn(categoriaUserCase, 'criarCategoria').mockReturnValue(
        Promise.resolve({
          mensagem: 'Categoria criada com sucesso',
          body: categoriaDTO,
        }),
      );

      // Act

      const result = await categoriaController.criar(novaCategoriaDTO);

      // Assert

      expect(result).toEqual({
        mensagem: 'Categoria criada com sucesso',
        body: categoriaDTO,
      });
    });
  });

  describe('Atualizar Categoria', () => {
    it('Deve ser retornada uma exception ao tentar atualizar o nome da categoria com o mesmo de uma categoria já existente', async () => {
      // Arrange

      jest
        .spyOn(categoriaUserCase, 'editarCategoria')
        .mockRejectedValue(
          new CategoriaDuplicadaErro('Existe uma categoria com esse nome'),
        );

      // Act
      // Assert

      expect(
        categoriaController.atualizar(
          '0a14aa4e-75e7-405f-8301-81f60646c93c',
          novaCategoriaDTO,
        ),
      ).rejects.toThrow(
        new CategoriaDuplicadaErro('Existe uma categoria com esse nome'),
      );
    });

    it('Deve ser retornada uma exception ao tentar atualizar uma categoria não existente', async () => {
      // Arrange

      jest
        .spyOn(categoriaUserCase, 'editarCategoria')
        .mockRejectedValue(
          new CategoriaNaoLocalizadaErro('Categoria informada não existe'),
        );

      // Act
      // Assert

      expect(
        categoriaController.atualizar(
          '0a14aa4e-75e7-405f-8301-81f60646c93c',
          novaCategoriaDTO,
        ),
      ).rejects.toThrow(
        new CategoriaNaoLocalizadaErro('Categoria informada não existe'),
      );
    });

    it('Deve ser retornada uma exception em caso de erros para atualizar uma categoria', async () => {
      // Arrange

      jest
        .spyOn(categoriaUserCase, 'editarCategoria')
        .mockRejectedValue(new Error());

      // Act
      // Assert

      expect(
        categoriaController.atualizar(
          '0a14aa4e-75e7-405f-8301-81f60646c93c',
          novaCategoriaDTO,
        ),
      ).rejects.toThrow(new Error());
    });

    it('Deve ser possível atualizar uma categoria', async () => {
      // Arrange

      const categoriaEditada = new CategoriaDTO();
      categoriaEditada.nome = 'Nome Categoria Editada';
      categoriaEditada.descricao = 'Descrição Categoria Editada';

      jest.spyOn(categoriaUserCase, 'editarCategoria').mockReturnValue(
        Promise.resolve({
          mensagem: 'Categoria atualizada com sucesso',
          body: categoriaEditada,
        }),
      );

      const categoriaAtualizar = new AtualizaCategoriaDTO();

      // Act

      const result = categoriaController.atualizar(
        '0a14aa4e-75e7-405f-8301-81f60646c93c',
        categoriaAtualizar,
      );

      // Assert

      expect(result).toStrictEqual(
        Promise.resolve({
          mensagem: 'Categoria atualizada com sucesso',
          body: categoriaEditada,
        }),
      );
    });
  });

  describe('Remover Categoria', () => {
    it('Deve ser retornada uma exception se tentar remover uma categoria que não existe', async () => {
      // Arrange

      jest
        .spyOn(categoriaUserCase, 'excluirCategoria')
        .mockRejectedValue(
          new CategoriaNaoLocalizadaErro('Categoria informada não existe'),
        );

      // Act
      // Assert

      expect(
        categoriaController.remover('0a14aa4e-75e7-405f-8301-81f60646c93c'),
      ).rejects.toThrow(
        new CategoriaNaoLocalizadaErro('Categoria informada não existe'),
      );
    });

    it('Deve ser retornada uma exception em caso de erros para remover uma categoria', async () => {
      // Arrange

      jest
        .spyOn(categoriaUserCase, 'excluirCategoria')
        .mockRejectedValue(new Error());

      // Act
      // Assert

      expect(
        categoriaController.remover('0a14aa4e-75e7-405f-8301-81f60646c93c'),
      ).rejects.toThrow(new Error());
    });

    it('Deve ser possível remover uma categoria', async () => {
      // Arrange

      jest.spyOn(categoriaUserCase, 'excluirCategoria').mockReturnValue(
        Promise.resolve({
          mensagem: 'Categoria excluida com sucesso',
        }),
      );

      // Act

      const result = await categoriaController.remover(
        '0a14aa4e-75e7-405f-8301-81f60646c93c',
      );

      // Assert

      expect(result).toEqual({
        mensagem: 'Categoria excluida com sucesso',
      });
    });
  });

  describe('Buscar Categoria por ID', () => {
    it('Deve ser retornada uma exception se buscar uma categoria com id que não existe', async () => {
      // Arrange

      jest
        .spyOn(categoriaUserCase, 'buscarCategoria')
        .mockRejectedValue(
          new CategoriaNaoLocalizadaErro('Categoria informada não existe'),
        );

      // Act
      // Assert

      expect(
        categoriaController.buscar('0a14aa4e-75e7-405f-8301-81f60646c93c'),
      ).rejects.toThrow(
        new CategoriaNaoLocalizadaErro('Categoria informada não existe'),
      );
    });

    it('Deve ser retornada uma exception se ocorrer um erro ao tentar buscar uma categoria', async () => {
      // Arrange

      jest
        .spyOn(categoriaUserCase, 'buscarCategoria')
        .mockRejectedValue(new Error());

      // Act
      // Assert

      expect(
        categoriaController.buscar('0a14aa4e-75e7-405f-8301-81f60646c93c'),
      ).rejects.toThrow(new Error());
    });

    it('Deve ser possível buscar uma categoria pelo seu ID', async () => {
      // Arrange

      const categoria = new CategoriaDTO();
      categoria.nome = 'Nome categoria';
      categoria.descricao = 'Descrição categoria';

      jest
        .spyOn(categoriaUserCase, 'buscarCategoria')
        .mockReturnValue(Promise.resolve(categoria));

      // Act

      const result = await categoriaController.buscar(
        '0a14aa4e-75e7-405f-8301-81f60646c93c',
      );

      // Assert

      expect(result).toEqual(categoria);
    });
  });

  describe('Listar todas as categorias', () => {
    it('Deve ser retornado um array vazio caso não tenham categorias cadastradas', async () => {
      // Arrange

      jest
        .spyOn(categoriaUserCase, 'listarCategorias')
        .mockReturnValue(Promise.resolve([]));

      // Act

      const result = await categoriaController.listar();

      // Assert

      expect(result).toEqual([]);
    });

    it('Deve ser possível retornar todas as categorias cadastradas', async () => {
      // Arrange

      const categoriaDTO1 = new CategoriaDTO();
      categoriaDTO1.id = '1a14aa4e-75e7-405f-8301-81f60646c93c';
      categoriaDTO1.nome = 'Nome Categoria 1';
      categoriaDTO1.descricao = 'Descrição 1';

      const categoriaDTO2 = new CategoriaDTO();
      categoriaDTO2.id = '2a14aa4e-75e7-405f-8301-81f60646c93c';
      categoriaDTO2.nome = 'Nome Categoria 2';
      categoriaDTO2.descricao = 'Descrição 2';

      const categoriaDTO3 = new CategoriaDTO();
      categoriaDTO3.id = '3a14aa4e-75e7-405f-8301-81f60646c93c';
      categoriaDTO3.nome = 'Nome Categoria 3';
      categoriaDTO3.descricao = 'Descrição 3';

      const listaCategorias: CategoriaDTO[] = [
        categoriaDTO1,
        categoriaDTO2,
        categoriaDTO3,
      ];

      jest
        .spyOn(categoriaUserCase, 'listarCategorias')
        .mockReturnValue(Promise.resolve(listaCategorias));

      // Act

      const result = await categoriaController.listar();

      // Assert

      expect(result).toEqual(listaCategorias);
    });
  });
});
