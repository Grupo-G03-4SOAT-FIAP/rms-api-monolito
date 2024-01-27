import { CategoriaEntity } from '../entities/categoria.entity';

export interface ICategoriaEntityFactory {
  criarEntidadeCategoria(
    nome: string,
    descricao: string,
    id?: string,
  ): CategoriaEntity;
}

export const ICategoriaEntityFactory = Symbol('ICategoriaEntityFactory');
