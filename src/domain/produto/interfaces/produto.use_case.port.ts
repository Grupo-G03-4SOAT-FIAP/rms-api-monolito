import {
  AtualizaProdutoDTO,
  CriaProdutoDTO,
  ProdutoDTO,
} from 'src/presentation/rest/v1/presenters/produto/produto.dto';
import { HTTPResponse } from 'src/application/common/HTTPResponse';

export interface IProdutoUseCase {
  listarProdutos(): Promise<ProdutoDTO[] | []>;
  listarProdutosPorCategoria(idCategoria: string): Promise<ProdutoDTO[] | []>;
  buscarProduto(idProduto: string): Promise<ProdutoDTO>;
  criarProduto(
    criaProdutoDTO: CriaProdutoDTO,
  ): Promise<HTTPResponse<ProdutoDTO>>;
  editarProduto(
    idProduto: string,
    atualizaProdutoDTO: AtualizaProdutoDTO,
  ): Promise<HTTPResponse<ProdutoDTO>>;
  excluirProduto(idProduto: string): Promise<Omit<HTTPResponse<void>, 'body'>>;
}

export const IProdutoUseCase = Symbol('IProdutoUseCase');
