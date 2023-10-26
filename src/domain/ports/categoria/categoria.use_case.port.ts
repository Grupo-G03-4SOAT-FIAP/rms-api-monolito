import {
  AtualizaCategoriaDTO,
  CategoriaDTO,
  CriaCategoriaDTO,
} from 'src/adapters/inbound/rest/v1/presenters/categoria.dto';
import { HTTPResponse } from 'src/utils/HTTPResponse';

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
