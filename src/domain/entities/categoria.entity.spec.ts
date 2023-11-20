import { CategoriaEntity } from './categoria.entity';

describe('Categoria Entity', () => {
  it('Deve ser criada com letras maiusculas o nome e a descrição de uma entidade categoria', async () => {
    const categoriaEntity = new CategoriaEntity(
      'Lanche Da Casa',
      'lanche x tudo',
    );
    expect(categoriaEntity.nome).toBe('Lanche Da Casa');
    expect(categoriaEntity.descricao).toBe('Lanche X Tudo');
  });
});
