import {
  Body,
  Controller,
  HttpCode,
  Inject,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BadRequestError } from '../../../helpers/swagger/status-codes/bad_requests.swagger';
import { IWebhookUseCase } from 'src/domain/ports/webhook/webhook.use_case.port';
import { MensagemGatewayPagamentoDTO } from '../../presenters/gatewaypag.dto';
import { PedidoNaoLocalizadoErro } from 'src/domain/exceptions/pedido.exception';

@Controller('webhook')
@ApiTags('webhook')
export class WebhookController {
  constructor(
    @Inject(IWebhookUseCase)
    private readonly webhookUseCase: IWebhookUseCase,
  ) { }

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Consumir uma mensagem' })
  @ApiResponse({
    status: 201,
    description: 'Mensagem consumida com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
    type: BadRequestError,
  })
  async consumirMensagem(
    @Query('id') id: string,
    @Query('topic') topic: string,
    @Body() mensagem: MensagemGatewayPagamentoDTO) {
    try {
      return await this.webhookUseCase.consumirMensagem(id, topic, mensagem);
    } catch (error) {
      if (error instanceof PedidoNaoLocalizadoErro) {
        throw new PedidoNaoLocalizadoErro(error.message);
      }
      throw error;
    }
  }
}
