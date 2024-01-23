import { CategoriaEntity } from '../categoria/categoria.entity';

describe('CategoriaEntity', () => {
  let nome: string;
  let descricao: string;
  let id: string;

  beforeEach(() => {
    // Defina as variáveis antes de cada teste
    nome = 'lanche';
    descricao = 'lanche x tudo';
    id = '0a14aa4e-75e7-405f-8301-81f60646c93d';
  });

  it('deve criar uma instância de CategoriaEntity', () => {
    const categoria = new CategoriaEntity(nome, descricao, id);

    expect(categoria.nome).toEqual('Lanche');
    expect(categoria.descricao).toEqual('Lanche X Tudo');
    expect(categoria.id).toEqual(id);
  });

  it('deve criar uma instância de CategoriaEntity sem descricao e id', () => {
    const categoria = new CategoriaEntity(nome);

    expect(categoria.nome).toEqual('Lanche');
    expect(categoria.descricao).toBeUndefined();
    expect(categoria.id).toBeUndefined();
  });
});
