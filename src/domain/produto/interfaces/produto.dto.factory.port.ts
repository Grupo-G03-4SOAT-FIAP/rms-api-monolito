import { ProdutoDTO } from 'src/presentation/rest/v1/presenters/produto/produto.dto';
import { ProdutoEntity } from '../entities/produto.entity';

export interface IProdutoDTOFactory {
  criarProdutoDTO(produto: ProdutoEntity): ProdutoDTO;
  criarListaProdutoDTO(produtos: ProdutoEntity[]): ProdutoDTO[] | [];
}

export const IProdutoDTOFactory = Symbol('IProdutoDTOFactory');
