import { ProdutoEntity } from 'src/domain/produto/entities/produto.entity';
import { ItemPedidoEntity } from './item_pedido.entity';
import { produtoEntityMock } from 'src/mocks/produto.mock';

describe('ItemPedidoEntity', () => {
  let produto: ProdutoEntity;
  let quantidade: number;
  let id: string;

  beforeEach(() => {
    // Defina as variáveis antes de cada teste
    produto = produtoEntityMock;
    quantidade = 2;
    id = '0a14aa4e-75e7-405f-8301-81f60646c93d';
  });

  it('deve criar uma instância de ItemPedidoEntity', () => {
    const itemPedido = new ItemPedidoEntity(produto, quantidade, id);

    expect(itemPedido.produto).toEqual(produto);
    expect(itemPedido.quantidade).toEqual(quantidade);
    expect(itemPedido.id).toEqual(id);
  });

  it('deve criar uma instância de ItemPedidoEntity sem id', () => {
    const itemPedido = new ItemPedidoEntity(produto, quantidade);

    expect(itemPedido.produto).toEqual(produto);
    expect(itemPedido.quantidade).toEqual(quantidade);
    expect(itemPedido.id).toBeUndefined();
  });
});
