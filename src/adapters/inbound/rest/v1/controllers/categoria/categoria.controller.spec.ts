import { Test, TestingModule } from '@nestjs/testing';
import { CategoriaController } from './categoria.controller';
import { ICategoriaUseCase } from 'src/domain/ports/categoria/categoria.use_case.port';

describe('Criar Categoria', () => {
  let categoriaController: CategoriaController;
  let categoriaUserCase: ICategoriaUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriaController,
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
});
