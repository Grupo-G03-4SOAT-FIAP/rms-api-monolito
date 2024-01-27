import { Injectable } from '@nestjs/common';
import { CategoriaEntity } from 'src/domain/categoria/entities/categoria.entity';
import { ICategoriaEntityFactory } from 'src/domain/categoria/interfaces/categoria.entity.factory.port';

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
