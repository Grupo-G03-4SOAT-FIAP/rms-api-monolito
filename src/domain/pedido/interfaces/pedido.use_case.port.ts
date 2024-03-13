import { HTTPResponse } from 'src/application/common/HTTPResponse';
import { ClienteDTO } from 'src/presentation/rest/v1/presenters/cliente/cliente.dto';
import { MensagemMercadoPagoDTO } from 'src/presentation/rest/v1/presenters/pedido/gatewaypag.dto';
import {
  AtualizaPedidoDTO,
  CriaPedidoDTO,
  PedidoDTO,
} from 'src/presentation/rest/v1/presenters/pedido/pedido.dto';

export interface IPedidoUseCase {
  listarPedidos(): Promise<PedidoDTO[] | []>;
  listarPedidosRecebido(): Promise<PedidoDTO[] | []>;
  buscarPedido(idPedido: string): Promise<PedidoDTO>;
  criarPedido(
    clienteDTO: ClienteDTO,
    criaPedidoDTO: CriaPedidoDTO,
  ): Promise<HTTPResponse<PedidoDTO>>;
  editarPedido(
    idPedido: string,
    atualizaPedidoDTO: AtualizaPedidoDTO,
  ): Promise<HTTPResponse<PedidoDTO>>;
  webhookPagamento(
    id: string,
    topic: string,
    mensagem: MensagemMercadoPagoDTO,
  ): Promise<void>;
}

export const IPedidoUseCase = Symbol('IPedidoUseCase');
