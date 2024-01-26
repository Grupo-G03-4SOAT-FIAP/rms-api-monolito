import { Test, TestingModule } from '@nestjs/testing';
import { ProdutoEntityFactory } from './produto.entity.factory';
import { produtoEntityMock, produtoModelMock } from 'src/mocks/produto.mock';

describe('ProdutoEntityFactory', () => {
  let produtoEntityFactory: ProdutoEntityFactory;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProdutoEntityFactory],
    }).compile();

    produtoEntityFactory =
      module.get<ProdutoEntityFactory>(ProdutoEntityFactory);
  });

  it('deve criar uma entidade categoria', () => {
    const result = produtoEntityFactory.criarEntidadeCategoria(produtoModelMock.categoria);
    expect(result).toStrictEqual(produtoEntityMock.categoria);
  });

  it('deve criar uma entidade produto', () => {
    const result = produtoEntityFactory.criarEntidadeProduto(produtoModelMock);
    expect(result).toStrictEqual(produtoEntityMock);
  });
});
