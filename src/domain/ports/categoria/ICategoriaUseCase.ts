import { CriaCategoriaDTO } from 'src/adapters/inbound/rest/v1/presenters/dto/categoria/CriaCategoria.dto';
import { ListaCategoriaDTO } from 'src/adapters/inbound/rest/v1/presenters/dto/categoria/ListaCategoria.dto';
import { AtualizaCategoriaDTO } from 'src/adapters/inbound/rest/v1/presenters/dto/categoria/AtualizaCategoria.dto';

/**
 * Our domain input port
 */

export interface ICategoriaUseCase {
  criaNova(
    dadosCategoria: CriaCategoriaDTO,
  ): Promise<{ mensagem: string; categoria: any }>;
  listaTodas(): Promise<ListaCategoriaDTO[]>;
  listaUma(id: string): Promise<any>;
  atualiza(
    id: string,
    dadosCategoria: AtualizaCategoriaDTO,
  ): Promise<{ mensagem: string; categoria: any }>;
  remove(id: string): Promise<{ mensagem: string }>;
}

export const ICategoriaUseCase = Symbol('ICategoriaUseCase');
