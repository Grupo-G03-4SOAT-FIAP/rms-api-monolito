import { CategoriaEntity } from '../entities/categoria.entity';

export interface ICategoriaFactory {
  criarEntidadeCategoria(
    nome: string,
    descricao: string,
    id: string,
  ): CategoriaEntity;
}

export const ICategoriaFactory = Symbol('ICategoriaFactory');
