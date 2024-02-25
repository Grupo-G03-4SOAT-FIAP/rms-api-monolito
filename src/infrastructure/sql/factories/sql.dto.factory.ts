import { Injectable } from '@nestjs/common';
import { CategoriaModel } from '../models/categoria.model';
import { CategoriaEntity } from '../../../domain/categoria/entities/categoria.entity';
import { ProdutoModel } from '../models/produto.model';
import { ProdutoEntity } from '../../../domain/produto/entities/produto.entity';
import { ClienteModel } from '../models/cliente.model';
import { ClienteEntity } from '../../../domain/cliente/entities/cliente.entity';
import { PedidoModel } from '../models/pedido.model';
import { PedidoEntity } from '../../../domain/pedido/entities/pedido.entity';
import { StatusPedido } from '../../../domain/pedido/enums/pedido.enum';
import { ItemPedidoEntity } from '../../../domain/pedido/entities/item_pedido.entity';

@Injectable()
export class SQLDTOFactory {
  criarCategoriaDTO(categoria: CategoriaModel): CategoriaEntity {
    return new CategoriaEntity(
      categoria.nome,
      categoria.descricao,
      categoria.id,
    );
  }

  criarProdutoDTO(produto: ProdutoModel): ProdutoEntity {
    const categoriaEntity = this.criarCategoriaDTO(produto.categoria);
    return new ProdutoEntity(
      produto.nome,
      categoriaEntity,
      produto.valorUnitario,
      produto.imagemUrl,
      produto.descricao,
      produto.id,
    );
  }

  criarClienteDTO(cliente: ClienteModel): ClienteEntity {
    if (!cliente) {
      return null;
    }
    return new ClienteEntity(
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
      return new ItemPedidoEntity(
        produtoEntity,
        itemPedidoModel.quantidade,
        itemPedidoModel.id,
      );
    });

    return new PedidoEntity(
      itensPedido,
      pedido.statusPedido as StatusPedido,
      pedido.numeroPedido,
      pedido.pago,
      clienteEntity,
      pedido.id,
      pedido.criadoEm,
      pedido.atualizadoEm,
    );
  }
}
