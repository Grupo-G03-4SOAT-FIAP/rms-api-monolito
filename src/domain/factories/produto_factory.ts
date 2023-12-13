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

@Injectable()
export class ProdutoFactory implements IProdutoFactory {
  constructor(
    @Inject(ICategoriaRepository)
    private readonly categoriaRepository: ICategoriaRepository,
    @Inject(IProdutoRepository)
    private readonly produtoRepository: IProdutoRepository,
  ) {}

  async criarEntidadeProdutoFromCriaProdutoDTO(criaProdutoDTO: CriaProdutoDTO): Promise<ProdutoEntity> {
    const nomeProduto = new ToCapitalizeString(criaProdutoDTO.nome).input
    const buscaProduto =
      await this.produtoRepository.buscarProdutoPorNome(nomeProduto);
    if (buscaProduto) {
      throw new ProdutoDuplicadoErro('Existe um produto com esse nome');
    }

    const buscaCategoria =
      await this.categoriaRepository.buscarCategoriaPorId(criaProdutoDTO.categoriaId);
    if (!buscaCategoria) {
      throw new CategoriaNaoLocalizadaErro('Categoria informada não existe');
    }

    const categoriaEntity = new CategoriaEntity(
      buscaCategoria.nome,
      buscaCategoria.descricao,
      buscaCategoria.id,
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

  async criarEntidadeProdutoFromAtualizaProdutoDTO(produtoId: string, atualizaProdutoDTO: AtualizaProdutoDTO): Promise<ProdutoEntity> {
    const buscaProdutoPorId =
      await this.produtoRepository.buscarProdutoPorId(produtoId);
    if (!buscaProdutoPorId) {
      throw new ProdutoNaoLocalizadoErro('Produto informado não existe');
    }

    if (atualizaProdutoDTO.nome) {
      const nomeProduto = new ToCapitalizeString(atualizaProdutoDTO.nome).input
      const buscaProdutoPorNome =
        await this.produtoRepository.buscarProdutoPorNome(nomeProduto);
      if (buscaProdutoPorNome) {
        throw new ProdutoDuplicadoErro('Existe um produto com esse nome');
      }
    }

    let categoriaModel = buscaProdutoPorId.categoria;
    if (atualizaProdutoDTO.categoriaId) {
      const buscaCategoria =
        await this.categoriaRepository.buscarCategoriaPorId(atualizaProdutoDTO.categoriaId);
      if (!buscaCategoria) {
        throw new CategoriaNaoLocalizadaErro('Categoria informada não existe');
      }
      categoriaModel = buscaCategoria;
    }

    const categoriaEntity = new CategoriaEntity(
      categoriaModel.nome,
      categoriaModel.descricao,
      categoriaModel.id,
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
