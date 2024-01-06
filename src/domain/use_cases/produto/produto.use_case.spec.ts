import { Test, TestingModule } from '@nestjs/testing';
import { IProdutoRepository } from '../../ports/produto/produto.repository.port';
import { ICategoriaRepository } from 'src/domain/ports/categoria/categoria.repository.port';
import { ProdutoUseCase } from './produto.use_case';
import { ProdutoModel } from '../../../adapters/outbound/models/produto.model';
import {
  AtualizaProdutoDTO,
  ProdutoDTO,
  CriaProdutoDTO,
} from 'src/adapters/inbound/rest/v1/presenters/produto.dto';
import {
  ProdutoDuplicadoErro,
  ProdutoNaoLocalizadoErro,
} from '../../exceptions/produto.exception';
import { CategoriaModel } from 'src/adapters/outbound/models/categoria.model';
import { CategoriaDTO } from 'src/adapters/inbound/rest/v1/presenters/categoria.dto';
import { IProdutoFactory } from 'src/domain/ports/produto/produto.factory.port';

const makeProdutoModel = (
  id: string,
  nome: string,
  descricao: string,
  valorUnitario: number,
  imagemUrl: string,
  idCategoria: string,
  nomeCategoria: string,
  descricaoCategoria: string,
): ProdutoModel => {
  const produtoModel = new ProdutoModel();
  produtoModel.id = id;
  produtoModel.nome = nome;
  produtoModel.descricao = descricao;
  produtoModel.valorUnitario = valorUnitario;
  produtoModel.imagemUrl = imagemUrl;
  produtoModel.categoria = new CategoriaModel();
  produtoModel.categoria.id = idCategoria;
  produtoModel.categoria.nome = nomeCategoria;
  produtoModel.categoria.descricao = descricaoCategoria;
  return produtoModel;
};

const produtoModelMock = makeProdutoModel(
  '0a14aa4e-75e7-405f-8301-81f60646c93d',
  'Produto X',
  'Teste Produto X',
  5.0,
  'http://',
  '0a14aa4e-75e7-405f-8301-81f60646c93d',
  'Lanche',
  'Lanche X Tudo',
);

const novoProdutoModelMock = makeProdutoModel(
  '0a14aa4e-75e7-405f-8301-81f60646c93d',
  'Produto Y',
  'Teste Produto Y',
  12.0,
  'http://',
  '0a14aa4e-75e7-405f-8301-81f60646c93d',
  'Lanche',
  'Lanche X Tudo',
);

const produtoAtualizadaModelMock = makeProdutoModel(
  '0a14aa4e-75e7-405f-8301-81f60646c93d',
  'Produto Z',
  'Teste Produto Z',
  15.0,
  'http://',
  '0a14aa4e-75e7-405f-8301-81f60646c93d',
  'Lanche',
  'Lanche X Tudo',
);

const listaProdutosModel: ProdutoModel[] = [];
listaProdutosModel.push(produtoAtualizadaModelMock);
listaProdutosModel.push(novoProdutoModelMock);
listaProdutosModel.push(produtoModelMock);

const makeCriaProdutoDTO = (
  nome: string,
  descricao: string,
  valorUnitario: number,
  imagemUrl: string,
  categoriaId: string,
): CriaProdutoDTO => {
  const criaProdutoDTO = new CriaProdutoDTO();
  criaProdutoDTO.nome = nome;
  criaProdutoDTO.descricao = descricao;
  criaProdutoDTO.valorUnitario = valorUnitario;
  criaProdutoDTO.imagemUrl = imagemUrl;
  criaProdutoDTO.categoriaId = categoriaId;
  return criaProdutoDTO;
};

const novoProdutoDTO = makeCriaProdutoDTO(
  novoProdutoModelMock.nome,
  novoProdutoModelMock.descricao,
  novoProdutoModelMock.valorUnitario,
  novoProdutoModelMock.imagemUrl,
  novoProdutoModelMock.categoria.id,
);

