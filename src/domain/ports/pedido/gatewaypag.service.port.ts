import { PedidoGatewayPagamentoDTO } from 'src/adapters/inbound/rest/v1/presenters/gatewaypag.dto';
import { PedidoEntity } from '../../entities/pedido/pedido.entity';

export interface IGatewayPagamentoService {
  criarPedido(pedido: PedidoEntity): Promise<string>;
  consultarPedido(idPedido: string): Promise<PedidoGatewayPagamentoDTO>;
}

export const IGatewayPagamentoService = Symbol('IGatewayPagamentoService');
