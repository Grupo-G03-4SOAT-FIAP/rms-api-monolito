import { Injectable } from '@nestjs/common';
import { ICategoriaDTOFactory } from '../interfaces/categoria.dto.factory.port';
import { CategoriaModel } from 'src/infrastructure/sql/models/categoria.model';
import { CategoriaDTO } from 'src/presentation/rest/v1/presenters/categoria/categoria.dto';

@Injectable()
export class CategoriaDTOFactory implements ICategoriaDTOFactory {
  criarCategoriaDTO(categoria: CategoriaModel): CategoriaDTO {
    const categoriaDTO = new CategoriaDTO();
    categoriaDTO.id = categoria.id;
    categoriaDTO.nome = categoria.nome;
    categoriaDTO.descricao = categoria.descricao;

    return categoriaDTO;
  }

  criarListaCategoriaDTO(categorias: CategoriaModel[]): CategoriaDTO[] | [] {
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
