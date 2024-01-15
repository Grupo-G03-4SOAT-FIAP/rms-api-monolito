import { ProdutoDTO } from 'src/adapters/inbound/rest/v1/presenters/produto.dto';
import { ProdutoModel } from 'src/adapters/outbound/models/produto.model';

export interface IProdutoDTOFactory {
  criarProdutoDTO(produto: ProdutoModel): Promise<ProdutoDTO>;
  criarListaProdutoDTO(produtos: ProdutoModel[]): Promise<ProdutoDTO[] | []>;
}

export const IProdutoDTOFactory = Symbol('IProdutoDTOFactory');
