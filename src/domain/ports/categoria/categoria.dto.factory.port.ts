import { CategoriaDTO } from 'src/adapters/inbound/rest/v1/presenters/categoria.dto';
import { CategoriaModel } from 'src/adapters/outbound/models/categoria.model';

export interface ICategoriaDTOFactory {
  criarCategoriaDTO(categoria: CategoriaModel): CategoriaDTO;
  criarListaCategoriaDTO(categorias: CategoriaModel[]): CategoriaDTO[] | [];
}

export const ICategoriaDTOFactory = Symbol('ICategoriaDTOFactory');
