import {
  AtualizaCategoriaDTO,
  CriaCategoriaDTO,
} from 'src/adapters/inbound/rest/v1/presenters/categoria.dto';
import { CategoriaEntity } from 'src/domain/entities/categoria/categoria.entity';

export interface ICategoriaFactory {
  criarEntidadeCategoriaFromCriaCategoriaDTO(
    categoriaDTO: CriaCategoriaDTO,
  ): CategoriaEntity;
  criarEntidadeCategoriaFromAtualizaCategoriaDTO(
    categoriaDTO: AtualizaCategoriaDTO,
  ): CategoriaEntity;
}

export const ICategoriaFactory = Symbol('ICategoriaFactory');
