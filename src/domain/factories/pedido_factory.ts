import { PedidoDTO } from 'src/adapters/inbound/rest/v1/presenters/pedido.dto';
import { ClienteEntity } from '../entities/cliente.entity';
import { PedidoEntity } from '../entities/pedido.entity';
import { ProdutoEntity } from '../entities/produto.entity';
import { IPedidoFactory } from '../ports/pedido/pedido.factory.port';
import { Injectable } from '@nestjs/common';
import { IClienteRepository } from '../ports/cliente/cliente.repository.port';
import { IProdutoRepository } from '../ports/produto/produto.repository.port';

@Injectable()
export class PedidoFactory implements IPedidoFactory {
  constructor(
    private readonly clienteRepository: IClienteRepository,
    private readonly produtoRepository: IProdutoRepository,
  ) {}

  async criarItemPedido(item: object[]): Promise<ProdutoEntity[]> {
    throw new Error('Method not implemented.');
  }

  async criarEntidadeCliente(cpfCliente: string): Promise<ClienteEntity> {
    throw new Error('Method not implemented.');
  }

  async criarEntidadePedido(pedido: PedidoDTO): Promise<PedidoEntity> {
    throw new Error('Method not implemented.');
  }
}