const makeProdutoDTO = (
  id: string,
  nome: string,
  descricao: string,
  valorUnitario: number,
  imagemUrl: string,
  idCategoria: string,
  nomeCategoria: string,
  descricaoCategoria: string,
): ProdutoDTO => {
  const produtoDTO = new ProdutoDTO();
  produtoDTO.id = id;
  produtoDTO.nome = nome;
  produtoDTO.descricao = descricao;
  produtoDTO.valorUnitario = valorUnitario;
  produtoDTO.imagemUrl = imagemUrl;
  produtoDTO.categoria = new CategoriaDTO();
  (produtoDTO.categoria.id = idCategoria),
    (produtoDTO.categoria.nome = nomeCategoria),
    (produtoDTO.categoria.descricao = descricaoCategoria);
  return produtoDTO;
};

describe('Produto Use case', () => {
  let produtoUseCase: ProdutoUseCase;
  let produtoRepository: IProdutoRepository;
  let produtoFactory: IProdutoFactory;
  let categoriaRepository: ICategoriaRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProdutoUseCase,
        {
          provide: IProdutoRepository,
          useValue: {
            buscarProdutoPorNome: jest.fn(),
            buscarProdutoPorId: jest.fn(),
            criarProduto: jest.fn(),
            editarProduto: jest.fn(),
            excluirProduto: jest.fn(),
            listarProdutos: jest.fn(),
            listarProdutosPorCategoria: jest.fn(),
          },
        },
        {
          provide: IProdutoFactory,
          useValue: {
            criarEntidadeProdutoFromCriaProdutoDTO: jest.fn(),
            criarEntidadeProdutoFromAtualizaProdutoDTO: jest.fn(),
          },
        },
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

    produtoUseCase = module.get<ProdutoUseCase>(ProdutoUseCase);
    produtoRepository = module.get<IProdutoRepository>(IProdutoRepository);
    produtoFactory = module.get<IProdutoFactory>(IProdutoFactory);
    categoriaRepository =
      module.get<ICategoriaRepository>(ICategoriaRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Deve ter uma definição para Produto Use Case e Produto Repository', async () => {
    expect(produtoUseCase).toBeDefined();
    expect(produtoRepository).toBeDefined();
    expect(produtoFactory).toBeDefined();
    expect(categoriaRepository).toBeDefined();
  });

  describe('Criar produto', () => {
    it('Deve ser lançado um erro ao tentar criar um produto com um nome já registrado no sistema', async () => {
      // Arrange

      const produtoDTO = makeCriaProdutoDTO(
        'Produto X',
        'Teste Produto X',
        5.0,
        'http://',
        '0a14aa4e-75e7-405f-8301-81f60646c93d',
      );

      jest
        .spyOn(produtoRepository, 'buscarProdutoPorNome')
        .mockReturnValue(Promise.resolve(produtoModelMock));

      // Act
      // Assert

      expect(produtoUseCase.criarProduto(produtoDTO)).rejects.toThrow(
        new ProdutoDuplicadoErro('Existe um produto com esse nome'),
      );

      expect(produtoRepository.buscarProdutoPorNome).toHaveBeenCalledTimes(1);
    });

    it('Deve ser possível criar um novo produto', async () => {
      // Arrange

      const produtoDTO = makeProdutoDTO(
        novoProdutoModelMock.id,
        novoProdutoModelMock.nome,
        novoProdutoModelMock.descricao,
        novoProdutoModelMock.valorUnitario,
        novoProdutoModelMock.imagemUrl,
        novoProdutoModelMock.categoria.id,
        novoProdutoModelMock.categoria.nome,
        novoProdutoModelMock.categoria.descricao,
      );

      jest
        .spyOn(produtoRepository, 'criarProduto')
        .mockReturnValue(Promise.resolve(novoProdutoModelMock));

      jest
        .spyOn(categoriaRepository, 'buscarCategoriaPorId')
        .mockReturnValue(Promise.resolve(novoProdutoModelMock.categoria));

      // Act

      const result = await produtoUseCase.criarProduto(novoProdutoDTO);

      // Assert

      expect(result).toEqual({
        mensagem: 'Produto criado com sucesso',
        body: produtoDTO,
      });

      expect(produtoRepository.buscarProdutoPorNome).toHaveBeenCalledTimes(1);
      expect(produtoRepository.criarProduto).toHaveBeenCalledTimes(1);
    });
  });

  describe('Editar produto', () => {
    it('Deve ser lançado um erro se o produto informado para edição não existe', async () => {
      // Arrange

      const produtoDTO = new AtualizaProdutoDTO();
      produtoDTO.nome = 'Produto atualizada';
      produtoDTO.descricao = 'Descrição atualizada';

      jest
        .spyOn(produtoRepository, 'buscarProdutoPorId')
        .mockReturnValue(Promise.resolve(null));

      // Act
      // Assert

      expect(
        produtoUseCase.editarProduto(
          '0a14aa4e-75e7-405f-8601-81f60646c93d',
          produtoDTO,
        ),
      ).rejects.toThrow(
        new ProdutoNaoLocalizadoErro('Produto informado não existe'),
      );

      expect(produtoRepository.buscarProdutoPorId).toHaveBeenCalledTimes(1);
    });

    it('Deve ser lançado um erro se o produto informado para edição tiver o mesmo nome de um produto já registrada', async () => {
      // Arrange

      const atualizaProdutoDTO = new AtualizaProdutoDTO();
      atualizaProdutoDTO.nome = novoProdutoDTO.nome;

      jest
        .spyOn(produtoRepository, 'buscarProdutoPorId')
        .mockReturnValue(Promise.resolve(produtoModelMock));

      jest
        .spyOn(produtoRepository, 'buscarProdutoPorNome')
        .mockReturnValue(Promise.resolve(novoProdutoModelMock));

      // Act
      // Assert

      expect(
        produtoUseCase.editarProduto(produtoModelMock.id, atualizaProdutoDTO),
      ).rejects.toThrow(
        new ProdutoDuplicadoErro('Existe um produto com esse nome'),
      );

      expect(produtoRepository.buscarProdutoPorId).toHaveBeenCalledTimes(1);
    });

    it('Deve ser possível editar um produto', async () => {
      // Arrange

      const atualizaProdutoDto = new AtualizaProdutoDTO();
      const produtoDTO = makeProdutoDTO(
        produtoAtualizadaModelMock.id,
        produtoAtualizadaModelMock.nome,
        produtoAtualizadaModelMock.descricao,
        produtoAtualizadaModelMock.valorUnitario,
        produtoAtualizadaModelMock.imagemUrl,
        produtoAtualizadaModelMock.categoria.id,
        produtoAtualizadaModelMock.categoria.nome,
        produtoAtualizadaModelMock.categoria.descricao,
      );

      jest
        .spyOn(produtoRepository, 'buscarProdutoPorId')
        .mockReturnValue(Promise.resolve(produtoAtualizadaModelMock));

      jest
        .spyOn(produtoRepository, 'editarProduto')
        .mockReturnValue(Promise.resolve(produtoAtualizadaModelMock));

      // Act

      const result = await produtoUseCase.editarProduto(
        produtoAtualizadaModelMock.id,
        atualizaProdutoDto,
      );

      // Assert

      expect(result).toEqual({
        mensagem: 'Produto atualizado com sucesso',
        body: produtoDTO,
      });

      expect(produtoRepository.buscarProdutoPorId).toHaveBeenCalledTimes(1);
      expect(produtoRepository.editarProduto).toHaveBeenCalledTimes(1);
    });
  });

  describe('Excluir produto', () => {
    it('Deve ser retornado um erro se o id do produto informado para exclusão não existir na base de dados', async () => {
      // Arrange

      jest
        .spyOn(produtoRepository, 'buscarProdutoPorId')
        .mockReturnValue(Promise.resolve(null));

      // Act
      // Assert

      expect(
        produtoUseCase.excluirProduto('0a14aa4e-75e7-405f-8601-81f60646c93d'),
      ).rejects.toThrow(
        new ProdutoNaoLocalizadoErro('Produto informado não existe'),
      );

      expect(produtoRepository.buscarProdutoPorId).toHaveBeenCalledTimes(1);
    });

    it('Deve ser possível excluir um produto', async () => {
      // Arrange

      jest
        .spyOn(produtoRepository, 'buscarProdutoPorId')
        .mockReturnValue(Promise.resolve(produtoAtualizadaModelMock));

      // Act

      const result = await produtoUseCase.excluirProduto(
        produtoAtualizadaModelMock.id,
      );

      // Assert

      expect(result).toEqual({
        mensagem: 'Produto excluído com sucesso',
      });

      expect(produtoRepository.buscarProdutoPorId).toHaveBeenCalledTimes(1);
      expect(produtoRepository.excluirProduto).toHaveBeenCalledTimes(1);
    });
  });

  describe('Buscar Produto', () => {
    it('Deve deve retornado um erro ao tentar buscar um produto que o ID não esteja cadastrado no banco de dados', async () => {
      // Arrange

      jest
        .spyOn(produtoRepository, 'buscarProdutoPorId')
        .mockReturnValue(Promise.resolve(null));

      // Act
      // Assert

      expect(
        produtoUseCase.buscarProduto('0a14aa4e-7587-405f-8601-81f60646c93d'),
      ).rejects.toThrow(
        new ProdutoNaoLocalizadoErro('Produto informado não existe'),
      );

      expect(produtoRepository.buscarProdutoPorId).toHaveBeenCalledTimes(1);
    });

    it('Deve ser possível buscar um produto por ID', async () => {
      // Arrange

      const produtoDTO = makeProdutoDTO(
        produtoAtualizadaModelMock.id,
        produtoAtualizadaModelMock.nome,
        produtoAtualizadaModelMock.descricao,
        produtoAtualizadaModelMock.valorUnitario,
        produtoAtualizadaModelMock.imagemUrl,
        produtoAtualizadaModelMock.categoria.id,
        produtoAtualizadaModelMock.categoria.nome,
        produtoAtualizadaModelMock.categoria.descricao,
      );

      jest
        .spyOn(produtoRepository, 'buscarProdutoPorId')
        .mockReturnValue(Promise.resolve(produtoAtualizadaModelMock));

      // Act

      const result = await produtoUseCase.buscarProduto(
        produtoAtualizadaModelMock.id,
      );

      // Assert

      expect(result).toEqual(produtoDTO);
    });
  });

  describe('Listar Produtos', () => {
    it('Deve ser possível retornar uma lista com todos os produtos cadastrados', async () => {
      // Arrange

      const produto1DTO = makeProdutoDTO(
        produtoAtualizadaModelMock.id,
        produtoAtualizadaModelMock.nome,
        produtoAtualizadaModelMock.descricao,
        produtoAtualizadaModelMock.valorUnitario,
        produtoAtualizadaModelMock.imagemUrl,
        produtoAtualizadaModelMock.categoria.id,
        produtoAtualizadaModelMock.categoria.nome,
        produtoAtualizadaModelMock.categoria.descricao,
      );

      const produto2DTO = makeProdutoDTO(
        novoProdutoModelMock.id,
        novoProdutoModelMock.nome,
        novoProdutoModelMock.descricao,
        novoProdutoModelMock.valorUnitario,
        novoProdutoModelMock.imagemUrl,
        novoProdutoModelMock.categoria.id,
        novoProdutoModelMock.categoria.nome,
        novoProdutoModelMock.categoria.descricao,
      );

      const produto3DTO = makeProdutoDTO(
        produtoModelMock.id,
        produtoModelMock.nome,
        produtoModelMock.descricao,
        produtoModelMock.valorUnitario,
        produtoModelMock.imagemUrl,
        produtoModelMock.categoria.id,
        produtoModelMock.categoria.nome,
        produtoModelMock.categoria.descricao,
      );

      const listaProdutos: ProdutoDTO[] = [
        produto1DTO,
        produto2DTO,
        produto3DTO,
      ];

      jest
        .spyOn(produtoRepository, 'listarProdutos')
        .mockReturnValue(Promise.resolve(listaProdutosModel));

      // Act

      const result = await produtoUseCase.listarProdutos();

      // Assert

      expect(result).toEqual(listaProdutos);
    });

    it('Deve ser retornada uma lista vazia em casos onde não tem produtos criados', async () => {
      // Arrange

      jest
        .spyOn(produtoRepository, 'listarProdutos')
        .mockReturnValue(Promise.resolve([]));

      // Act

      const result = await produtoUseCase.listarProdutos();

      // Assert

      expect(result).toEqual([]);
    });
  });
});
