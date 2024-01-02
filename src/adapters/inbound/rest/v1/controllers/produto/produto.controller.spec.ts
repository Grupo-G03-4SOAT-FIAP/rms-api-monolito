import { Test, TestingModule } from '@nestjs/testing';
import { ProdutoController } from './produto.controller';
import { IProdutoUseCase } from '../../../../../../domain/ports/produto/produto.use_case.port';
import {
  AtualizaProdutoDTO,
  ProdutoDTO,
  CriaProdutoDTO,
} from '../../presenters/produto.dto';
import {
  ProdutoDuplicadoErro,
  ProdutoNaoLocalizadoErro,
} from '../../../../../../domain/exceptions/produto.exception';

const novaProdutoDTO = new CriaProdutoDTO();
novaProdutoDTO.nome = 'Nova produto';
novaProdutoDTO.descricao = 'Nova descrição';

describe('Produto', () => {

  let produtoController: ProdutoController;
  let produtoUserCase: IProdutoUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProdutoController],
      providers: [
        {
          provide: IProdutoUseCase,
          useValue: {
            criarProduto: jest.fn(),
            editarProduto: jest.fn(),
            excluirProduto: jest.fn(),
            buscarProduto: jest.fn(),
            listarProdutos: jest.fn(),
          },
        },
      ],
    }).compile();
    produtoController = module.get<ProdutoController>(ProdutoController);
    produtoUserCase = module.get<IProdutoUseCase>(IProdutoUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Deve ter uma definição para Produto Controller e Produto Use Case', async () => {
    expect(produtoController).toBeDefined();
    expect(produtoUserCase).toBeDefined();
  });

  describe('Criar produto', () => {

    it('Deve ser retornado uma exception se ocorrer um erro para criar um produto', async () => {

      // Arrange

      jest
        .spyOn(produtoUserCase, 'criarProduto')
        .mockRejectedValue(new Error());

      // Act
      // Assert

      expect(produtoController.criar(novaProdutoDTO)).rejects.toThrow();

    });

    it('Deve ser retornado uma exception ao tentar criar um produto duplicado', async () => {

      // Arrange

      jest
        .spyOn(produtoUserCase, 'criarProduto')
        .mockRejectedValue(
          new ProdutoDuplicadoErro('Existe um produto com esse nome'),
        );

      // Act
      // Assert

      expect(
        produtoController.criar(novaProdutoDTO)
      ).rejects.toThrow(
        new ProdutoDuplicadoErro('Existe um produto com esse nome'),
      );

    });

    it('Deve ser possível criar um novo produto', async () => {

      // Arrange

      const produtoDTO = new ProdutoDTO();
      produtoDTO.id = '0a14aa4e-75e7-405f-8301-81f60646c93c';
      produtoDTO.nome = novaProdutoDTO.nome;
      produtoDTO.descricao = novaProdutoDTO.descricao;

      jest.spyOn(produtoUserCase, 'criarProduto').mockReturnValue(
        Promise.resolve({
          mensagem: 'Produto criada com sucesso',
          body: produtoDTO,
        }),
      );

      // Act

      const result = await produtoController.criar(novaProdutoDTO);

      // Assert

      expect(result).toEqual({
        mensagem: 'Produto criada com sucesso',
        body: produtoDTO,
      });

    });

  });

  describe('Atualizar Produto', () => {

    it('Deve ser retornada uma exception ao tentar atualizar o nome do produto com o mesmo de um produto já existente', async () => {

      // Arrange

      jest
        .spyOn(produtoUserCase, 'editarProduto')
        .mockRejectedValue(
          new ProdutoDuplicadoErro('Existe um produto com esse nome'),
        );

      // Act
      // Assert

      expect(
        produtoController.atualizar(
          '0a14aa4e-75e7-405f-8301-81f60646c93c',
          novaProdutoDTO,
        ),
      ).rejects.toThrow(
        new ProdutoDuplicadoErro('Existe um produto com esse nome'),
      );

    });

    it('Deve ser retornada uma exception ao tentar atualizar um produto não existente', async () => {

      // Arrange

      jest
        .spyOn(produtoUserCase, 'editarProduto')
        .mockRejectedValue(
          new ProdutoNaoLocalizadoErro('Produto informado não existe'),
        );

      // Act
      // Assert

      expect(
        produtoController.atualizar(
          '0a14aa4e-75e7-405f-8301-81f60646c93c',
          novaProdutoDTO,
        ),
      ).rejects.toThrow(
        new ProdutoNaoLocalizadoErro('Produto informado não existe'),
      );

    });

    it('Deve ser retornada uma exception em caso de erros para atualizar um produto', async () => {

      // Arrange

      jest
        .spyOn(produtoUserCase, 'editarProduto')
        .mockRejectedValue(new Error());

      // Act
      // Assert

      expect(
        produtoController.atualizar(
          '0a14aa4e-75e7-405f-8301-81f60646c93c',
          novaProdutoDTO,
        ),
      ).rejects.toThrow(new Error());

    });

    it('Deve ser possível atualizar um produto', async () => {

      // Arrange

      const produtoEditada = new ProdutoDTO();
      produtoEditada.nome = 'Nome Produto Editada';
      produtoEditada.descricao = 'Descrição Produto Editada';

      jest.spyOn(produtoUserCase, 'editarProduto').mockReturnValue(
        Promise.resolve({
          mensagem: 'Produto atualizada com sucesso',
          body: produtoEditada,
        }),
      );

      const produtoAtualizar = new AtualizaProdutoDTO();

      // Act

      const result = produtoController.atualizar(
        '0a14aa4e-75e7-405f-8301-81f60646c93c',
        produtoAtualizar,
      );

      // Assert

      expect(result).toStrictEqual(
        Promise.resolve({
          mensagem: 'Produto atualizada com sucesso',
          body: produtoEditada,
        }),
      );

    });

  });

  describe('Remover Produto', () => {

    it('Deve ser retornada uma exception se tentar remover um produto que não existe', async () => {

      // Arrange

      jest
        .spyOn(produtoUserCase, 'excluirProduto')
        .mockRejectedValue(
          new ProdutoNaoLocalizadoErro('Produto informado não existe'),
        );

      // Act
      // Assert

      expect(
        produtoController.remover('0a14aa4e-75e7-405f-8301-81f60646c93c'),
      ).rejects.toThrow(
        new ProdutoNaoLocalizadoErro('Produto informado não existe'),
      );

    });

    it('Deve ser retornada uma exception em caso de erros para remover um produto', async () => {

      // Arrange

      jest
        .spyOn(produtoUserCase, 'excluirProduto')
        .mockRejectedValue(new Error());

      // Act
      // Assert

      expect(
        produtoController.remover('0a14aa4e-75e7-405f-8301-81f60646c93c'),
      ).rejects.toThrow(new Error());

    });

    it('Deve ser possível remover um produto', async () => {

      // Arrange

      jest.spyOn(produtoUserCase, 'excluirProduto').mockReturnValue(
        Promise.resolve({
          mensagem: 'Produto excluida com sucesso',
        }),
      );

      // Act

      const result = await produtoController.remover('0a14aa4e-75e7-405f-8301-81f60646c93c');

      // Assert

      expect(result).toEqual({
        mensagem: 'Produto excluida com sucesso',
      });

    });

  });

  describe('Buscar Produto por ID', () => {

    it('Deve ser retornada uma exception se buscar um produto com id que não existe', async () => {

      // Arrange

      jest
        .spyOn(produtoUserCase, 'buscarProduto')
        .mockRejectedValue(
          new ProdutoNaoLocalizadoErro('Produto informado não existe'),
        );

      // Act
      // Assert

      expect(
        produtoController.buscar('0a14aa4e-75e7-405f-8301-81f60646c93c'),
      ).rejects.toThrow(
        new ProdutoNaoLocalizadoErro('Produto informado não existe'),
      );

    });

    it('Deve ser retornada uma exception se ocorrer um erro ao tentar buscar um produto', async () => {

      // Arrange

      jest
        .spyOn(produtoUserCase, 'buscarProduto')
        .mockRejectedValue(new Error());

      // Act
      // Assert

      expect(
        produtoController.buscar('0a14aa4e-75e7-405f-8301-81f60646c93c'),
      ).rejects.toThrow(new Error());

    });

    it('Deve ser possível buscar um produto pelo seu ID', async () => {

      // Arrange

      const produto = new ProdutoDTO();
      produto.nome = 'Nome produto';
      produto.descricao = 'Descrição produto';

      jest
        .spyOn(produtoUserCase, 'buscarProduto')
        .mockReturnValue(Promise.resolve(produto));

      // Act

      const result = await produtoController.buscar('0a14aa4e-75e7-405f-8301-81f60646c93c');

      // Assert

      expect(result).toEqual(produto);

    });

  });

  describe('Listar todas as produtos', () => {

    it('Deve ser retornado um array vazio caso não tenham produtos cadastrados', async () => {

      // Arrange

      jest
        .spyOn(produtoUserCase, 'listarProdutos')
        .mockReturnValue(Promise.resolve([]));

      // Act

      const result = await produtoController.listar();

      // Assert

      expect(result).toEqual([]);

    });

    it('Deve ser possível retornar todas os produtos cadastrados', async () => {

      // Arrange

      const produtoDTO1 = new ProdutoDTO();
      produtoDTO1.id = '1a14aa4e-75e7-405f-8301-81f60646c93c';
      produtoDTO1.nome = 'Nome Produto 1';
      produtoDTO1.descricao = 'Descrição 1';

      const produtoDTO2 = new ProdutoDTO();
      produtoDTO2.id = '2a14aa4e-75e7-405f-8301-81f60646c93c';
      produtoDTO2.nome = 'Nome Produto 2';
      produtoDTO2.descricao = 'Descrição 2';

      const produtoDTO3 = new ProdutoDTO();
      produtoDTO3.id = '3a14aa4e-75e7-405f-8301-81f60646c93c';
      produtoDTO3.nome = 'Nome Produto 3';
      produtoDTO3.descricao = 'Descrição 3';

      const listaProdutos: ProdutoDTO[] = [
        produtoDTO1,
        produtoDTO2,
        produtoDTO3,
      ];

      jest
        .spyOn(produtoUserCase, 'listarProdutos')
        .mockReturnValue(Promise.resolve(listaProdutos));

      // Act

      const result = await produtoController.listar();

      // Assert

      expect(result).toEqual(listaProdutos);

    });

  });

});
