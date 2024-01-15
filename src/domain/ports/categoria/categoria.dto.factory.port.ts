import { CategoriaDTO } from 'src/adapters/inbound/rest/v1/presenters/categoria.dto';
import { CategoriaModel } from 'src/adapters/outbound/models/categoria.model';

export interface ICategoriaDTOFactory {
  criarCategoriaDTO(categoria: CategoriaModel): Promise<CategoriaDTO>;
  criarListaCategoriaDTO(
    categorias: CategoriaModel[],
  ): Promise<CategoriaDTO[] | []>;
}

export const ICategoriaDTOFactory = Symbol('ICategoriaDTOFactory');
