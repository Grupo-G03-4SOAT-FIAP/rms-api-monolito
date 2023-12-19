import { Inject, Injectable } from '@nestjs/common';
import { IProdutoRepository } from '../ports/produto/produto.repository.port';
import { ProdutoDuplicadoErro } from '../exceptions/produto.exception';
import { CategoriaEntity } from '../entities/categoria.entity';
import { CategoriaNaoLocalizadaErro } from '../exceptions/categoria.exception';
import { ProdutoEntity } from '../entities/produto.entity';
import { ICategoriaRepository } from '../ports/categoria/categoria.repository.port';
import { IProdutoFactory } from '../ports/produto/produto.factory.port';
import { CriaProdutoDTO } from 'src/adapters/inbound/rest/v1/presenters/produto.dto';

@Injectable()
export class ProdutoFactory implements IProdutoFactory {
  constructor(
    @Inject(ICategoriaRepository)
    private readonly categoriaRepository: ICategoriaRepository,
    @Inject(IProdutoRepository)
    private readonly produtoRepository: IProdutoRepository,
  ) {}

  async criarEntidadeProduto(produto: CriaProdutoDTO): Promise<ProdutoEntity> {
    const buscaProduto = await this.produtoRepository.buscarProdutoPorNome(
      produto.nome,
    );
    if (buscaProduto) {
      throw new ProdutoDuplicadoErro('Existe um produto com esse nome');
    }

    const buscaCategoria = await this.categoriaRepository.buscarCategoriaPorId(
      produto.categoriaId,
    );
    if (!buscaCategoria) {
      throw new CategoriaNaoLocalizadaErro('Categoria informada não existe');
    }

    const categoriaEntity = new CategoriaEntity(
      buscaCategoria.nome,
      buscaCategoria.descricao,
      buscaCategoria.id,
    );

    const produtoEntity = new ProdutoEntity(
      produto.nome,
      categoriaEntity,
      produto.valorUnitario,
      produto.imagemUrl,
      produto.descricao,
    );

    return produtoEntity;
  }
}
