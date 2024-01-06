import { CategoriaEntity } from './categoria.entity';

describe('Categoria Entity', () => {
  it('Deve ser criada com letras maiusculas o nome e a descrição de uma entidade categoria', async () => {
    // Arrange

    const categoriaEntity = new CategoriaEntity(
      'lanche da casa',
      'lanche x tudo',
    );

    // Act
    // Assert

    expect(categoriaEntity.nome).toBe('Lanche Da Casa');
    expect(categoriaEntity.descricao).toBe('Lanche X Tudo');
  });
});
