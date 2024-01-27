import { Inject, Injectable } from '@nestjs/common';
import { CategoriaModel } from '../models/categoria.model';
import { CategoriaEntity } from 'src/domain/categoria/entities/categoria.entity';
import { ICategoriaEntityFactory } from 'src/domain/categoria/interfaces/categoria.entity.factory.port';
import { IProdutoEntityFactory } from 'src/domain/produto/interfaces/produto.entity.factory.port';
import { ProdutoModel } from '../models/produto.model';
import { ProdutoEntity } from 'src/domain/produto/entities/produto.entity';
import { IClienteEntityFactory } from 'src/domain/cliente/interfaces/cliente.entity.factory.port';
import { ClienteModel } from '../models/cliente.model';
import { ClienteEntity } from 'src/domain/cliente/entities/cliente.entity';
import { PedidoModel } from '../models/pedido.model';
import { PedidoEntity } from 'src/domain/pedido/entities/pedido.entity';
import { StatusPedido } from 'src/domain/pedido/enums/pedido.enum';
import { IPedidoEntityFactory } from 'src/domain/pedido/interfaces/pedido.entity.factory.port';

@Injectable()
export class RepositoryDTO {
  constructor(
    @Inject(ICategoriaEntityFactory)
    private readonly categoriaEntityFactory: ICategoriaEntityFactory,
    @Inject(IProdutoEntityFactory)
    private readonly produtoEntityFactory: IProdutoEntityFactory,
    @Inject(IClienteEntityFactory)
    private readonly clienteEntityFactory: IClienteEntityFactory,
    @Inject(IPedidoEntityFactory)
    private readonly pedidoEntityFactory: IPedidoEntityFactory,
  ) {}

  criarCategoriaDTO(categoria: CategoriaModel): CategoriaEntity {
    return this.categoriaEntityFactory.criarEntidadeCategoria(
      categoria.nome,
      categoria.descricao,
      categoria.id,
    );
  }

  criarProdutoDTO(produto: ProdutoModel): ProdutoEntity {
    const categoriaEntity = this.criarCategoriaDTO(produto.categoria);
    return this.produtoEntityFactory.criarEntidadeProduto(
      produto.nome,
      categoriaEntity,
      produto.valorUnitario,
      produto.imagemUrl,
      produto.descricao,
      produto.id,
    );
  }

  criarClienteDTO(cliente: ClienteModel): ClienteEntity {
    return this.clienteEntityFactory.criarEntidadeCliente(
      cliente.nome,
      cliente.email,
      cliente.cpf,
      cliente.id,
    );
  }

  criarPedidoDTO(pedido: PedidoModel): PedidoEntity {
    const clienteEntity = this.criarClienteDTO(pedido.cliente);

    const itensPedido = pedido.itensPedido.map((itemPedidoModel) => {
      const produtoEntity = this.criarProdutoDTO(itemPedidoModel.produto);
      return this.pedidoEntityFactory.criarEntidadeItemPedido(
        produtoEntity,
        itemPedidoModel.quantidade,
        itemPedidoModel.id,
      );
    });

    return this.pedidoEntityFactory.criarEntidadePedido(
      itensPedido,
      StatusPedido[pedido.statusPedido],
      pedido.numeroPedido,
      pedido.pago,
      clienteEntity,
      pedido.id,
    );
  }
}
