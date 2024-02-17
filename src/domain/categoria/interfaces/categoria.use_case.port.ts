import { HTTPResponse } from 'src/application/common/HTTPResponse';
import {
  AtualizaCategoriaDTO,
  CategoriaDTO,
  CriaCategoriaDTO,
} from 'src/presentation/rest/v1/presenters/categoria/categoria.dto';

export interface ICategoriaUseCase {
  listarCategorias(): Promise<CategoriaDTO[] | []>;
  buscarCategoria(idCategoria: string): Promise<CategoriaDTO>;
  criarCategoria(
    criaCategoriaDTO: CriaCategoriaDTO,
  ): Promise<HTTPResponse<CategoriaDTO>>;
  editarCategoria(
    idCategoria: string,
    atualizaCategoriaDTO: AtualizaCategoriaDTO,
  ): Promise<HTTPResponse<CategoriaDTO>>;
  excluirCategoria(
    idCategoria: string,
  ): Promise<Omit<HTTPResponse<void>, 'body'>>;
}

export const ICategoriaUseCase = Symbol('ICategoriaUseCase');
