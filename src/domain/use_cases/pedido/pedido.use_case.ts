import { Inject, Injectable } from '@nestjs/common';
import { ClienteDTO } from 'src/adapters/inbound/rest/v1/presenters/cliente.dto';
import {
  CriaPedidoDTO,
  PedidoDTO,
  AtualizaPedidoDTO,
} from 'src/adapters/inbound/rest/v1/presenters/pedido.dto';
import { PedidoModel } from 'src/adapters/outbound/models/pedido.model';
import { PedidoNaoLocalizadoErro } from 'src/domain/exceptions/pedido.exception';
import { IClienteRepository } from 'src/domain/ports/cliente/cliente.repository.port';
import { IPedidoFactory } from 'src/domain/ports/pedido/pedido.factory.port';
import { IPedidoRepository } from 'src/domain/ports/pedido/pedido.repository.port';
import { IPedidoUseCase } from 'src/domain/ports/pedido/pedito.use_case.port';
import { IProdutoRepository } from 'src/domain/ports/produto/produto.repository.port';
import { HTTPResponse } from 'src/utils/HTTPResponse';

@Injectable()
export class PedidoUseCase implements IPedidoUseCase {
  constructor(
    @Inject(IClienteRepository)
    private readonly clienteRepository: IClienteRepository,
    @Inject(IProdutoRepository)
    private readonly produtoRepository: IProdutoRepository,
    @Inject(IPedidoRepository)
    private readonly pedidoRepository: IPedidoRepository,
    @Inject(IPedidoFactory)
    private readonly pedidoFactory: IPedidoFactory,
  ) {}

  async criarPedido(pedido: CriaPedidoDTO): Promise<HTTPResponse<PedidoDTO>> {
    // factory para criar a entidade pedido
    const pedidoEntity = await this.pedidoFactory.criarEntidadePedido(pedido);
    const result = await this.pedidoRepository.criarPedido(pedidoEntity);

    let clienteResult: ClienteDTO | null = result.cliente;
    if (result.cliente) {
      const clienteDTO = new ClienteDTO();
      clienteDTO.id = result.cliente.id;
      clienteDTO.nome = result.cliente.nome;
      clienteDTO.email = result.cliente.email;
      clienteDTO.cpf = result.cliente.cpf;
      clienteResult = clienteDTO;
    }

    const peditoDTO = new PedidoDTO();
    peditoDTO.id = result.id;
    peditoDTO.numeroPedido = result.numeroPedido;
    peditoDTO.itensPedido = result.itensPedido;
    peditoDTO.statusPedido = result.statusPedido;
    peditoDTO.cliente = clienteResult;

    return {
      mensagem: 'Pedido criado com sucesso',
      body: peditoDTO,
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

    let clienteResult: ClienteDTO | null = result.cliente;
    if (result.cliente) {
      const clienteDTO = new ClienteDTO();
      clienteDTO.id = result.cliente.id;
      clienteDTO.nome = result.cliente.nome;
      clienteDTO.email = result.cliente.email;
      clienteDTO.cpf = result.cliente.cpf;
      clienteResult = clienteDTO;
    }

    const peditoDTO = new PedidoDTO();
    peditoDTO.id = result.id;
    peditoDTO.numeroPedido = result.numeroPedido;
    peditoDTO.itensPedido = result.itensPedido;
    peditoDTO.statusPedido = result.statusPedido;
    peditoDTO.cliente = clienteResult;

    return {
      mensagem: 'Pedido atualizado com sucesso',
      body: peditoDTO,
    };
  }

  async buscarPedido(pedidoId: string): Promise<PedidoDTO> {
    const result = await this.pedidoRepository.buscarPedido(pedidoId);
    if (!result) {
      throw new PedidoNaoLocalizadoErro('Pedido informado não existe');
    }

    let clienteResult: ClienteDTO | null = result.cliente;
    if (result.cliente) {
      const clienteDTO = new ClienteDTO();
      clienteDTO.id = result.cliente.id;
      clienteDTO.nome = result.cliente.nome;
      clienteDTO.email = result.cliente.email;
      clienteDTO.cpf = result.cliente.cpf;
      clienteResult = clienteDTO;
    }

    const peditoDTO = new PedidoDTO();
    peditoDTO.id = result.id;
    peditoDTO.numeroPedido = result.numeroPedido;
    peditoDTO.itensPedido = result.itensPedido;
    peditoDTO.statusPedido = result.statusPedido;
    peditoDTO.cliente = clienteResult;

    return peditoDTO;
  }

  async listarPedidos(): Promise<[] | PedidoDTO[]> {
    const result = await this.pedidoRepository.listarPedidos();
    const listaPedidosDTO = result.map((pedido: PedidoModel) => {
      let clienteResult: ClienteDTO | null = pedido.cliente;
      if (pedido.cliente) {
        const clienteDTO = new ClienteDTO();
        clienteDTO.id = pedido.cliente.id;
        clienteDTO.nome = pedido.cliente.nome;
        clienteDTO.email = pedido.cliente.email;
        clienteDTO.cpf = pedido.cliente.cpf;
        clienteResult = clienteDTO;
      }

      const peditoDTO = new PedidoDTO();
      peditoDTO.id = pedido.id;
      peditoDTO.numeroPedido = pedido.numeroPedido;
      peditoDTO.itensPedido = pedido.itensPedido;
      peditoDTO.statusPedido = pedido.statusPedido;
      peditoDTO.cliente = clienteResult;
      return peditoDTO;
    });
    return listaPedidosDTO;
  }

  async listarPedidosRecebido(): Promise<[] | PedidoDTO[]> {
    const result = await this.pedidoRepository.listarPedidosRecebido();
    const listaPedidosDTO = result.map((pedido: PedidoModel) => {
      let clienteResult: ClienteDTO | null = pedido.cliente;
      if (pedido.cliente) {
        const clienteDTO = new ClienteDTO();
        clienteDTO.id = pedido.cliente.id;
        clienteDTO.nome = pedido.cliente.nome;
        clienteDTO.email = pedido.cliente.email;
        clienteDTO.cpf = pedido.cliente.cpf;
        clienteResult = clienteDTO;
      }

      const peditoDTO = new PedidoDTO();
      peditoDTO.id = pedido.id;
      peditoDTO.numeroPedido = pedido.numeroPedido;
      peditoDTO.itensPedido = pedido.itensPedido;
      peditoDTO.statusPedido = pedido.statusPedido;
      peditoDTO.cliente = clienteResult;
      return peditoDTO;
    });
    return listaPedidosDTO;
  }
}
