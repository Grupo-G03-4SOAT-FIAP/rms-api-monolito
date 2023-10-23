import { Inject, Injectable } from '@nestjs/common';
import { ICategoriaUseCase } from 'src/domain/ports/categoria/categoria.use_case.port';
import { ICategoriaRepository } from 'src/domain/ports/categoria/categoria.repository.port';
import { CategoriaEntity } from 'src/domain/entities/categoria.entity';
import {
  AtualizaCategoriaDTO,
  CategoriaDTO,
  CriaCategoriaDTO,
} from 'src/adapters/inbound/rest/v1/presenters/categoria.dto';
import { CategoriaModel } from 'src/adapters/outbound/models/categoria.model';
import { CategoriaNaoLocalizadaErro } from 'src/domain/exceptions/categoria.exception';

@Injectable()
export class CategoriaUseCase implements ICategoriaUseCase {
  constructor(
    @Inject(ICategoriaRepository)
    private readonly categoriaRepository: ICategoriaRepository,
  ) {}

  async criarCategoria(
    categoria: CriaCategoriaDTO,
  ): Promise<{ mensagem: string; categoria: CategoriaDTO }> {
    const { nome, descricao } = categoria; // Desempacotando os valores do DTO
    const categoriaEntity = new CategoriaEntity(nome, descricao);
    const result =
      await this.categoriaRepository.criarCategoria(categoriaEntity);

    const categoriaDTO = new CategoriaDTO();
    categoriaDTO.id = result.id;
    categoriaDTO.nome = result.nome;
    categoriaDTO.descricao = result.descricao;

    return {
      mensagem: 'Categoria criada com sucesso',
      categoria: categoriaDTO,
    };
  }

  async editarCategoria(
    categoriaId: string,
    categoria: AtualizaCategoriaDTO,
  ): Promise<{ mensagem: string; categoria: CategoriaDTO }> {
    const buscaCategoria =
      await this.categoriaRepository.buscarCategoria(categoriaId);
    if (!buscaCategoria) {
      throw new CategoriaNaoLocalizadaErro('Categoria informada não existe');
    }

    const { nome, descricao } = categoria; // Desempacotando os valores do DTO
    const categoriaEntity = new CategoriaEntity(nome, descricao);
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
      categoria: categoriaDTO,
    };
  }

  async excluirCategoria(categoriaId: string): Promise<{ mensagem: string }> {
    const buscaCategoria =
      await this.categoriaRepository.buscarCategoria(categoriaId);
    if (!buscaCategoria) {
      throw new CategoriaNaoLocalizadaErro('Categoria informada não existe');
    }

    await this.categoriaRepository.excluirCategoria(categoriaId);
    return {
      mensagem: 'Categoria excluida com sucesso',
    };
  }

  async buscarCategoria(categoriaId: string): Promise<CategoriaDTO> {
    const result = await this.categoriaRepository.buscarCategoria(categoriaId);
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
