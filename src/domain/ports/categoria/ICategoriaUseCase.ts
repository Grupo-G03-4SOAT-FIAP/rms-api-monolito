import { CriaCategoriaDTO } from 'src/adapters/inbound/rest/v1/presenters/dto/categoria/CriaCategoria.dto';
import { ListaCategoriaDTO } from 'src/adapters/inbound/rest/v1/presenters/dto/categoria/ListaCategoria.dto';
import { AtualizaCategoriaDTO } from 'src/adapters/inbound/rest/v1/presenters/dto/categoria/AtualizaCategoria.dto';

/**
 * Our domain input port
 */

export interface ICategoriaUseCase {
  criaNova(dadosCategoria: CriaCategoriaDTO): Promise<void>;
  listaTodas(): Promise<ListaCategoriaDTO[]>;
  atualiza(id: number, dadosCategoria: AtualizaCategoriaDTO);
  remove(id: number);
}

export const ICategoriaUseCase = Symbol('ICategoriaUseCase');
