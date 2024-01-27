import { Inject, Injectable } from '@nestjs/common';
import { IPedidoFactory } from '../interfaces/pedido.factory.port';
import { PedidoService } from '../services/pedido.service';
import { IClienteRepository } from 'src/domain/cliente/interfaces/cliente.repository.port';
import { IProdutoRepository } from 'src/domain/produto/interfaces/produto.repository.port';
import { CriaItemPedidoDTO } from 'src/presentation/rest/v1/presenters/pedido/item_pedido.dto';
import { ItemPedidoEntity } from '../entities/item_pedido.entity';
import { ProdutoNaoLocalizadoErro } from 'src/domain/produto/exceptions/produto.exception';
import { ClienteEntity } from 'src/domain/cliente/entities/cliente.entity';
import { ClienteNaoLocalizadoErro } from 'src/domain/cliente/exceptions/cliente.exception';
import { CriaPedidoDTO } from 'src/presentation/rest/v1/presenters/pedido/pedido.dto';
import { PedidoEntity } from '../entities/pedido.entity';
import { StatusPedido } from '../enums/pedido.enum';
import { IPedidoEntityFactory } from '../interfaces/pedido.entity.factory.port';

@Injectable()
export class PedidoFactory implements IPedidoFactory {
  constructor(
    private readonly pedidoService: PedidoService,
    @Inject(IClienteRepository)
    private readonly clienteRepository: IClienteRepository,
    @Inject(IProdutoRepository)
    private readonly produtoRepository: IProdutoRepository,
    @Inject(IPedidoEntityFactory)
    private readonly pedidoEntityFactory: IPedidoEntityFactory,
  ) {}

  async criarItemPedido(
    itens: CriaItemPedidoDTO[],
  ): Promise<ItemPedidoEntity[]> {
    const itensPedido = await Promise.all(
      itens.map(async (item) => {
        const produto = await this.produtoRepository.buscarProdutoPorId(
          item.produto,
        );
        if (!produto) {
          throw new ProdutoNaoLocalizadoErro(
            `Produto informado não existe ${item.produto}`,
          );
        }

        const itemPedidoEntity =
          this.pedidoEntityFactory.criarEntidadeItemPedido(
            produto,
            item.quantidade,
          );
        return itemPedidoEntity;
      }),
    );
    return itensPedido;
  }

  async criarEntidadeCliente(
    cpfCliente?: string,
  ): Promise<ClienteEntity | null> {
    if (cpfCliente) {
      const cliente =
        await this.clienteRepository.buscarClientePorCPF(cpfCliente);
      if (!cliente) {
        throw new ClienteNaoLocalizadoErro('Cliente informado não existe');
      }
      return cliente;
    }
    return null;
  }

  async criarEntidadePedido(pedido: CriaPedidoDTO): Promise<PedidoEntity> {
    const numeroPedido = this.pedidoService.gerarNumeroPedido();
    const itensPedido = await this.criarItemPedido(pedido.itensPedido);
    const clienteEntity = await this.criarEntidadeCliente(pedido.cpfCliente);

    const pedidoEntity = this.pedidoEntityFactory.criarEntidadePedido(
      itensPedido,
      StatusPedido.RECEBIDO,
      numeroPedido,
      false,
      clienteEntity,
    );

    return pedidoEntity;
  }
}
