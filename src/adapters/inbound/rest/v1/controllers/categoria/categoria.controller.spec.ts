import { Test, TestingModule } from '@nestjs/testing';
import { CategoriaController } from './categoria.controller';
import { ICategoriaUseCase } from 'src/domain/ports/categoria/categoria.use_case.port';
import { CategoriaDTO, CriaCategoriaDTO } from '../../presenters/categoria.dto';
import { CategoriaDuplicadaErro } from 'src/domain/exceptions/categoria.exception';

const novaCategoriaDTO = new CriaCategoriaDTO();
novaCategoriaDTO.nome = 'Nova categoria';
novaCategoriaDTO.descricao = 'Nova descrição';

describe('Criar Categoria', () => {
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
      jest
        .spyOn(categoriaUserCase, 'criarCategoria')
        .mockRejectedValue(new Error());
      expect(categoriaController.criar(novaCategoriaDTO)).rejects.toThrow();
    });

    it('Deve ser retornado uma exception ao tentar criar uma categoria duplicada', async () => {
      jest
        .spyOn(categoriaUserCase, 'criarCategoria')
        .mockRejectedValue(
          new CategoriaDuplicadaErro('Existe uma categoria com esse nome'),
        );
      expect(categoriaController.criar(novaCategoriaDTO)).rejects.toThrow(
        new CategoriaDuplicadaErro('Existe uma categoria com esse nome'),
      );
    });

    it('Deve ser possível criar uma nova categoria', async () => {
      const novaCategoria = await categoriaController.criar(novaCategoriaDTO);
      const categoriaDTO = new CategoriaDTO();
      categoriaDTO.id = '0a14aa4e-75e7-405f-8301-81f60646c93c';
      categoriaDTO.nome = novaCategoriaDTO.nome;
      categoriaDTO.descricao = novaCategoriaDTO.descricao;
      jest
        .spyOn(categoriaUserCase, 'criarCategoria')
        .mockReturnValue(Promise.resolve(categoriaDTO));
      expect(novaCategoria).toBe({
        mensagem: 'Categoria criada com sucesso',
        body: 'categoriaDTO',
      });
    });
  });
});
