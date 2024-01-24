import { Injectable } from '@nestjs/common';
import { ICategoriaFactory } from '../interfaces/categoria.factory.port';
import { AtualizaCategoriaDTO, CriaCategoriaDTO } from 'src/presentation/rest/v1/presenters/categoria/categoria.dto';
import { CategoriaEntity } from '../entities/categoria.entity';

@Injectable()
export class CategoriaFactory implements ICategoriaFactory {
  criarEntidadeCategoria(
    categoriaDTO: CriaCategoriaDTO | AtualizaCategoriaDTO,
  ): CategoriaEntity {
    const categoriaEntity = new CategoriaEntity(
      categoriaDTO.nome,
      categoriaDTO.descricao,
    );
    return categoriaEntity;
  }
}
