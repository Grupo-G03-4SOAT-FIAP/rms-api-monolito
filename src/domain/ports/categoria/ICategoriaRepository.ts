import { CategoriaModel } from '../../../adapters/outbound/models/categoria.model';
import { ListaCategoriaDTO } from 'src/adapters/inbound/rest/v1/presenters/dto/categoria/ListaCategoria.dto';
import { AtualizaCategoriaDTO } from 'src/adapters/inbound/rest/v1/presenters/dto/categoria/AtualizaCategoria.dto';

/**
 * Our domain input port
 */

export interface ICategoriaRepository {
  criaCategoria(ProdutoModel: CategoriaModel): Promise<CategoriaModel>;
  listaCategorias(): Promise<ListaCategoriaDTO[]>;
  listaCategoria(id: number): Promise<ListaCategoriaDTO>;
  atualizaCategoria(
    id: number,
    novosDados: AtualizaCategoriaDTO,
  ): Promise<CategoriaModel>;
  deletaCategoria(id: number): Promise<void>;
}

export const ICategoriaRepository = Symbol('ICategoriaRepository');
