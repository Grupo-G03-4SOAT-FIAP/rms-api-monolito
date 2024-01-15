import { Inject, Injectable } from '@nestjs/common';
import { ICategoriaUseCase } from '../../../domain/ports/categoria/categoria.use_case.port';
import { ICategoriaRepository } from '../../../domain/ports/categoria/categoria.repository.port';
import { CategoriaEntity } from '../../entities/categoria/categoria.entity';
import {
  AtualizaCategoriaDTO,
  CategoriaDTO,
  CriaCategoriaDTO,
} from '../../../adapters/inbound/rest/v1/presenters/categoria.dto';
import { CategoriaModel } from '../../../adapters/outbound/models/categoria.model';
import {
  CategoriaNaoLocalizadaErro,
  CategoriaDuplicadaErro,
} from '../../../domain/exceptions/categoria.exception';
import { HTTPResponse } from '../../../utils/HTTPResponse';

@Injectable()
export class CategoriaUseCase implements ICategoriaUseCase {
  constructor(
    @Inject(ICategoriaRepository)
    private readonly categoriaRepository: ICategoriaRepository,
  ) {}

  async criarCategoria(
    categoria: CriaCategoriaDTO,
  ): Promise<HTTPResponse<CategoriaDTO>> {
    const categoriaEntity = new CategoriaEntity(
      categoria.nome,
      categoria.descricao,
    );
    const buscaCategoria =
      await this.categoriaRepository.buscarCategoriaPorNome(
        categoriaEntity.nome,
      );
    if (buscaCategoria) {
      throw new CategoriaDuplicadaErro('Existe uma categoria com esse nome');
    }

    const result =
      await this.categoriaRepository.criarCategoria(categoriaEntity);

    const categoriaDTO = new CategoriaDTO();
    categoriaDTO.id = result.id;
    categoriaDTO.nome = result.nome;
    categoriaDTO.descricao = result.descricao;

    return {
      mensagem: 'Categoria criada com sucesso',
      body: categoriaDTO,
    };
  }

  async editarCategoria(
    categoriaId: string,
    categoria: AtualizaCategoriaDTO,
  ): Promise<HTTPResponse<CategoriaDTO>> {
    const categoriaEntity = new CategoriaEntity(
      categoria.nome,
      categoria.descricao,
    );
    const buscaCategoriaPorId =
      await this.categoriaRepository.buscarCategoriaPorId(categoriaId);
    if (!buscaCategoriaPorId) {
      throw new CategoriaNaoLocalizadaErro('Categoria informada não existe');
    }

    if (categoriaEntity.nome) {
      const buscaCategoriaPorNome =
        await this.categoriaRepository.buscarCategoriaPorNome(
          categoriaEntity.nome,
        );
      if (buscaCategoriaPorNome) {
        throw new CategoriaDuplicadaErro('Existe uma categoria com esse nome');
      }
    }

    const result = await this.categoriaRepository.editarCategoria(
      categoriaId,
      categoriaEntity,
    );

    const categoriaDTO = new CategoriaDTO();
    categoriaDTO.id = result.id;
    categoriaDTO.nome = result.nome;
    categoriaDTO.descricao = result.descricao;

    return {
      mensagem: 'Categoria atualizada com sucesso',
      body: categoriaDTO,
    };
  }

  async excluirCategoria(
    categoriaId: string,
  ): Promise<Omit<HTTPResponse<void>, 'body'>> {
    const buscaCategoria =
      await this.categoriaRepository.buscarCategoriaPorId(categoriaId);
    if (!buscaCategoria) {
      throw new CategoriaNaoLocalizadaErro('Categoria informada não existe');
    }

    await this.categoriaRepository.excluirCategoria(categoriaId);
    return {
      mensagem: 'Categoria excluida com sucesso',
    };
  }

  async buscarCategoria(categoriaId: string): Promise<CategoriaDTO> {
    const result =
      await this.categoriaRepository.buscarCategoriaPorId(categoriaId);
    if (!result) {
      throw new CategoriaNaoLocalizadaErro('Categoria informada não existe');
    }

    const categoriaDTO = new CategoriaDTO();
    categoriaDTO.id = result.id;
    categoriaDTO.nome = result.nome;
    categoriaDTO.descricao = result.descricao;

    return categoriaDTO;
  }

  async listarCategorias(): Promise<CategoriaDTO[] | []> {
    const result = await this.categoriaRepository.listarCategorias();
    const listaCategoriasDTO = result.map((categoria: CategoriaModel) => {
      const categoriaDTO = new CategoriaDTO();
      categoriaDTO.id = categoria.id;
      categoriaDTO.nome = categoria.nome;
      categoriaDTO.descricao = categoria.descricao;
      return categoriaDTO;
    });

    return listaCategoriasDTO;
  }
}
