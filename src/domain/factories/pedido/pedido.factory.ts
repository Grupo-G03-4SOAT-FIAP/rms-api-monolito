import { CriaPedidoDTO } from 'src/adapters/inbound/rest/v1/presenters/pedido.dto';
import { ClienteEntity } from '../../entities/cliente/cliente.entity';
import { PedidoEntity } from '../../entities/pedido/pedido.entity';
import { ProdutoEntity } from '../../entities/produto/produto.entity';
import { IPedidoFactory } from '../../ports/pedido/pedido.factory.port';
import { Inject, Injectable } from '@nestjs/common';
import { IClienteRepository } from '../../ports/cliente/cliente.repository.port';
import { IProdutoRepository } from '../../ports/produto/produto.repository.port';
import { StatusPedido } from 'src/utils/pedido.enum';
import { ClienteNaoLocalizadoErro } from '../../exceptions/cliente.exception';
import { ProdutoNaoLocalizadoErro } from '../../exceptions/produto.exception';
import { CategoriaEntity } from '../../entities/categoria/categoria.entity';
import { PedidoService } from '../../services/pedido.service';
import { ItemPedidoEntity } from 'src/domain/entities/pedido/item_pedido.entity';
import { CriaItemPedidoDTO } from 'src/adapters/inbound/rest/v1/presenters/item_pedido.dto';

@Injectable()
export class PedidoFactory implements IPedidoFactory {
  constructor(
    private readonly pedidoService: PedidoService,
    @Inject(IClienteRepository)
    private readonly clienteRepository: IClienteRepository,
    @Inject(IProdutoRepository)
    private readonly produtoRepository: IProdutoRepository,
  ) {}

  async criarItemPedido(
    itens: CriaItemPedidoDTO[],
  ): Promise<ItemPedidoEntity[]> {
    const itensPedido = await Promise.all(
      itens.map(async (item) => {
        const buscaProduto = await this.produtoRepository.buscarProdutoPorId(
          item.produto,
        );
        if (!buscaProduto) {
          throw new ProdutoNaoLocalizadoErro(
            `Produto informado não existe ${item.produto}`,
          );
        }

        const categoriaEntity = new CategoriaEntity(
          buscaProduto.categoria.nome,
          buscaProduto.categoria.descricao,
          buscaProduto.categoria.id,
        );

        const produtoEntity = new ProdutoEntity(
          buscaProduto.nome,
          categoriaEntity,
          buscaProduto.valorUnitario,
          buscaProduto.imagemUrl,
          buscaProduto.descricao,
          buscaProduto.id,
        );

        const itemPedidoEntity = new ItemPedidoEntity(
          produtoEntity,
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
      const buscaCliente =
        await this.clienteRepository.buscarClientePorCPF(cpfCliente);
      if (!buscaCliente) {
        throw new ClienteNaoLocalizadoErro('Cliente informado não existe');
      }
      const { nome, email, cpf, id } = buscaCliente;
      const clientEntity = new ClienteEntity(nome, email, cpf, id);
      return clientEntity;
    }
    return null;
  }

  async criarEntidadePedido(pedido: CriaPedidoDTO): Promise<PedidoEntity> {
    const numeroPedido = this.pedidoService.gerarNumeroPedido();
    const itensPedido = await this.criarItemPedido(pedido.itensPedido);
    const clienteEntity = await this.criarEntidadeCliente(pedido.cpfCliente);

    return new PedidoEntity(
      itensPedido,
      StatusPedido.RECEBIDO,
      numeroPedido,
      clienteEntity,
    );
  }
}
