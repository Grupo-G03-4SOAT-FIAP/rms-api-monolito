import {
  AtualizaProdutoDTO,
  CriaProdutoDTO,
  ProdutoDTO,
} from 'src/adapters/inbound/rest/v1/presenters/produto.dto';
import { HTTPResponse } from 'src/utils/HTTPResponse';

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
