import { Test, TestingModule } from '@nestjs/testing';
import { ProdutoDTOFactory } from './produto.dto.factory';
import { produtoDTOMock, produtoModelMock } from 'src/mocks/produto.mock';

describe('ProdutoDTOFactory', () => {
  let produtoDTOFactory: ProdutoDTOFactory;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProdutoDTOFactory],
    }).compile();

    produtoDTOFactory = module.get<ProdutoDTOFactory>(ProdutoDTOFactory);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve criar um produtoDTO', async () => {
    const result = await produtoDTOFactory.criarProdutoDTO(produtoModelMock);
    expect(result).toStrictEqual(produtoDTOMock);
  });

  it('deve criar uma lista de produtoDTO', async () => {
    const result = await produtoDTOFactory.criarListaProdutoDTO([
      produtoModelMock,
    ]);
    expect(result).toStrictEqual([produtoDTOMock]);
  });

  it('deve criar uma lista vazia de produtoDTO', async () => {
    const result = await produtoDTOFactory.criarListaProdutoDTO([]);
    expect(result).toStrictEqual([]);
  });
});
