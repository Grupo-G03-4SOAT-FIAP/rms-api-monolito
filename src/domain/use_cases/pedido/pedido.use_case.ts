import { Inject, Injectable } from '@nestjs/common';
import {
  CriaPedidoDTO,
  PedidoDTO,
  AtualizaPedidoDTO,
} from 'src/adapters/inbound/rest/v1/presenters/pedido.dto';
import { PedidoModel } from 'src/adapters/outbound/models/pedido.model';
import { PedidoNaoLocalizadoErro } from 'src/domain/exceptions/pedido.exception';
import { IPedidoFactory } from 'src/domain/ports/pedido/pedido.factory.port';
import { IPedidoRepository } from 'src/domain/ports/pedido/pedido.repository.port';
import { IPedidoUseCase } from 'src/domain/ports/pedido/pedido.use_case.port';
import { IGatewayPagamentoService } from 'src/domain/services/gatewaypag.service.port';
import { HTTPResponse } from 'src/utils/HTTPResponse';

@Injectable()
export class PedidoUseCase implements IPedidoUseCase {
  constructor(
    @Inject(IPedidoRepository)
    private readonly pedidoRepository: IPedidoRepository,
    @Inject(IPedidoFactory)
    private readonly pedidoFactory: IPedidoFactory,
    @Inject(IGatewayPagamentoService)
    private readonly gatewayPagamentoService: IGatewayPagamentoService,
  ) { }

  async criarPedido(pedido: CriaPedidoDTO): Promise<HTTPResponse<PedidoDTO>> {
    // factory para criar a entidade pedido
    const pedidoEntity = await this.pedidoFactory.criarEntidadePedido(pedido);

    // Salva o pedido no Banco de Dados
    const result = await this.pedidoRepository.criarPedido(pedidoEntity);

    pedidoEntity.id = result.id;

    // Criar o pedido no Gateway de Pagamento
    const qrData = await this.gatewayPagamentoService.criarPedido(pedidoEntity);

    const pedidoDTO = new PedidoDTO();
    pedidoDTO.id = result.id;
    pedidoDTO.numeroPedido = result.numeroPedido;
    pedidoDTO.itensPedido = result.itensPedido;
    pedidoDTO.statusPedido = result.statusPedido;
    pedidoDTO.cliente = result.cliente;
    pedidoDTO.qrCode = qrData;

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

    const buscaPedido = await this.pedidoRepository.buscarPedido(pedidoId);
    if (!buscaPedido) {
      throw new PedidoNaoLocalizadoErro('Pedido informado não existe');
    }

    const result = await this.pedidoRepository.editarStatusPedido(
      pedidoId,
      statusPedido,
    );

    const pedidoDTO = new PedidoDTO();
    pedidoDTO.id = result.id;
    pedidoDTO.numeroPedido = result.numeroPedido;
    pedidoDTO.itensPedido = result.itensPedido;
    pedidoDTO.statusPedido = result.statusPedido;
    pedidoDTO.cliente = result.cliente;

    return {
      mensagem: 'Pedido atualizado com sucesso',
      body: pedidoDTO,
    };
  }

  async buscarPedido(pedidoId: string): Promise<PedidoDTO> {
    const result = await this.pedidoRepository.buscarPedido(pedidoId);
    if (!result) {
      throw new PedidoNaoLocalizadoErro('Pedido informado não existe');
    }

    const pedidoDTO = new PedidoDTO();
    pedidoDTO.id = result.id;
    pedidoDTO.numeroPedido = result.numeroPedido;
    pedidoDTO.itensPedido = result.itensPedido;
    pedidoDTO.statusPedido = result.statusPedido;
    pedidoDTO.cliente = result.cliente;

    return pedidoDTO;
  }

  async listarPedidos(): Promise<[] | PedidoDTO[]> {
    const result = await this.pedidoRepository.listarPedidos();
    const listaPedidosDTO = result.map((pedido: PedidoModel) => {
      const pedidoDTO = new PedidoDTO();
      pedidoDTO.id = pedido.id;
      pedidoDTO.numeroPedido = pedido.numeroPedido;
      pedidoDTO.itensPedido = pedido.itensPedido;
      pedidoDTO.statusPedido = pedido.statusPedido;
      pedidoDTO.cliente = pedido.cliente;
      return pedidoDTO;
    });
    return listaPedidosDTO;
  }

  async listarPedidosRecebido(): Promise<[] | PedidoDTO[]> {
    const result = await this.pedidoRepository.listarPedidosRecebido();
    const listaPedidosDTO = result.map((pedido: PedidoModel) => {
      const pedidoDTO = new PedidoDTO();
      pedidoDTO.id = pedido.id;
      pedidoDTO.numeroPedido = pedido.numeroPedido;
      pedidoDTO.itensPedido = pedido.itensPedido;
      pedidoDTO.statusPedido = pedido.statusPedido;
      pedidoDTO.cliente = pedido.cliente;
      return pedidoDTO;
    });
    return listaPedidosDTO;
  }
}
