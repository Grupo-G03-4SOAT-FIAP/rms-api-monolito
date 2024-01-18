import { Injectable } from '@nestjs/common';
import { CategoriaDTO } from 'src/adapters/inbound/rest/v1/presenters/categoria.dto';
import { CategoriaModel } from 'src/adapters/outbound/models/categoria.model';
import { ICategoriaDTOFactory } from 'src/domain/ports/categoria/categoria.dto.factory.port';

@Injectable()
export class CategoriaDTOFactory implements ICategoriaDTOFactory {
  criarCategoriaDTO(categoria: CategoriaModel): CategoriaDTO {
    const categoriaDTO = new CategoriaDTO();
    categoriaDTO.id = categoria.id;
    categoriaDTO.nome = categoria.nome;
    categoriaDTO.descricao = categoria.descricao;

    return categoriaDTO;
  }

  async criarListaCategoriaDTO(
    categorias: CategoriaModel[],
  ): Promise<[] | CategoriaDTO[]> {
    const listaCategoriasDTO = categorias.map((categoria: CategoriaModel) => {
      const categoriaDTO = new CategoriaDTO();
      categoriaDTO.id = categoria.id;
      categoriaDTO.nome = categoria.nome;
      categoriaDTO.descricao = categoria.descricao;
      return categoriaDTO;
    });

    return listaCategoriasDTO;
  }
}
