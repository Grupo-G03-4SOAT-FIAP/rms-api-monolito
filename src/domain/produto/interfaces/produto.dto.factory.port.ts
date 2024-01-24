import { ProdutoModel } from "src/infrastructure/sql/models/produto.model";
import { ProdutoDTO } from "src/presentation/rest/v1/presenters/produto/produto.dto";

export interface IProdutoDTOFactory {
  criarProdutoDTO(produto: ProdutoModel): ProdutoDTO;
  criarListaProdutoDTO(produtos: ProdutoModel[]): ProdutoDTO[] | [];
}

export const IProdutoDTOFactory = Symbol('IProdutoDTOFactory');
