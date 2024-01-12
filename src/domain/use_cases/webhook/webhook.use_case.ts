import { Inject, Injectable } from '@nestjs/common';
import { MensagemGatewayPagamentoDTO, PedidoGatewayPagamentoDTO } from 'src/adapters/inbound/rest/v1/presenters/gatewaypag.dto';
import { PedidoNaoLocalizadoErro } from 'src/domain/exceptions/pedido.exception';
import { IPedidoRepository } from 'src/domain/ports/pedido/pedido.repository.port';
import { IWebhookUseCase } from 'src/domain/ports/webhook/webhook.use_case.port';
import { IGatewayPagamentoService } from 'src/domain/services/gatewaypag.service.port';

@Injectable()
export class WebhookUseCase implements IWebhookUseCase {
  constructor(
    @Inject(IGatewayPagamentoService)
    private readonly gatewayPagamentoService: IGatewayPagamentoService,
    @Inject(IPedidoRepository)
    private readonly pedidoRepository: IPedidoRepository
  ) { }

  async consumirMensagem(id: string, topic: string, mensagem: MensagemGatewayPagamentoDTO): Promise<any> {
    if (id && topic === 'merchant_order') {
      const pedidoGatewayPag = await this.gatewayPagamentoService.consultarPedido(id);
      const idInternoPedido = pedidoGatewayPag.external_reference;
      if (this.verificarPagamento(pedidoGatewayPag)) {
        await this.alterarStatusPedido(idInternoPedido, "em preparacao");
      }
      return {
        mensagem: 'Mensagem consumida com sucesso'
      };
    }
  }

  private async alterarStatusPedido(idPedido, novoStatus) {
    const buscaPedido = await this.pedidoRepository.buscarPedido(idPedido);
    if (!buscaPedido) {
      throw new PedidoNaoLocalizadoErro('Pedido não localizado');
    }
    await this.pedidoRepository.editarStatusPedido(
      idPedido,
      novoStatus,
    );
  }

  private verificarPagamento(pedidoGatewayPag: PedidoGatewayPagamentoDTO): boolean {
    if (pedidoGatewayPag.order_status === 'paid' &&
      pedidoGatewayPag.payments.every((payment) => { return payment.status === 'approved'; })) {
      return true;
    }
    return false;
  }
}
