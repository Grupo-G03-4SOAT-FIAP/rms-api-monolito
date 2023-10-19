import { ProdutoEntity } from './produto.entity';
import { ClienteEntity } from './cliente.entity';

export class PedidoEntity {
  id: string;
  itemsPedido: ProdutoEntity[];
  cliente: ClienteEntity;
  statusPagamento: string;
  statusPedido: string;

  constructor(
    itemsPedido: ProdutoEntity[],
    statusPagamento: string,
    statusPedido: string,
    id?: string,
    cliente?: ClienteEntity,
  ) {
    this.id = id;
    this.itemsPedido = itemsPedido;
    this.cliente = cliente;
    this.statusPagamento = statusPagamento;
    this.statusPedido = statusPedido;
  }
}
