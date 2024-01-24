import { CategoriaModel } from "src/infrastructure/sql/models/categoria.model";
import { CategoriaEntity } from "../entities/categoria.entity";

export interface ICategoriaRepository {
  criarCategoria(categoria: CategoriaEntity): Promise<CategoriaModel>;
  editarCategoria(
    categoriaId: string,
    categoria: CategoriaEntity,
  ): Promise<CategoriaModel>;
  excluirCategoria(categoriaId: string): Promise<void>;
  buscarCategoriaPorId(categoriaId: string): Promise<CategoriaModel | null>;
  buscarCategoriaPorNome(nomeCategoria: string): Promise<CategoriaModel | null>;
  listarCategorias(): Promise<CategoriaModel[] | []>;
}

export const ICategoriaRepository = Symbol('ICategoriaRepository');
