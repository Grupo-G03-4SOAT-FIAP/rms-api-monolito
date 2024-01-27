import { Injectable } from '@nestjs/common';
import { ICategoriaEntityFactory } from '../interfaces/categoria.entity.factory.port';
import { CategoriaEntity } from '../entities/categoria.entity';

@Injectable()
export class CategoriaEntityFactory implements ICategoriaEntityFactory {
  criarEntidadeCategoria(
    nome: string,
    descricao?: string,
    id?: string,
  ): CategoriaEntity {
    const categoriaEntity = new CategoriaEntity(nome, descricao, id);
    return categoriaEntity;
  }
}
