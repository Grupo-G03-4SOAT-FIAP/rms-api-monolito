import { ProdutoEntity } from './produto.entity';
import { ClienteEntity } from './cliente.entity';

export class PedidoEntity {
  itemsPedido: ProdutoEntity[];
  statusPagamento: string;
  statusPedido: string;
  cliente?: ClienteEntity;
  id?: string;

  constructor(
    itemsPedido: ProdutoEntity[],
    statusPagamento: string,
    statusPedido: string,
    cliente?: ClienteEntity,
    id?: string,
  ) {
    this.id = id;
    this.itemsPedido = itemsPedido;
    this.cliente = cliente;
    this.statusPagamento = statusPagamento;
    this.statusPedido = statusPedido;
  }
}
