import { CriaItemPedidoDTO } from 'src/adapters/inbound/rest/v1/presenters/item_pedido.dto';
import { CriaPedidoDTO } from 'src/adapters/inbound/rest/v1/presenters/pedido.dto';
import { ClienteEntity } from 'src/domain/entities/cliente/cliente.entity';
import { ItemPedidoEntity } from 'src/domain/entities/pedido/item_pedido.entity';
import { PedidoEntity } from 'src/domain/entities/pedido/pedido.entity';

export interface IPedidoFactory {
  criarItemPedido(itens: CriaItemPedidoDTO[]): Promise<ItemPedidoEntity[]>;
  criarEntidadeCliente(cpfCliente: string): Promise<ClienteEntity | null>;
  criarEntidadePedido(pedido: CriaPedidoDTO): Promise<PedidoEntity>;
}

export const IPedidoFactory = Symbol('IPedidoFactory');
