import { Inject, Injectable } from '@nestjs/common';
import { HTTPResponse } from 'src/application/common/HTTPResponse';
import { CategoriaEntity } from 'src/domain/categoria/entities/categoria.entity';
import {
  CategoriaDuplicadaErro,
  CategoriaNaoLocalizadaErro,
} from 'src/domain/categoria/exceptions/categoria.exception';
import { ICategoriaDTOFactory } from 'src/domain/categoria/interfaces/categoria.dto.factory.port';
import { ICategoriaRepository } from 'src/domain/categoria/interfaces/categoria.repository.port';
import { ICategoriaUseCase } from 'src/domain/categoria/interfaces/categoria.use_case.port';
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
    @Inject(ICategoriaDTOFactory)
    private readonly categoriaDTOFactory: ICategoriaDTOFactory,
  ) {}

  async listarCategorias(): Promise<CategoriaDTO[] | []> {
    const categorias = await this.categoriaRepository.listarCategorias();
    const listaCategoriasDTO =
      this.categoriaDTOFactory.criarListaCategoriaDTO(categorias);
    return listaCategoriasDTO;
  }

  async buscarCategoria(idCategoria: string): Promise<CategoriaDTO> {
    const categoriaEncontrada = await this.validarCategoriaPorId(idCategoria);
    const categoriaDTO =
      this.categoriaDTOFactory.criarCategoriaDTO(categoriaEncontrada);
    return categoriaDTO;
  }

  async criarCategoria(
    criaCategoriaDTO: CriaCategoriaDTO,
  ): Promise<HTTPResponse<CategoriaDTO>> {
    const categoria = new CategoriaEntity(
      criaCategoriaDTO.nome,
      criaCategoriaDTO.descricao,
    );
    await this.validarCategoriaPorNome(categoria.nome);
    const categoriaCriada =
      await this.categoriaRepository.criarCategoria(categoria);
    const categoriaDTO =
      this.categoriaDTOFactory.criarCategoriaDTO(categoriaCriada);
    return {
      mensagem: 'Categoria criada com sucesso',
      body: categoriaDTO,
    };
  }

  async editarCategoria(
    idCategoria: string,
    atualizaCategoriaDTO: AtualizaCategoriaDTO,
  ): Promise<HTTPResponse<CategoriaDTO>> {
    const categoria = new CategoriaEntity(
      atualizaCategoriaDTO.nome,
      atualizaCategoriaDTO.descricao,
    );
    await this.validarCategoriaPorId(idCategoria);
    if (categoria.nome) await this.validarCategoriaPorNome(categoria.nome);
    const categoriaEditada = await this.categoriaRepository.editarCategoria(
      idCategoria,
      categoria,
    );
    const categoriaDTO =
      this.categoriaDTOFactory.criarCategoriaDTO(categoriaEditada);
    return {
      mensagem: 'Categoria atualizada com sucesso',
      body: categoriaDTO,
    };
  }

  async excluirCategoria(
    idCategoria: string,
  ): Promise<Omit<HTTPResponse<void>, 'body'>> {
    await this.validarCategoriaPorId(idCategoria);
    await this.categoriaRepository.excluirCategoria(idCategoria);
    return {
      mensagem: 'Categoria excluída com sucesso',
    };
  }

  private async validarCategoriaPorNome(
    nomeCategoria: string,
  ): Promise<CategoriaEntity | null> {
    const categoriaEncontrada =
      await this.categoriaRepository.buscarCategoriaPorNome(nomeCategoria);
    if (categoriaEncontrada) {
      throw new CategoriaDuplicadaErro('Existe uma categoria com esse nome');
    }
    return categoriaEncontrada;
  }

  private async validarCategoriaPorId(
    idCategoria: string,
  ): Promise<CategoriaEntity | null> {
    const categoriaEncontrada =
      await this.categoriaRepository.buscarCategoriaPorId(idCategoria);
    if (!categoriaEncontrada) {
      throw new CategoriaNaoLocalizadaErro('Categoria informada não existe');
    }
    return categoriaEncontrada;
  }
}
