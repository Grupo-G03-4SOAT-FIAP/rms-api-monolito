import { HTTPResponse } from 'src/application/common/HTTPResponse';
import {
  AtualizaCategoriaDTO,
  CategoriaDTO,
  CriaCategoriaDTO,
} from 'src/presentation/rest/v1/presenters/categoria/categoria.dto';

export interface ICategoriaUseCase {
  criarCategoria(
    categoria: CriaCategoriaDTO,
  ): Promise<HTTPResponse<CategoriaDTO>>;
  editarCategoria(
    categoriaId: string,
    categoria: AtualizaCategoriaDTO,
  ): Promise<HTTPResponse<CategoriaDTO>>;
  excluirCategoria(
    categoriaId: string,
  ): Promise<Omit<HTTPResponse<void>, 'body'>>;
  buscarCategoria(categoriaId: string): Promise<CategoriaDTO>;
  listarCategorias(): Promise<CategoriaDTO[] | []>;
}

export const ICategoriaUseCase = Symbol('ICategoriaUseCase');
