import { CategoriaModel } from '../../../adapters/outbound/models/categoria.model';
import { ListaCategoriaDTO } from 'src/adapters/inbound/rest/v1/presenters/dto/categoria/ListaCategoria.dto';
import { AtualizaCategoriaDTO } from 'src/adapters/inbound/rest/v1/presenters/dto/categoria/AtualizaCategoria.dto';
import { Categoria } from 'src/domain/entities/Categoria';

/**
 * Our domain input port
 */

export interface ICategoriaRepository {
  criaCategoria(categoria: Categoria): Promise<CategoriaModel>;
  listaCategorias(): Promise<ListaCategoriaDTO[]>;
  listaCategoria(id: number): Promise<ListaCategoriaDTO>;
  atualizaCategoria(
    id: number,
    novosDados: AtualizaCategoriaDTO,
  ): Promise<CategoriaModel>;
  deletaCategoria(id: number): Promise<void>;
}

export const ICategoriaRepository = Symbol('ICategoriaRepository');
