import { Inject, Injectable } from '@nestjs/common';
import { HTTPResponse } from 'src/application/common/HTTPResponse';
import { CategoriaEntity } from 'src/domain/categoria/entities/categoria.entity';
import {
  CategoriaDuplicadaErro,
  CategoriaNaoLocalizadaErro,
} from 'src/domain/categoria/exceptions/categoria.exception';
import { ICategoriaDTOFactory } from 'src/domain/categoria/interfaces/categoria.dto.factory.port';
import { ICategoriaFactory } from 'src/domain/categoria/interfaces/categoria.factory.port';
import { ICategoriaRepository } from 'src/domain/categoria/interfaces/categoria.repository.port';
import { ICategoriaUseCase } from 'src/domain/categoria/interfaces/categoria.use_case.port';
import { CategoriaModel } from 'src/infrastructure/sql/models/categoria.model';
import {
  AtualizaCategoriaDTO,
  CategoriaDTO,
  CriaCategoriaDTO,
} from 'src/presentation/rest/v1/presenters/categoria/categoria.dto';

@Injectable()
export class CategoriaUseCase implements ICategoriaUseCase {
  constructor(
    @Inject(ICategoriaRepository)
    private readonly categoriaRepository: ICategoriaRepository,
    @Inject(ICategoriaFactory)
    private readonly categoriaFactory: ICategoriaFactory,
    @Inject(ICategoriaDTOFactory)
    private readonly categoriaDTOFactory: ICategoriaDTOFactory,
  ) {}

  private async validarCategoriaPorNome(
    nomeCategoria: string,
  ): Promise<CategoriaEntity | null> {
    const buscaCategoria =
      await this.categoriaRepository.buscarCategoriaPorNome(nomeCategoria);
    if (buscaCategoria) {
      throw new CategoriaDuplicadaErro('Existe uma categoria com esse nome');
    }
    return buscaCategoria;
  }

  private async validarCategoriaPorId(
    categoriaId: string,
  ): Promise<CategoriaEntity | null> {
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
      this.categoriaFactory.criarEntidadeCategoria(categoria);
    await this.validarCategoriaPorNome(categoriaEntity.nome);
    const categoriaModel =
      await this.categoriaRepository.criarCategoria(categoriaEntity);
    const categoriaDTO =
      this.categoriaDTOFactory.criarCategoriaDTO(categoriaModel);
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
      this.categoriaFactory.criarEntidadeCategoria(categoria);
    await this.validarCategoriaPorId(categoriaId);

    if (categoriaEntity.nome)
      await this.validarCategoriaPorNome(categoriaEntity.nome);

    const categoriaModel = await this.categoriaRepository.editarCategoria(
      categoriaId,
      categoriaEntity,
    );
    const categoriaDTO =
      this.categoriaDTOFactory.criarCategoriaDTO(categoriaModel);
    return {
      mensagem: 'Categoria atualizada com sucesso',
      body: categoriaDTO,
    };
  }

  async excluirCategoria(
    categoriaId: string,
  ): Promise<Omit<HTTPResponse<void>, 'body'>> {
    await this.validarCategoriaPorId(categoriaId);
    await this.categoriaRepository.excluirCategoria(categoriaId);
    return {
      mensagem: 'Categoria excluída com sucesso',
    };
  }

  async buscarCategoria(categoriaId: string): Promise<CategoriaDTO> {
    const categoriaModel = await this.validarCategoriaPorId(categoriaId);
    const categoriaDTO =
      this.categoriaDTOFactory.criarCategoriaDTO(categoriaModel);
    return categoriaDTO;
  }

  async listarCategorias(): Promise<CategoriaDTO[] | []> {
    const categorias = await this.categoriaRepository.listarCategorias();
    const listaCategoriasDTO =
      this.categoriaDTOFactory.criarListaCategoriaDTO(categorias);
    return listaCategoriasDTO;
  }
}
