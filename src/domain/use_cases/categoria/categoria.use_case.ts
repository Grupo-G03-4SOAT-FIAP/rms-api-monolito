import { Inject, Injectable } from '@nestjs/common';
import { ICategoriaUseCase } from '../../../domain/ports/categoria/categoria.use_case.port';
import { ICategoriaRepository } from '../../../domain/ports/categoria/categoria.repository.port';
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
import { ICategoriaFactory } from '../../../domain/ports/categoria/categoria.factory.port';

@Injectable()
export class CategoriaUseCase implements ICategoriaUseCase {
  constructor(
    @Inject(ICategoriaRepository)
    private readonly categoriaRepository: ICategoriaRepository,
    @Inject(ICategoriaFactory)
    private readonly categoriaFactory: ICategoriaFactory,
  ) {}

  private async validarBuscaCategoriaPorNome(
    nomeCategoria: string,
  ): Promise<CategoriaModel | null> {
    const buscaCategoria =
      await this.categoriaRepository.buscarCategoriaPorNome(nomeCategoria);
    if (buscaCategoria) {
      throw new CategoriaDuplicadaErro('Existe uma categoria com esse nome');
    }
    return buscaCategoria;
  }

  private async validarBuscaCategoriaPorId(
    categoriaId: string,
  ): Promise<CategoriaModel | null> {
    const buscaCategoriaPorId =
      await this.categoriaRepository.buscarCategoriaPorId(categoriaId);
    if (!buscaCategoriaPorId) {
      throw new CategoriaNaoLocalizadaErro('Categoria informada não existe');
    }
    return buscaCategoriaPorId;
  }

  async criarCategoria(
    categoria: CriaCategoriaDTO,
  ): Promise<HTTPResponse<CategoriaDTO>> {
    const categoriaEntity =
      this.categoriaFactory.criarEntidadeCategoriaFromCriaCategoriaDTO(
        categoria,
      );
    await this.validarBuscaCategoriaPorNome(categoriaEntity.getNome);
    const categoriaModel =
      await this.categoriaRepository.criarCategoria(categoriaEntity);
    const categoriaDTO = this.categoriaFactory.criarCategoriaDTO(
      categoriaModel.nome,
      categoriaModel.descricao,
      categoriaModel.id,
    );

    return {
      mensagem: 'Categoria criada com sucesso',
      body: categoriaDTO,
    };
  }

  async editarCategoria(
    categoriaId: string,
    categoria: AtualizaCategoriaDTO,
  ): Promise<HTTPResponse<CategoriaDTO>> {
    const categoriaEntity =
      this.categoriaFactory.criarEntidadeCategoriaFromAtualizaCategoriaDTO(
        categoria,
      );
    await this.validarBuscaCategoriaPorId(categoriaId);
    await this.validarBuscaCategoriaPorNome(categoriaEntity.getNome);
    const categoriaModel = await this.categoriaRepository.editarCategoria(
      categoriaId,
      categoriaEntity,
    );
    const categoriaDTO = this.categoriaFactory.criarCategoriaDTO(
      categoriaModel.nome,
      categoriaModel.descricao,
      categoriaModel.id,
    );
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
