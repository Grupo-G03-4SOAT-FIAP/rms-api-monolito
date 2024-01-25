import { Injectable } from '@nestjs/common';
import { ICategoriaFactory } from '../interfaces/categoria.factory.port';
import { CategoriaEntity } from '../entities/categoria.entity';

@Injectable()
export class CategoriaFactory implements ICategoriaFactory {
  criarEntidadeCategoria(
    nome: string,
    descricao: string,
    id?: string,
  ): CategoriaEntity {
    const categoriaEntity = new CategoriaEntity(nome, descricao, id);
    return categoriaEntity;
  }
}
