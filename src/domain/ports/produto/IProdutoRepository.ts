import { ProdutoModel } from '../../../adapters/outbound/models/produto.model';
import { ListaProdutoDTO } from 'src/adapters/inbound/rest/v1/presenters/dto/produto/ListaProduto.dto';
import { AtualizaProdutoDTO } from 'src/adapters/inbound/rest/v1/presenters/dto/produto/AtualizaProduto.dto';

/**
 * Our domain input port
 */

export interface IProdutoRepository {
  criaProduto(ProdutoModel: ProdutoModel): Promise<void>;
  listaProdutos(): Promise<ListaProdutoDTO[]>;
  atualizaProduto(id: string, novosDados: AtualizaProdutoDTO);
  deletaProduto(id: string);
}

export const IProdutoRepository = Symbol('IProdutoRepository');
