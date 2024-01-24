import { CriaItemPedidoDTO } from 'src/presentation/rest/v1/presenters/pedido/item_pedido.dto';
import { ItemPedidoEntity } from '../entities/item_pedido.entity';
import { ClienteEntity } from 'src/domain/cliente/entities/cliente.entity';
import { CriaPedidoDTO } from 'src/presentation/rest/v1/presenters/pedido/pedido.dto';
import { PedidoEntity } from '../entities/pedido.entity';

export interface IPedidoFactory {
  criarItemPedido(itens: CriaItemPedidoDTO[]): Promise<ItemPedidoEntity[]>;
  criarEntidadeCliente(cpfCliente: string): Promise<ClienteEntity | null>;
  criarEntidadePedido(pedido: CriaPedidoDTO): Promise<PedidoEntity>;
}

export const IPedidoFactory = Symbol('IPedidoFactory');
