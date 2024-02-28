import { Inject, Injectable } from '@nestjs/common';
import { IPedidoDTOFactory } from '../interfaces/pedido.dto.factory.port';
import { IProdutoDTOFactory } from '../../../domain/produto/interfaces/produto.dto.factory.port';
import { IClienteDTOFactory } from '../../../domain/cliente/interfaces/cliente.dto.factory.port';
import {
  CriaPedidoDTO,
  PedidoDTO,
} from '../../../presentation/rest/v1/presenters/pedido/pedido.dto';
import { ClienteDTO } from '../../../presentation/rest/v1/presenters/cliente/cliente.dto';
import { ClienteModel } from '../../../infrastructure/sql/models/cliente.model';
import {
  CriaItemPedidoDTO,
  ItemPedidoDTO,
} from '../../../presentation/rest/v1/presenters/pedido/item_pedido.dto';
import { PedidoEntity } from '../entities/pedido.entity';
import { ItemPedidoEntity } from '../entities/item_pedido.entity';

@Injectable()
export class PedidoDTOFactory implements IPedidoDTOFactory {
  constructor(
    @Inject(IProdutoDTOFactory)
    private readonly produtoDTOFactory: IProdutoDTOFactory,
    @Inject(IClienteDTOFactory)
    private readonly clienteDTOFactory: IClienteDTOFactory,
  ) {}

  criarPedidoDTO(pedido: PedidoEntity): PedidoDTO {
    const itensPedido = this.criarListaItemPedidoDTO(pedido.itensPedido);

    let cliente: ClienteDTO | ClienteModel | null = pedido.cliente;
    if (cliente) {
      cliente = this.clienteDTOFactory.criarClienteDTO(pedido.cliente);
    }

    const pedidoDTO = new PedidoDTO();
    pedidoDTO.id = pedido.id;
    pedidoDTO.numeroPedido = pedido.numeroPedido;
    pedidoDTO.itensPedido = itensPedido;
    pedidoDTO.pago = pedido.pago;
    pedidoDTO.statusPedido = pedido.statusPedido;
    pedidoDTO.criadoEm = pedido.criadoEm;
    pedidoDTO.atualizadoEm = pedido.atualizadoEm;
    pedidoDTO.cliente = cliente;
    return pedidoDTO;
  }

  criarListaPedidoDTO(pedidos: PedidoEntity[]): PedidoDTO[] | [] {
    const listaPedidosDTO = pedidos.map((pedido: PedidoEntity) => {
      const itensPedido = this.criarListaItemPedidoDTO(pedido.itensPedido);

      let cliente: ClienteDTO | ClienteModel | null = pedido.cliente;
      if (cliente) {
        cliente = this.clienteDTOFactory.criarClienteDTO(pedido.cliente);
      }

      const pedidoDTO = new PedidoDTO();
      pedidoDTO.id = pedido.id;
      pedidoDTO.numeroPedido = pedido.numeroPedido;
      pedidoDTO.itensPedido = itensPedido;
      pedidoDTO.pago = pedido.pago;
      pedidoDTO.statusPedido = pedido.statusPedido;
      pedidoDTO.criadoEm = pedido.criadoEm;
      pedidoDTO.atualizadoEm = pedido.atualizadoEm;
      pedidoDTO.cliente = cliente;
      return pedidoDTO;
    });

    return listaPedidosDTO;
  }

  criarItemPedidoDTO(itemPedido: ItemPedidoEntity): ItemPedidoDTO {
    const produto = this.produtoDTOFactory.criarProdutoDTO(itemPedido.produto);
    const itemPedidoDTO = new ItemPedidoDTO();
    itemPedidoDTO.id = itemPedido.id;
    itemPedidoDTO.quantidade = itemPedido.quantidade;
    itemPedidoDTO.produto = produto;
    return itemPedidoDTO;
  }

  criarListaItemPedidoDTO(itemPedidos: ItemPedidoEntity[]): ItemPedidoDTO[] {
    const listaItensPedidoDTO = itemPedidos.map(
      (itemPedido: ItemPedidoEntity) => {
        const itemPedidoDTO = this.criarItemPedidoDTO(itemPedido);
        return itemPedidoDTO;
      },
    );

    return listaItensPedidoDTO;
  }

  criarCriaPedidoDTO(
    cpfCliente: string,
    itensPedido: CriaItemPedidoDTO[],
  ): CriaPedidoDTO {
    const criaPedidoDTO = new CriaPedidoDTO();
    criaPedidoDTO.cpfCliente = cpfCliente;
    criaPedidoDTO.itensPedido = itensPedido;
    return criaPedidoDTO;
  }
}
