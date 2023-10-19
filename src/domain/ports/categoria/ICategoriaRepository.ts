import { CategoriaModel } from '../../../adapters/outbound/models/categoria.model';
import { ListaCategoriaDTO } from 'src/adapters/inbound/rest/v1/presenters/categoria/ListaCategoria.dto';
import { AtualizaCategoriaDTO } from 'src/adapters/inbound/rest/v1/presenters/categoria/AtualizaCategoria.dto';

/**
 * Our domain input port
 */

export interface ICategoriaRepository {
  criaCategoria(ProdutoModel: CategoriaModel): Promise<void>;
  listaCategorias(): Promise<ListaCategoriaDTO[]>;
  atualizaCategoria(id: number, novosDados: AtualizaCategoriaDTO);
  deletaCategoria(id: number);
}

export const ICategoriaRepository = Symbol('ICategoriaRepository');
