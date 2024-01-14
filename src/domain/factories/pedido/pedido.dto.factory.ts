import { Inject, Injectable } from '@nestjs/common';
import { PedidoDTO } from 'src/adapters/inbound/rest/v1/presenters/pedido.dto';
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
    const itensPedido = await this.produtoDTOFactory.criarListaProdutoDTO(
      pedido.itensPedido,
    );

    const clienteDTO = await this.clienteDTOFactory.criarClienteDTO(
      pedido.cliente,
    );

    const pedidoDTO = new PedidoDTO();
    pedidoDTO.id = pedido.id;
    pedidoDTO.numeroPedido = pedido.numeroPedido;
    pedidoDTO.itensPedido = itensPedido;
    pedidoDTO.statusPedido = pedido.statusPedido;
    pedidoDTO.cliente = clienteDTO;
    return pedidoDTO;
  }

  async criarListaPedidoDTO(pedidos: PedidoModel[]): Promise<PedidoDTO[] | []> {
    const listaPedidosDTO = await Promise.all(
      pedidos.map(async (pedido: PedidoModel) => {
        const itensPedido = await this.produtoDTOFactory.criarListaProdutoDTO(
          pedido.itensPedido,
        );

        const clienteDTO = await this.clienteDTOFactory.criarClienteDTO(
          pedido.cliente,
        );

        const pedidoDTO = new PedidoDTO();
        pedidoDTO.id = pedido.id;
        pedidoDTO.numeroPedido = pedido.numeroPedido;
        pedidoDTO.itensPedido = itensPedido;
        pedidoDTO.statusPedido = pedido.statusPedido;
        pedidoDTO.cliente = clienteDTO;
        return pedidoDTO;
      }),
    );

    return listaPedidosDTO;
  }
}
