import { MensagemGatewayPagamentoDTO } from 'src/adapters/inbound/rest/v1/presenters/gatewaypag.dto';
import {
  AtualizaPedidoDTO,
  CriaPedidoDTO,
  PedidoDTO,
} from 'src/adapters/inbound/rest/v1/presenters/pedido.dto';
import { HTTPResponse } from 'src/utils/HTTPResponse';

export interface IPedidoUseCase {
  criarPedido(pedido: CriaPedidoDTO): Promise<HTTPResponse<PedidoDTO>>;
  editarPedido(
    pedidoId: string,
    pedido: AtualizaPedidoDTO,
  ): Promise<HTTPResponse<PedidoDTO>>;
  buscarPedido(pedidoId: string): Promise<PedidoDTO>;
  listarPedidos(): Promise<PedidoDTO[] | []>;
  listarPedidosRecebido(): Promise<PedidoDTO[] | []>;
  webhookPagamento(id: string, topic: string, mensagem: MensagemGatewayPagamentoDTO): Promise<void>;
}

export const IPedidoUseCase = Symbol('IPedidoUseCase');
