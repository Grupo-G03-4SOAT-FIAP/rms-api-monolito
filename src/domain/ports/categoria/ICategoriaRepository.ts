import { CategoriaModel } from '../../../adapters/outbound/models/categoria.model';
import { CategoriaEntity } from 'src/domain/entities/categoria.entity';

export interface ICategoriaRepository {
  criarCategoria(categoria: CategoriaEntity): Promise<CategoriaModel>;
  editarCategoria(
    categoriaId: string,
    categoria: CategoriaEntity,
  ): Promise<CategoriaModel>;
  deletarCategoria(categoriaId: string): Promise<void>;
  buscarCategoria(categoriaId: string): Promise<CategoriaModel | null>;
  listarCategorias(): Promise<CategoriaModel[] | []>;
}

export const ICategoriaRepository = Symbol('ICategoriaRepository');
