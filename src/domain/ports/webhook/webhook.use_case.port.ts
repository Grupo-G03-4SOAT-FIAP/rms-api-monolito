import { MensagemGatewayPagamentoDTO } from 'src/adapters/inbound/rest/v1/presenters/gatewaypag.dto';

export interface IWebhookUseCase {
  consumirMensagem(id: string, topic: string, mensagem: MensagemGatewayPagamentoDTO): Promise<void>;
}

export const IWebhookUseCase = Symbol('IWebhookUseCase');
