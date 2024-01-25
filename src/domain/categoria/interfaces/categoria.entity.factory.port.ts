import { CategoriaEntity } from '../entities/categoria.entity';

export interface ICategoriaEntityFactory {
  criarCategoriaEntidade(
    nome: string,
    descricao?: string,
    id?: string,
  ): CategoriaEntity;
}
