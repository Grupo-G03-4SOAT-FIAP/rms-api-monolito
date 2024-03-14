import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HTTPResponse } from '../../../application/common/HTTPResponse';
import { PedidoEntity } from '../../../domain/pedido/entities/pedido.entity';
import { PedidoNaoLocalizadoErro } from '../../../domain/pedido/exceptions/pedido.exception';
import { IGatewayPagamentoService } from '../../../domain/pedido/interfaces/gatewaypag.service.port';
import { IPedidoDTOFactory } from '../../../domain/pedido/interfaces/pedido.dto.factory.port';
import { IPedidoFactory } from '../../../domain/pedido/interfaces/pedido.factory.port';
import { IPedidoRepository } from '../../../domain/pedido/interfaces/pedido.repository.port';
import { IPedidoUseCase } from '../../../domain/pedido/interfaces/pedido.use_case.port';
import { ClienteEntity } from '../../../../src/domain/cliente/entities/cliente.entity';
import { IClienteRepository } from '../../../../src/domain/cliente/interfaces/cliente.repository.port';
import { ClienteDTO } from '../../../../src/presentation/rest/v1/presenters/cliente/cliente.dto';
import {
  MensagemMercadoPagoDTO,
  PedidoGatewayPagamentoDTO,
} from 'src/presentation/rest/v1/presenters/pedido/gatewaypag.dto';
import {
  AtualizaPedidoDTO,
  CriaPedidoDTO,
  PedidoDTO,
} from 'src/presentation/rest/v1/presenters/pedido/pedido.dto';

@Injectable()
export class PedidoUseCase implements IPedidoUseCase {
  constructor(
    @Inject(IPedidoRepository)
    private readonly pedidoRepository: IPedidoRepository,
    @Inject(IClienteRepository)
    private readonly clienteRepository: IClienteRepository,
    @Inject(IPedidoFactory)
    private readonly pedidoFactory: IPedidoFactory,
    @Inject(IGatewayPagamentoService)
    private readonly gatewayPagamentoService: IGatewayPagamentoService,
    @Inject(IPedidoDTOFactory)
    private readonly pedidoDTOFactory: IPedidoDTOFactory,
    private configService: ConfigService,
  ) {}

  async listarPedidos(): Promise<[] | PedidoDTO[]> {
    const listaPedidos = await this.pedidoRepository.listarPedidos();
    const listaPedidosDTO =
      this.pedidoDTOFactory.criarListaPedidoDTO(listaPedidos);
    return listaPedidosDTO;
  }
  async listarPedidosRecebido(): Promise<[] | PedidoDTO[]> {
    const listaPedidosRecebidos =
      await this.pedidoRepository.listarPedidosRecebido();
    const listaPedidosDTO = this.pedidoDTOFactory.criarListaPedidoDTO(
      listaPedidosRecebidos,
    );
    return listaPedidosDTO;
  }

  async buscarPedido(idPedido: string): Promise<PedidoDTO> {
    const pedidoEncontrado = await this.validarPedidoPorId(idPedido);
    const pedidoDTO = this.pedidoDTOFactory.criarPedidoDTO(pedidoEncontrado);
    return pedidoDTO;
  }

  async criarPedido(
    clienteDTO: ClienteDTO,
    criaPedidoDTO: CriaPedidoDTO,
  ): Promise<HTTPResponse<PedidoDTO>> {
    const pedido = await this.pedidoFactory.criarEntidadePedido(criaPedidoDTO);
    const cliente = await this.pedidoFactory.criarEntidadeCliente(clienteDTO);
    const clienteCriadoOuAtualizado =
      await this.criarOuAtualizarCliente(cliente);
    pedido.cliente = clienteCriadoOuAtualizado;
    pedido.clientePedido = this.copiarDadosCliente(clienteCriadoOuAtualizado);
    const pedidoCriado = await this.pedidoRepository.criarPedido(pedido);
    const pedidoDTO = this.pedidoDTOFactory.criarPedidoDTO(pedidoCriado);
    if (this.mercadoPagoIsEnabled()) {
      const qrData =
        await this.gatewayPagamentoService.criarPedido(pedidoCriado);
      pedidoDTO.qrCode = qrData;
    }
    return {
      mensagem: 'Pedido criado com sucesso',
      body: pedidoDTO,
    };
  }

  private copiarDadosCliente(
    clienteOrigem: ClienteEntity,
  ): ClienteEntity | null {
    const clienteCopia = new ClienteEntity(
      clienteOrigem.nome,
      clienteOrigem.email,
      clienteOrigem.cpf,
    );
    return clienteCopia;
  }

  private async criarOuAtualizarCliente(
    cliente: ClienteEntity,
  ): Promise<ClienteEntity | null> {
    const clienteAntigoEncontrado =
      await this.clienteRepository.buscarClientePorCPF(cliente.cpf);
    let clienteCriadoOuAtualizado;
    if (clienteAntigoEncontrado) {
      clienteCriadoOuAtualizado = await this.clienteRepository.editarCliente(
        clienteAntigoEncontrado.id,
        cliente,
      );
    } else {
      clienteCriadoOuAtualizado =
        await this.clienteRepository.criarCliente(cliente);
    }
    return clienteCriadoOuAtualizado;
  }

  async editarPedido(
    idPedido: string,
    atualizaPedidoDTO: AtualizaPedidoDTO,
  ): Promise<HTTPResponse<PedidoDTO>> {
    await this.validarPedidoPorId(idPedido);
    const pedidoEditado = await this.pedidoRepository.editarStatusPedido(
      idPedido,
      atualizaPedidoDTO.statusPedido,
    );
    const pedidoDTO = this.pedidoDTOFactory.criarPedidoDTO(pedidoEditado);
    return {
      mensagem: 'Pedido atualizado com sucesso',
      body: pedidoDTO,
    };
  }

  async webhookPagamento(
    id: string,
    topic: string,
    mensagem: MensagemMercadoPagoDTO,
  ): Promise<any> {
    if (id && topic === 'merchant_order') {
      console.log(mensagem);
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
        mensagem: 'Mensagem consumida com sucesso',
      };
    }
  }

  private async validarPedidoPorId(
    idPedido: string,
  ): Promise<PedidoEntity | null> {
    const pedidoEncontrado = await this.pedidoRepository.buscarPedido(idPedido);
    if (!pedidoEncontrado) {
      throw new PedidoNaoLocalizadoErro('Pedido informado não existe');
    }
    return pedidoEncontrado;
  }

  private mercadoPagoIsEnabled(): boolean {
    return (
      this.configService.get<string>('ENABLE_MERCADOPAGO')?.toLowerCase() ===
      'true'
    );
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
