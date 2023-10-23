import {
  AtualizaProdutoDTO,
  CriaProdutoDTO,
  ProdutoDTO,
} from 'src/adapters/inbound/rest/v1/presenters/produto.dto';

export interface IProdutoUseCase {
  criarProduto(
    produto: CriaProdutoDTO,
  ): Promise<{ mensagem: string; produto: ProdutoDTO }>;
  editarProduto(
    produtoId: string,
    produto: AtualizaProdutoDTO,
  ): Promise<{ mensagem: string; produto: ProdutoDTO }>;
  excluirProduto(produtoId: string): Promise<{ mensagem: string }>;
  buscarProduto(produtoId: string): Promise<ProdutoDTO>;
  listarProdutos(): Promise<ProdutoDTO[] | []>;
  listarProdutosPorCategoria(categoriaId: string): Promise<ProdutoDTO[] | []>;
}

export const IProdutoUseCase = Symbol('IProdutoUseCase');
