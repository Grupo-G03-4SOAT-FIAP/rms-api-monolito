import { Inject, Injectable } from '@nestjs/common';
import { IPedidoDTOFactory } from '../interfaces/pedido.dto.factory.port';
import { IProdutoDTOFactory } from 'src/domain/produto/interfaces/produto.dto.factory.port';
import { IClienteDTOFactory } from 'src/domain/cliente/interfaces/cliente.dto.factory.port';
import { PedidoModel } from 'src/infrastructure/sql/models/pedido.model';
import { PedidoDTO } from 'src/presentation/rest/v1/presenters/pedido/pedido.dto';
import { ClienteDTO } from 'src/presentation/rest/v1/presenters/cliente/cliente.dto';
import { ClienteModel } from 'src/infrastructure/sql/models/cliente.model';
import { ItemPedidoModel } from 'src/infrastructure/sql/models/item_pedido.model';
import { ItemPedidoDTO } from 'src/presentation/rest/v1/presenters/pedido/item_pedido.dto';
import { ClienteEntity } from 'src/domain/cliente/entities/cliente.entity';

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
      cliente = this.clienteDTOFactory.criarClienteDTO(pedido.cliente as unknown as ClienteEntity);
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

  criarListaPedidoDTO(pedidos: PedidoModel[]): PedidoDTO[] | [] {
    const listaPedidosDTO = pedidos.map((pedido: PedidoModel) => {
      const itensPedido = this.criarListaItemPedidoDTO(pedido.itensPedido);

      let cliente: ClienteDTO | ClienteModel | null = pedido.cliente;
      if (cliente) {
        cliente = this.clienteDTOFactory.criarClienteDTO(pedido.cliente as unknown as ClienteEntity);
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
