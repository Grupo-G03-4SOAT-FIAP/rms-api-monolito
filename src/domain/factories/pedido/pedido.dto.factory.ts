import { Inject, Injectable } from '@nestjs/common';
import { ClienteDTO } from 'src/adapters/inbound/rest/v1/presenters/cliente.dto';
import { ItemPedidoDTO } from 'src/adapters/inbound/rest/v1/presenters/item_pedido.dto';
import { PedidoDTO } from 'src/adapters/inbound/rest/v1/presenters/pedido.dto';
import { ClienteModel } from 'src/adapters/outbound/models/cliente.model';
import { ItemPedidoModel } from 'src/adapters/outbound/models/item_pedido.model';
import { PedidoModel } from 'src/adapters/outbound/models/pedido.model';
import { IClienteDTOFactory } from 'src/domain/ports/cliente/cliente.dto.factory.port';
import { IPedidoDTOFactory } from 'src/domain/ports/pedido/pedido.dto.factory.port';
import { IProdutoDTOFactory } from 'src/domain/ports/produto/produto.dto.factory.port';

@Injectable()
export class PedidoDTOFactory implements IPedidoDTOFactory {
  constructor(
    @Inject(IProdutoDTOFactory)
    private readonly produtoDTOFactory: IProdutoDTOFactory,
    @Inject(IClienteDTOFactory)
    private readonly clienteDTOFactory: IClienteDTOFactory,
  ) {}

  criarPedidoDTO(pedido: PedidoModel): PedidoDTO {
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
    pedidoDTO.cliente = cliente;
    return pedidoDTO;
  }

  criarListaPedidoDTO(pedidos: PedidoModel[]): PedidoDTO[] | [] {
    const listaPedidosDTO = pedidos.map((pedido: PedidoModel) => {
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
      pedidoDTO.cliente = cliente;
      return pedidoDTO;
    });

    return listaPedidosDTO;
  }

  criarListaItemPedidoDTO(itemPedidos: ItemPedidoModel[]): ItemPedidoDTO[] {
    const listaItensPedidoDTO = itemPedidos.map(
      (itemPedido: ItemPedidoModel) => {
        const produto = this.produtoDTOFactory.criarProdutoDTO(
          itemPedido.produto,
        );

        const itemPedidoDTO = new ItemPedidoDTO();
        itemPedidoDTO.id = itemPedido.id;
        itemPedidoDTO.quantidade = itemPedido.quantidade;
        itemPedidoDTO.produto = produto;
        return itemPedidoDTO;
      },
    );

    return listaItensPedidoDTO;
  }
}
