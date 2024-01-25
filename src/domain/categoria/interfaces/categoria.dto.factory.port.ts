import { CategoriaDTO } from 'src/presentation/rest/v1/presenters/categoria/categoria.dto';
import { CategoriaEntity } from '../entities/categoria.entity';

export interface ICategoriaDTOFactory {
  criarCategoriaDTO(categoria: CategoriaEntity): CategoriaDTO;
  criarListaCategoriaDTO(categorias: CategoriaEntity[]): CategoriaDTO[] | [];
}

export const ICategoriaDTOFactory = Symbol('ICategoriaDTOFactory');
