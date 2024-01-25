import { CategoriaEntity } from '../entities/categoria.entity';
import { ICategoriaEntityFactory } from '../interfaces/categoria.entity.factory.port';

export class CategoriaEntityFactory implements ICategoriaEntityFactory {
  criarCategoriaEntidade(
    nome: string,
    descricao?: string,
    id?: string,
  ): CategoriaEntity {
    const categoriaEntity = new CategoriaEntity(nome, descricao, id);
    return categoriaEntity;
  }
}
