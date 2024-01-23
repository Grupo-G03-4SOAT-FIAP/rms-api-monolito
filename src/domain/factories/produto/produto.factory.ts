import { Inject, Injectable } from '@nestjs/common';
import { CategoriaEntity } from '../../entities/categoria/categoria.entity';
import { ProdutoEntity } from '../../entities/produto/produto.entity';
import { IProdutoFactory } from '../../ports/produto/produto.factory.port';
import {
  AtualizaProdutoDTO,
  CriaProdutoDTO,
} from 'src/adapters/inbound/rest/v1/presenters/produto.dto';
import { CategoriaNaoLocalizadaErro } from 'src/domain/exceptions/categoria.exception';
import { ICategoriaRepository } from 'src/domain/ports/categoria/categoria.repository.port';

@Injectable()
export class ProdutoFactory implements IProdutoFactory {
  constructor(
    @Inject(ICategoriaRepository)
    private readonly categoriaRepository: ICategoriaRepository,
  ) {}

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
