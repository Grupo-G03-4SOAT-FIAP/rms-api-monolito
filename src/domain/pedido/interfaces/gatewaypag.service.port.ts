import { PedidoGatewayPagamentoDTO } from "src/presentation/rest/v1/presenters/pedido/gatewaypag.dto";
import { PedidoEntity } from "../entities/pedido.entity";

export interface IGatewayPagamentoService {
  criarPedido(pedido: PedidoEntity): Promise<string>;
  consultarPedido(idPedido: string): Promise<PedidoGatewayPagamentoDTO>;
}

export const IGatewayPagamentoService = Symbol('IGatewayPagamentoService');
