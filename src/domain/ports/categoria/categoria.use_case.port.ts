import {
  AtualizaCategoriaDTO,
  CategoriaDTO,
  CriaCategoriaDTO,
} from 'src/adapters/inbound/rest/v1/presenters/categoria.dto';

export interface ICategoriaUseCase {
  criarCategoria(
    categoria: CriaCategoriaDTO,
  ): Promise<{ mensagem: string; categoria: CategoriaDTO }>;
  editarCategoria(
    categoriaId: string,
    categoria: AtualizaCategoriaDTO,
  ): Promise<{ mensagem: string; categoria: CategoriaDTO }>;
  excluirCategoria(categoriaId: string): Promise<{ mensagem: string }>;
  buscarCategoria(categoriaId: string): Promise<CategoriaDTO>;
  listarCategorias(): Promise<CategoriaDTO[] | []>;
}

export const ICategoriaUseCase = Symbol('ICategoriaUseCase');
