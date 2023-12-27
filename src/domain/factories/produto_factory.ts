import { Inject, Injectable } from '@nestjs/common';
import { IProdutoRepository } from '../ports/produto/produto.repository.port';
import { ProdutoDuplicadoErro, ProdutoNaoLocalizadoErro } from '../exceptions/produto.exception';
import { CategoriaEntity } from '../entities/categoria.entity';
import { CategoriaNaoLocalizadaErro } from '../exceptions/categoria.exception';
import { ProdutoEntity } from '../entities/produto.entity';
import { ICategoriaRepository } from '../ports/categoria/categoria.repository.port';
import { IProdutoFactory } from '../ports/produto/produto.factory.port';
import { AtualizaProdutoDTO, CriaProdutoDTO } from 'src/adapters/inbound/rest/v1/presenters/produto.dto';
import { ToCapitalizeString } from 'src/utils/capitalize_string';
import { CategoriaModel } from 'src/adapters/outbound/models/categoria.model';

@Injectable()
export class ProdutoFactory implements IProdutoFactory {
  constructor(
    @Inject(ICategoriaRepository)
    private readonly categoriaRepository: ICategoriaRepository,
    @Inject(IProdutoRepository)
    private readonly produtoRepository: IProdutoRepository,
  ) { }

  async criarEntidadeProdutoFromCriaProdutoDTO(categoria: CategoriaModel, criaProdutoDTO: CriaProdutoDTO): Promise<ProdutoEntity> {
    const categoriaEntity = new CategoriaEntity(
      categoria.nome,
      categoria.descricao,
      categoria.id,
    );

    const produtoEntity = new ProdutoEntity(
      criaProdutoDTO.nome,
      categoriaEntity,
      criaProdutoDTO.valorUnitario,
      criaProdutoDTO.imagemUrl,
      criaProdutoDTO.descricao,
    );

    return produtoEntity;
  }

  async criarEntidadeProdutoFromAtualizaProdutoDTO(categoria: CategoriaModel, atualizaProdutoDTO: AtualizaProdutoDTO): Promise<ProdutoEntity> {
    const categoriaEntity = new CategoriaEntity(
      categoria.nome,
      categoria.descricao,
      categoria.id,
    );

    const produtoEntity = new ProdutoEntity(
      atualizaProdutoDTO.nome,
      categoriaEntity,
      atualizaProdutoDTO.valorUnitario,
      atualizaProdutoDTO.imagemUrl,
      atualizaProdutoDTO.descricao,
    );

    return produtoEntity;
  }
}
