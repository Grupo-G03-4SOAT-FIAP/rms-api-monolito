import { Inject, Injectable } from '@nestjs/common';
import { IProdutoFactory } from '../interfaces/produto.factory.port';
import { ICategoriaRepository } from 'src/domain/categoria/interfaces/categoria.repository.port';
import { CategoriaEntity } from 'src/domain/categoria/entities/categoria.entity';
import { CategoriaNaoLocalizadaErro } from 'src/domain/categoria/exceptions/categoria.exception';
import {
  AtualizaProdutoDTO,
  CriaProdutoDTO,
} from 'src/presentation/rest/v1/presenters/produto/produto.dto';
import { ProdutoEntity } from '../entities/produto.entity';

@Injectable()
export class ProdutoFactory implements IProdutoFactory {
  constructor(
    @Inject(ICategoriaRepository)
    private readonly categoriaRepository: ICategoriaRepository,
  ) { }

  async criarEntidadeCategoria(categoriaId: string): Promise<CategoriaEntity> {
    const buscaCategoria =
      await this.categoriaRepository.buscarCategoriaPorId(categoriaId);
    if (!buscaCategoria) {
      throw new CategoriaNaoLocalizadaErro('Categoria informada não existe');
    }

    const { nome, descricao, id } = buscaCategoria;
    const categoriaEntity = new CategoriaEntity(nome, descricao, id);
    return categoriaEntity;
  }

  async criarEntidadeProduto(
    produto: CriaProdutoDTO | AtualizaProdutoDTO,
  ): Promise<ProdutoEntity> {
    let categoriaEntity = undefined;
    if (produto.categoriaId) {
      categoriaEntity = await this.criarEntidadeCategoria(produto.categoriaId);
    }

    return new ProdutoEntity(
      produto.nome,
      categoriaEntity,
      produto.valorUnitario,
      produto.imagemUrl,
      produto.descricao,
    );
  }
}
