import { CategoriaEntity } from './categoria.entity';
import { ProdutoEntity } from './produto.entity';

describe('Produto Entity', () => {
  it('Deve ser criado com letras maiusculas o nome e a descrição de uma entidade produto', async () => {
    const categoriaEntity = new CategoriaEntity(
      'Lanche',
      'Lanche x tudo',
      '0a14aa4e-75e7-405f-8301-81f60646c93d',
    );

    const produtoEntity = new ProdutoEntity(
      'produto X',
      categoriaEntity,
      5.0,
      'http://',
      'teste produto x',
      '0a14aa4e-75e7-405f-8301-81f60646c93d',
    );

    expect(produtoEntity.nome).toBe('Produto X');
    expect(produtoEntity.descricao).toBe('Teste Produto X');
  });
});
