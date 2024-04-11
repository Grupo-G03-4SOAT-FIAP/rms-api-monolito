import { Injectable } from '@nestjs/common';
import { ICategoriaDTOFactory } from '../interfaces/categoria.dto.factory.port';
import { CategoriaDTO } from 'src/presentation/rest/v1/presenters/categoria/categoria.dto';
import { CategoriaEntity } from '../entities/categoria.entity';

@Injectable()
export class CategoriaDTOFactory implements ICategoriaDTOFactory {
  criarCategoriaDTO(categoria: CategoriaEntity): CategoriaDTO {
    const categoriaDTO = new CategoriaDTO();
    categoriaDTO.id = categoria.id;
    categoriaDTO.nome = categoria.nome;
    categoriaDTO.descricao = categoria.descricao;

    return categoriaDTO;
  }

  criarListaCategoriaDTO(categorias: CategoriaEntity[]): CategoriaDTO[] | [] {
    const listaCategoriasDTO = categorias.map((categoria: CategoriaEntity) => {
      const categoriaDTO = new CategoriaDTO();
      categoriaDTO.id = categoria.id;
      categoriaDTO.nome = categoria.nome;
      categoriaDTO.descricao = categoria.descricao;
      return categoriaDTO;
    });

    return listaCategoriasDTO;
  }
}
