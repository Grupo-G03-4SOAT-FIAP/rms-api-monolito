import { Injectable } from '@nestjs/common';
import { CriaCategoriaDTO } from 'src/adapters/inbound/rest/v1/presenters/categoria.dto';
import { CategoriaEntity } from 'src/domain/entities/categoria/categoria.entity';
import { ICategoriaFactory } from 'src/domain/ports/categoria/categoria.factory.port';

@Injectable()
export class CategoriaFactory implements ICategoriaFactory {
  criarEntidadeCategoriaFromCriaCategoriaDTO(
    categoriaDTO: CriaCategoriaDTO,
  ): CategoriaEntity {
    const categoriaEntity = new CategoriaEntity(
      categoriaDTO.nome,
      categoriaDTO.descricao,
    );
    return categoriaEntity;
  }
}
