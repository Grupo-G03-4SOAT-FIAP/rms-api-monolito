import { AtualizaProdutoDTO, CriaProdutoDTO, ProdutoDTO } from "src/presentation/rest/v1/presenters/produto/produto.dto";
import { HTTPResponse } from "src/application/common/HTTPResponse";

export interface IProdutoUseCase {
  criarProduto(produto: CriaProdutoDTO): Promise<HTTPResponse<ProdutoDTO>>;
  editarProduto(
    produtoId: string,
    produto: AtualizaProdutoDTO,
  ): Promise<HTTPResponse<ProdutoDTO>>;
  excluirProduto(produtoId: string): Promise<Omit<HTTPResponse<void>, 'body'>>;
  buscarProduto(produtoId: string): Promise<ProdutoDTO>;
  listarProdutos(): Promise<ProdutoDTO[] | []>;
  listarProdutosPorCategoria(categoriaId: string): Promise<ProdutoDTO[] | []>;
}

export const IProdutoUseCase = Symbol('IProdutoUseCase');
