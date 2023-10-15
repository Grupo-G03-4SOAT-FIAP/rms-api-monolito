import { CategoriaModel } from '../../../adapters/outbound/models/categoria.model';
import { ListaCategoriaDTO } from 'src/adapters/inbound/rest/v1/presenters/dto/categoria/ListaCategoria.dto';
import { AtualizaCategoriaDTO } from 'src/adapters/inbound/rest/v1/presenters/dto/categoria/AtualizaCategoria.dto';
import { CriaCategoriaDTO } from 'src/adapters/inbound/rest/v1/presenters/dto/categoria/CriaCategoria.dto';

/**
 * Our domain input port
 */

export interface ICategoriaRepository {
  criaCategoria(ProdutoModel: CriaCategoriaDTO): Promise<CategoriaModel>;
  listaCategorias(): Promise<ListaCategoriaDTO[]>;
  listaCategoria(id: string): Promise<ListaCategoriaDTO>;
  atualizaCategoria(
    id: string,
    novosDados: AtualizaCategoriaDTO,
  ): Promise<CategoriaModel>;
  deletaCategoria(id: string): Promise<void>;
}

export const ICategoriaRepository = Symbol('ICategoriaRepository');
