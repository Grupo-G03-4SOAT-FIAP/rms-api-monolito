import { Inject, Injectable } from '@nestjs/common';
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
import { HTTPResponse } from 'src/utils/HTTPResponse';

@Injectable()
export class PedidoUseCase implements IPedidoUseCase {
  constructor(
    @Inject(IPedidoRepository)
    private readonly pedidoRepository: IPedidoRepository,
    @Inject(IPedidoFactory)
    private readonly pedidoFactory: IPedidoFactory,
    @Inject(IPedidoDTOFactory)
    private readonly pedidoDTOFactory: IPedidoDTOFactory,
  ) {}

  async criarPedido(pedido: CriaPedidoDTO): Promise<HTTPResponse<PedidoDTO>> {
    const pedidoEntity = await this.pedidoFactory.criarEntidadePedido(pedido);
    const result = await this.pedidoRepository.criarPedido(pedidoEntity);
    const pedidoDTO = await this.pedidoDTOFactory.criarPedidoDTO(result);

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
    const pedidoDTO = await this.pedidoDTOFactory.criarPedidoDTO(result);

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

    const pedidoDTO = await this.pedidoDTOFactory.criarPedidoDTO(result);
    return pedidoDTO;
  }

  async listarPedidos(): Promise<[] | PedidoDTO[]> {
    const result = await this.pedidoRepository.listarPedidos();
    const listaPedidosDTO =
      await this.pedidoDTOFactory.criarListaPedidoDTO(result);
    return listaPedidosDTO;
  }

  async listarPedidosRecebido(): Promise<[] | PedidoDTO[]> {
    const result = await this.pedidoRepository.listarPedidosRecebido();
    const listaPedidosDTO =
      await this.pedidoDTOFactory.criarListaPedidoDTO(result);
    return listaPedidosDTO;
  }
}
