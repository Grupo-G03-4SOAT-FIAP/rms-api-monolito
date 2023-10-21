import { CriaCategoriaDTO } from 'src/adapters/inbound/rest/v1/presenters/categoria/CriaCategoria.dto';
import { ListaCategoriaDTO } from 'src/adapters/inbound/rest/v1/presenters/categoria/ListaCategoria.dto';
import { AtualizaCategoriaDTO } from 'src/adapters/inbound/rest/v1/presenters/categoria/AtualizaCategoria.dto';

/**
 * Our domain input port
 */

export interface ICategoriaUseCase {
  criaNova(
    dadosCategoria: CriaCategoriaDTO,
  ): Promise<{ mensagem: string; categoria: any }>;
  listaTodas(): Promise<ListaCategoriaDTO[]>;
  listaUma(id: number): Promise<any>;
  atualiza(
    id: number,
    dadosCategoria: AtualizaCategoriaDTO,
  ): Promise<{ mensagem: string; categoria: any }>;
  remove(id: number): Promise<{ mensagem: string }>;
}

export const ICategoriaUseCase = Symbol('ICategoriaUseCase');
