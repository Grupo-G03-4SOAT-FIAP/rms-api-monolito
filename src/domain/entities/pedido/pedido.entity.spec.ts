import { clienteEntityMock } from 'src/mocks/cliente.mock';
import { StatusPedido } from 'src/utils/pedido.enum';
import { ClienteEntity } from '../cliente/cliente.entity';
import { ProdutoEntity } from '../produto/produto.entity';
import { produtoEntityMock } from 'src/mocks/produto.mock';
import { PedidoEntity } from './pedido.entity';

describe('PedidoEntity', () => {
  let produtos: ProdutoEntity[];
  let statusPedido: StatusPedido;
  let numeroPedido: string;
  let cliente: ClienteEntity;
  let id: string;

  beforeEach(() => {
    // Defina as variáveis antes de cada teste
    produtos = [produtoEntityMock];
    statusPedido = StatusPedido.RECEBIDO;
    numeroPedido = '05012024';
    cliente = clienteEntityMock;
    id = '0a14aa4e-75e7-405f-8301-81f60646c93d';
  });

  it('deve criar uma instância de PedidoEntity', () => {
    const pedido = new PedidoEntity(
      produtos,
      statusPedido,
      numeroPedido,
      cliente,
      id,
    );

    expect(pedido.itensPedido).toEqual(produtos);
    expect(pedido.statusPedido).toEqual(statusPedido);
    expect(pedido.numeroPedido).toEqual(numeroPedido);
    expect(pedido.cliente).toEqual(cliente);
    expect(pedido.id).toEqual(id);
  });

  it('deve criar uma instância de PedidoEntity sem cliente e id', () => {
    const pedido = new PedidoEntity(produtos, statusPedido, numeroPedido);

    expect(pedido.itensPedido).toEqual(produtos);
    expect(pedido.statusPedido).toEqual(statusPedido);
    expect(pedido.numeroPedido).toEqual(numeroPedido);
    expect(pedido.cliente).toBeUndefined();
    expect(pedido.id).toBeUndefined();
  });
});
