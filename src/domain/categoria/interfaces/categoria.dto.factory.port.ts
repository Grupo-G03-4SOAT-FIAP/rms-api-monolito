import { CategoriaModel } from "src/infrastructure/sql/models/categoria.model";
import { CategoriaDTO } from "src/presentation/rest/v1/presenters/categoria/categoria.dto";

export interface ICategoriaDTOFactory {
  criarCategoriaDTO(categoria: CategoriaModel): CategoriaDTO;
  criarListaCategoriaDTO(categorias: CategoriaModel[]): CategoriaDTO[] | [];
}

export const ICategoriaDTOFactory = Symbol('ICategoriaDTOFactory');
