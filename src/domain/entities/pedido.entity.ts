import { ProdutoEntity } from './produto.entity';
import { ClienteEntity } from './cliente.entity';
import { StatusPedido } from 'src/utils/pedido.enum';

export class PedidoEntity {
  itemsPedido: ProdutoEntity[];
  statusPedido?: StatusPedido;
  cliente?: ClienteEntity;
  id?: string;

  constructor(
    itemsPedido: ProdutoEntity[],
    statusPedido?: StatusPedido,
    cliente?: ClienteEntity,
    id?: string,
  ) {
    this.id = id;
    this.itemsPedido = itemsPedido;
    this.cliente = cliente;
    this.statusPedido = statusPedido;
  }
}
