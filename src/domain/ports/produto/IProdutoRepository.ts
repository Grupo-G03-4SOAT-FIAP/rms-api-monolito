import { ProdutoModel } from 'src/adapters/outbound/models/produto.model';
import { ProdutoEntity } from 'src/domain/entities/produto.entity';

export interface IProdutoRepository {
  criarProduto(produto: ProdutoEntity): Promise<ProdutoModel>;
  editarProduto(
    produtoId: string,
    produto: ProdutoEntity,
  ): Promise<ProdutoModel>;
  deletarProduto(produtoId: string): Promise<void>;
  buscarProduto(produtoId: string): Promise<ProdutoModel | null>;
  listarProdutos(): Promise<ProdutoModel[] | []>;
  listarProdutosPorCategoria(categoriaId: string): Promise<ProdutoModel[] | []>;
}

export const IProdutoRepository = Symbol('IProdutoRepository');
