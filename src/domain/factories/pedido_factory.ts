import { CriaPedidoDTO } from 'src/adapters/inbound/rest/v1/presenters/pedido.dto';
import { ClienteEntity } from '../entities/cliente.entity';
import { PedidoEntity } from '../entities/pedido.entity';
import { ProdutoEntity } from '../entities/produto.entity';
import { IPedidoFactory } from '../ports/pedido/pedido.factory.port';
import { Inject, Injectable } from '@nestjs/common';
import { IClienteRepository } from '../ports/cliente/cliente.repository.port';
import { IProdutoRepository } from '../ports/produto/produto.repository.port';
import { StatusPedido } from 'src/utils/pedido.enum';

@Injectable()
export class PedidoFactory implements IPedidoFactory {
  constructor(
    @Inject(IClienteRepository)
    private readonly clienteRepository: IClienteRepository,
    @Inject(IProdutoRepository)
    private readonly produtoRepository: IProdutoRepository,
  ) {}

  async criarItemPedido(itens: string[]): Promise<ProdutoEntity[]> {
    const itemPedido = await Promise.all(
      itens.map(async (item) => {
        return this.produtoRepository.buscarProdutoPorId(item);
      }),
    );
    return itemPedido;
  }

  async criarEntidadeCliente(
    cpfCliente?: string,
  ): Promise<ClienteEntity | null> {
    if (cpfCliente) {
      const buscaCliente =
        await this.clienteRepository.buscarClientePorCPF(cpfCliente);
      const { nome, email, cpf, id } = buscaCliente;
      const clientEntity = new ClienteEntity(nome, email, cpf, id);
      return clientEntity;
    }
    return null;
  }

  async criarEntidadePedido(pedido: CriaPedidoDTO): Promise<PedidoEntity> {
    const itensPedido = await this.criarItemPedido(pedido.itensPedido);
    const clienteEntity = await this.criarEntidadeCliente(pedido.cpfCliente);

    return new PedidoEntity(itensPedido, StatusPedido.RECEBIDO, clienteEntity);
  }
}
