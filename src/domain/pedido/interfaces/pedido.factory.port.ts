import { CriaItemPedidoDTO } from 'src/presentation/rest/v1/presenters/pedido/item_pedido.dto';
import { ItemPedidoEntity } from '../entities/item_pedido.entity';
import { ClienteEntity } from 'src/domain/cliente/entities/cliente.entity';
import { CriaPedidoDTO } from 'src/presentation/rest/v1/presenters/pedido/pedido.dto';
import { PedidoEntity } from '../entities/pedido.entity';
import { CriaClienteDTO } from 'src/presentation/rest/v1/presenters/cliente/cliente.dto';

export interface IPedidoFactory {
  criarItemPedido(itens: CriaItemPedidoDTO[]): Promise<ItemPedidoEntity[]>;
  criarEntidadeCliente(criaClienteDTO: CriaClienteDTO): Promise<ClienteEntity | null>;
  criarEntidadeClienteDoCPF(cpfCliente: string): Promise<ClienteEntity | null>;
  criarEntidadePedido(pedido: CriaPedidoDTO): Promise<PedidoEntity>;
}

export const IPedidoFactory = Symbol('IPedidoFactory');
