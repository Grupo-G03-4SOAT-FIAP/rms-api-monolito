import { CategoriaEntity } from "../entities/categoria.entity";
import { AtualizaCategoriaDTO, CriaCategoriaDTO } from "src/presentation/rest/v1/presenters/categoria/categoria.dto";

export interface ICategoriaFactory {
  criarEntidadeCategoria(
    categoriaDTO: CriaCategoriaDTO | AtualizaCategoriaDTO,
  ): CategoriaEntity;
}

export const ICategoriaFactory = Symbol('ICategoriaFactory');
