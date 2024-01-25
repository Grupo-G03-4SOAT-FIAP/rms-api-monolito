import { CategoriaEntity } from '../entities/categoria.entity';

export interface ICategoriaRepository {
  criarCategoria(categoria: CategoriaEntity): Promise<CategoriaEntity>;
  editarCategoria(
    categoriaId: string,
    categoria: CategoriaEntity,
  ): Promise<CategoriaEntity>;
  excluirCategoria(categoriaId: string): Promise<void>;
  buscarCategoriaPorId(categoriaId: string): Promise<CategoriaEntity | null>;
  buscarCategoriaPorNome(
    nomeCategoria: string,
  ): Promise<CategoriaEntity | null>;
  listarCategorias(): Promise<CategoriaEntity[] | []>;
}

export const ICategoriaRepository = Symbol('ICategoriaRepository');
