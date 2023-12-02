import { Test, TestingModule } from '@nestjs/testing';
import { ICategoriaRepository } from '../../../domain/ports/categoria/categoria.repository.port';
import { CategoriaUseCase } from './categoria.use_case';
import { CategoriaModel } from '../../../adapters/outbound/models/categoria.model';
import { CriaCategoriaDTO } from 'src/adapters/inbound/rest/v1/presenters/categoria.dto';
import { CategoriaDuplicadaErro } from '../../../domain/exceptions/categoria.exception';

const categoriaModelMock = new CategoriaModel();
categoriaModelMock.id = '0a14aa4e-75e7-405f-8301-81f60646c93d';
categoriaModelMock.nome = 'Lanche';
categoriaModelMock.descricao = 'Lanche x tudo';
categoriaModelMock.produtos = null;
categoriaModelMock.criadoEm = new Date().toISOString();
categoriaModelMock.atualizadoEm = new Date().toISOString();

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
            buscarCategoriaPorNome: jest
              .fn()
              .mockReturnValue(categoriaModelMock),
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
    it('Deve ser retornado um erro ao tentar criar uma categoria com um nome já registrado no sistema', async () => {
      const categoriaDto = new CriaCategoriaDTO();
      categoriaDto.nome = 'Categoria 1';
      categoriaDto.descricao = 'Descrição 1';
      expect(categoriaUseCase.criarCategoria(categoriaDto)).rejects.toThrow(
        new CategoriaDuplicadaErro('Existe uma categoria com esse nome'),
      );
    });
  });
});
