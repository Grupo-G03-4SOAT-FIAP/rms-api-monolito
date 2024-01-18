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

  async criarPedidoDTO(pedido: PedidoModel): Promise<PedidoDTO> {
    const itensPedido = await this.criarListaItemPedidoDTO(pedido.itensPedido);

    let cliente: ClienteDTO | ClienteModel | null = pedido.cliente;
    if (cliente) {
      cliente = await this.clienteDTOFactory.criarClienteDTO(pedido.cliente);
    }

    const pedidoDTO = new PedidoDTO();
    pedidoDTO.id = pedido.id;
    pedidoDTO.numeroPedido = pedido.numeroPedido;
    pedidoDTO.itensPedido = itensPedido;
    pedidoDTO.statusPedido = pedido.statusPedido;
    pedidoDTO.cliente = cliente;
    return pedidoDTO;
  }

  async criarListaPedidoDTO(pedidos: PedidoModel[]): Promise<PedidoDTO[] | []> {
    const listaPedidosDTO = await Promise.all(
      pedidos.map(async (pedido: PedidoModel) => {
        const itensPedido = await this.criarListaItemPedidoDTO(
          pedido.itensPedido,
        );

        let cliente: ClienteDTO | ClienteModel | null = pedido.cliente;
        if (cliente) {
          cliente = await this.clienteDTOFactory.criarClienteDTO(
            pedido.cliente,
          );
        }

        const pedidoDTO = new PedidoDTO();
        pedidoDTO.id = pedido.id;
        pedidoDTO.numeroPedido = pedido.numeroPedido;
        pedidoDTO.itensPedido = itensPedido;
        pedidoDTO.statusPedido = pedido.statusPedido;
        pedidoDTO.cliente = cliente;
        return pedidoDTO;
      }),
    );

    return listaPedidosDTO;
  }

  async criarListaItemPedidoDTO(
    itemPedidos: ItemPedidoModel[],
  ): Promise<ItemPedidoDTO[]> {
    const listaItensPedidoDTO = await Promise.all(
      itemPedidos.map(async (itemPedido: ItemPedidoModel) => {
        const produto = await this.produtoDTOFactory.criarProdutoDTO(
          itemPedido.produto,
        );

        const itemPedidoDTO = new ItemPedidoDTO();
        itemPedidoDTO.id = itemPedido.id;
        itemPedidoDTO.quantidade = itemPedido.quantidade;
        itemPedidoDTO.produto = produto;
        return itemPedidoDTO;
      }),
    );

    return listaItensPedidoDTO;
  }
}
