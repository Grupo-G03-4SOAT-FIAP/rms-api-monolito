import { ProdutoModel } from 'src/adapters/outbound/models/produto.model';
import { ProdutoEntity } from 'src/domain/entities/produto/produto.entity';

export interface IProdutoRepository {
  criarProduto(produto: ProdutoEntity): Promise<ProdutoModel>;
  editarProduto(
    produtoId: string,
    produto: ProdutoEntity,
  ): Promise<ProdutoModel>;
  excluirProduto(produtoId: string): Promise<void>;
  buscarProdutoPorId(produtoId: string): Promise<ProdutoModel | null>;
  buscarProdutoPorNome(nomeProduto: string): Promise<ProdutoModel | null>;
  listarProdutos(): Promise<ProdutoModel[] | []>;
  listarProdutosPorCategoria(categoriaId: string): Promise<ProdutoModel[] | []>;
}

export const IProdutoRepository = Symbol('IProdutoRepository');
