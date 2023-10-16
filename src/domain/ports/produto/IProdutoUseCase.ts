import { CriaProdutoDTO } from 'src/adapters/inbound/rest/v1/presenters/dto/produto/CriaProduto.dto';
import { ListaProdutoDTO } from 'src/adapters/inbound/rest/v1/presenters/dto/produto/ListaProduto.dto';
import { AtualizaProdutoDTO } from 'src/adapters/inbound/rest/v1/presenters/dto/produto/AtualizaProduto.dto';

/**
 * Our domain input port
 */

export interface IProdutoUseCase {
  criaNovo(dadosProduto: CriaProdutoDTO): Promise<void>;
  listaTodos(): Promise<ListaProdutoDTO[]>;
  listaPorCategoria(categoriaId: string): Promise<ListaProdutoDTO[]>;
  atualiza(id: string, dadosProduto: AtualizaProdutoDTO);
  remove(id: string);
}

export const IProdutoUseCase = Symbol('IProdutoUseCase');
