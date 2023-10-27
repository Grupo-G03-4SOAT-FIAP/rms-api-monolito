import { CriaPedidoDTO } from 'src/adapters/inbound/rest/v1/presenters/pedido.dto';
import { ClienteEntity } from '../entities/cliente.entity';
import { PedidoEntity } from '../entities/pedido.entity';
import { ProdutoEntity } from '../entities/produto.entity';
import { IPedidoFactory } from '../ports/pedido/pedido.factory.port';
import { Inject, Injectable } from '@nestjs/common';
import { IClienteRepository } from '../ports/cliente/cliente.repository.port';
import { IProdutoRepository } from '../ports/produto/produto.repository.port';
import { StatusPedido } from 'src/utils/pedido.enum';
import { ProdutoNaoLocalizadoErro } from '../exceptions/produto.exception';

@Injectable()
export class PedidoFactory implements IPedidoFactory {
  constructor(
    @Inject(IClienteRepository)
    private readonly clienteRepository: IClienteRepository,
    @Inject(IProdutoRepository)
    private readonly produtoRepository: IProdutoRepository,
  ) {}

  async criarItemPedido(itens: string[]): Promise<ProdutoEntity[]> {
    const produtoInexistente = [];
    const itemPedido = [];
    itens.map(async (item) => {
      const buscaProduto =
        await this.produtoRepository.buscarProdutoPorId(item);
      if (buscaProduto) {
        itemPedido.push(buscaProduto);
      } else {
        produtoInexistente.push(item);
      }
    });

    if (produtoInexistente.length > 0) {
      throw new ProdutoNaoLocalizadoErro(
        `Produto informado não existe: ${produtoInexistente}`,
      );
    }
    return itemPedido;
  }

  async criarEntidadeCliente(
    cpfCliente?: string,
  ): Promise<ClienteEntity | null> {
    if (cpfCliente) {
      const buscaCliente =
        await this.clienteRepository.buscarClientePorCPF(cpfCliente);
      const { nome, email, cpf } = buscaCliente;
      const clientEntity = new ClienteEntity(nome, email, cpf);
      return clientEntity;
    }
    return null;
  }

  async criarEntidadePedido(pedido: CriaPedidoDTO): Promise<PedidoEntity> {
    const itemsPedido = await this.criarItemPedido(pedido.itemsPedido);
    const clienteEntity = await this.criarEntidadeCliente(pedido.cpfCliente);

    return new PedidoEntity(itemsPedido, StatusPedido.RECEBIDO, clienteEntity);
  }
}
