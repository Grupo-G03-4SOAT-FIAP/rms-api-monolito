import { Inject, Injectable } from '@nestjs/common';
import {
  MensagemGatewayPagamentoDTO,
  PedidoGatewayPagamentoDTO,
} from 'src/adapters/inbound/rest/v1/presenters/gatewaypag.dto';
import {
  CriaPedidoDTO,
  PedidoDTO,
  AtualizaPedidoDTO,
} from 'src/adapters/inbound/rest/v1/presenters/pedido.dto';
import { PedidoNaoLocalizadoErro } from 'src/domain/exceptions/pedido.exception';
import { IPedidoDTOFactory } from 'src/domain/ports/pedido/pedido.dto.factory.port';
import { IPedidoFactory } from 'src/domain/ports/pedido/pedido.factory.port';
import { IPedidoRepository } from 'src/domain/ports/pedido/pedido.repository.port';
import { IPedidoUseCase } from 'src/domain/ports/pedido/pedido.use_case.port';
import { IGatewayPagamentoService } from 'src/domain/ports/pedido/gatewaypag.service.port';
import { HTTPResponse } from 'src/utils/HTTPResponse';
import { PedidoModel } from 'src/adapters/outbound/models/pedido.model';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PedidoUseCase implements IPedidoUseCase {
  constructor(
    @Inject(IPedidoRepository)
    private readonly pedidoRepository: IPedidoRepository,
    @Inject(IPedidoFactory)
    private readonly pedidoFactory: IPedidoFactory,
    @Inject(IGatewayPagamentoService)
    private readonly gatewayPagamentoService: IGatewayPagamentoService,
    private configService: ConfigService,
    @Inject(IPedidoDTOFactory)
    private readonly pedidoDTOFactory: IPedidoDTOFactory,
  ) {}

  private async validarPedidoPorId(
    pedidoId: string,
  ): Promise<PedidoModel | null> {
    const pedidoModel = await this.pedidoRepository.buscarPedido(pedidoId);
    if (!pedidoModel) {
      throw new PedidoNaoLocalizadoErro('Pedido informado não existe');
    }
    return pedidoModel;
  }

  async criarPedido(pedido: CriaPedidoDTO): Promise<HTTPResponse<PedidoDTO>> {
    const pedidoEntity = await this.pedidoFactory.criarEntidadePedido(pedido);

    const result = await this.pedidoRepository.criarPedido(pedidoEntity);
    pedidoEntity.id = result.id;

    const pedidoDTO = this.pedidoDTOFactory.criarPedidoDTO(result);

    const mercadoPagoIsEnabled = this.configService.get<string>('ENABLE_MERCADOPAGO').toLowerCase() === 'true';

    if (mercadoPagoIsEnabled) {
      const qrData = await this.gatewayPagamentoService.criarPedido(pedidoEntity);
      pedidoDTO.qrCode = qrData;
    }

    return {
      mensagem: 'Pedido criado com sucesso',
      body: pedidoDTO,
    };
  }

  async editarPedido(
    pedidoId: string,
    pedido: AtualizaPedidoDTO,
  ): Promise<HTTPResponse<PedidoDTO>> {
    const { statusPedido } = pedido;

    await this.validarPedidoPorId(pedidoId);

    const result = await this.pedidoRepository.editarStatusPedido(
      pedidoId,
      statusPedido,
    );
    const pedidoDTO = this.pedidoDTOFactory.criarPedidoDTO(result);

    return {
      mensagem: 'Pedido atualizado com sucesso',
      body: pedidoDTO,
    };
  }

  async buscarPedido(pedidoId: string): Promise<PedidoDTO> {
    const result = await this.validarPedidoPorId(pedidoId);
    const pedidoDTO = this.pedidoDTOFactory.criarPedidoDTO(result);
    return pedidoDTO;
  }

  async listarPedidos(): Promise<[] | PedidoDTO[]> {
    const result = await this.pedidoRepository.listarPedidos();
    const listaPedidosDTO = this.pedidoDTOFactory.criarListaPedidoDTO(result);
    return listaPedidosDTO;
  }

  async listarPedidosRecebido(): Promise<[] | PedidoDTO[]> {
    const result = await this.pedidoRepository.listarPedidosRecebido();
    const listaPedidosDTO = this.pedidoDTOFactory.criarListaPedidoDTO(result);
    return listaPedidosDTO;
  }

  async webhookPagamento(
    id: string,
    topic: string,
    mensagem: MensagemGatewayPagamentoDTO,
  ): Promise<any> {
    if (id && topic === 'merchant_order') {
      const pedidoGatewayPag =
        await this.gatewayPagamentoService.consultarPedido(id);
      const idInternoPedido = pedidoGatewayPag.external_reference;
      if (this.verificarPagamento(pedidoGatewayPag)) {
        const buscaPedido =
          await this.pedidoRepository.buscarPedido(idInternoPedido);
        if (!buscaPedido) {
          throw new PedidoNaoLocalizadoErro('Pedido não localizado');
        }
        await this.pedidoRepository.editarStatusPagamento(
          idInternoPedido,
          true,
        );
        await this.pedidoRepository.editarStatusPedido(
          idInternoPedido,
          'em preparacao',
        );
      }
      return {
        mensagem: `Mensagem ${mensagem} consumida com sucesso`,
      };
    }
  }

  private verificarPagamento(
    pedidoGatewayPag: PedidoGatewayPagamentoDTO,
  ): boolean {
    if (
      pedidoGatewayPag.status === 'closed' && // closed: Order with payments covering total amount.
      pedidoGatewayPag.order_status === 'paid' && // paid: Order with the sum of all payments "approved", "chargeback" or "in_mediation", covers the order total amount.
      pedidoGatewayPag.payments.every((payment) => {
        return payment.status === 'approved'; // approved: The payment has been approved and accredited.
      })
    ) {
      return true;
    }
    return false;
  }
}
