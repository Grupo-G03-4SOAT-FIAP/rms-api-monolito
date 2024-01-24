import { CategoriaEntity } from 'src/domain/categoria/entities/categoria.entity';
import { ProdutoEntity } from './produto.entity';
import { categoriaEntityMock } from 'src/mocks/categoria.mock';

describe('ProdutoEntity', () => {
  let nome: string;
  let categoria: CategoriaEntity;
  let valorUnitario: number;
  let imagemUrl: string;
  let descricao: string;
  let id: string;

  beforeEach(() => {
    // Defina as variáveis antes de cada teste
    nome = 'produto x';
    categoria = categoriaEntityMock;
    valorUnitario = 5.0;
    imagemUrl = 'http://';
    descricao = 'teste produto x';
    id = '0a14aa4e-75e7-405f-8301-81f60646c93d';
  });

  it('deve criar uma instância de ProdutoEntity', () => {
    const produto = new ProdutoEntity(
      nome,
      categoria,
      valorUnitario,
      imagemUrl,
      descricao,
      id,
    );

    expect(produto.nome).toEqual('Produto X');
    expect(produto.categoria).toEqual(categoria);
    expect(produto.valorUnitario).toEqual(valorUnitario);
    expect(produto.imagemUrl).toEqual(imagemUrl);
    expect(produto.descricao).toEqual('Teste Produto X');
    expect(produto.id).toEqual(id);
  });

  it('deve criar uma instância de ProdutoEntity sem descricao e id', () => {
    const produto = new ProdutoEntity(
      nome,
      categoria,
      valorUnitario,
      imagemUrl,
    );

    expect(produto.nome).toEqual('Produto X');
    expect(produto.categoria).toEqual(categoria);
    expect(produto.valorUnitario).toEqual(valorUnitario);
    expect(produto.imagemUrl).toEqual(imagemUrl);
    expect(produto.descricao).toBeUndefined();
    expect(produto.id).toBeUndefined();
  });
});
