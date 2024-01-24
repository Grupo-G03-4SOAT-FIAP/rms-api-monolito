import { HTTPResponse } from "src/application/common/HTTPResponse";
import { MensagemGatewayPagamentoDTO } from "src/presentation/rest/v1/presenters/pedido/gatewaypag.dto";
import { AtualizaPedidoDTO, CriaPedidoDTO, PedidoDTO } from "src/presentation/rest/v1/presenters/pedido/pedido.dto";

export interface IPedidoUseCase {
  criarPedido(pedido: CriaPedidoDTO): Promise<HTTPResponse<PedidoDTO>>;
  editarPedido(
    pedidoId: string,
    pedido: AtualizaPedidoDTO,
  ): Promise<HTTPResponse<PedidoDTO>>;
  buscarPedido(pedidoId: string): Promise<PedidoDTO>;
  listarPedidos(): Promise<PedidoDTO[] | []>;
  listarPedidosRecebido(): Promise<PedidoDTO[] | []>;
  webhookPagamento(
    id: string,
    topic: string,
    mensagem: MensagemGatewayPagamentoDTO,
  ): Promise<void>;
}

export const IPedidoUseCase = Symbol('IPedidoUseCase');
