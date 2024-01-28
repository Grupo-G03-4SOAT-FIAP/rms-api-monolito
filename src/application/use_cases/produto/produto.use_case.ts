import { Inject, Injectable } from '@nestjs/common';
import { HTTPResponse } from 'src/application/common/HTTPResponse';
import { CategoriaNaoLocalizadaErro } from 'src/domain/categoria/exceptions/categoria.exception';
import { ICategoriaRepository } from 'src/domain/categoria/interfaces/categoria.repository.port';
import { ProdutoEntity } from 'src/domain/produto/entities/produto.entity';
import {
  ProdutoDuplicadoErro,
  ProdutoNaoLocalizadoErro,
} from 'src/domain/produto/exceptions/produto.exception';
import { IProdutoDTOFactory } from 'src/domain/produto/interfaces/produto.dto.factory.port';
import { IProdutoFactory } from 'src/domain/produto/interfaces/produto.factory.port';
import { IProdutoRepository } from 'src/domain/produto/interfaces/produto.repository.port';
import { IProdutoUseCase } from 'src/domain/produto/interfaces/produto.use_case.port';
import {
  AtualizaProdutoDTO,
  CriaProdutoDTO,
  ProdutoDTO,
} from 'src/presentation/rest/v1/presenters/produto/produto.dto';

@Injectable()
export class ProdutoUseCase implements IProdutoUseCase {
  constructor(
    @Inject(IProdutoRepository)
    private readonly produtoRepository: IProdutoRepository,
    @Inject(ICategoriaRepository)
    private readonly categoriaRepository: ICategoriaRepository,
    @Inject(IProdutoFactory)
    private readonly produtoFactory: IProdutoFactory,
    @Inject(IProdutoDTOFactory)
    private readonly produtoDTOFactory: IProdutoDTOFactory,
  ) {}

  private async validarProdutoPorNome(
    nomeProduto: string,
  ): Promise<ProdutoEntity | null> {
    const produtoModel =
      await this.produtoRepository.buscarProdutoPorNome(nomeProduto);
    if (produtoModel) {
      throw new ProdutoDuplicadoErro('Existe um produto com esse nome');
    }
    return produtoModel;
  }

  private async validarProdutoPorId(
    produtoId: string,
  ): Promise<ProdutoEntity | null> {
    const produtoModel =
      await this.produtoRepository.buscarProdutoPorId(produtoId);
    if (!produtoModel) {
      throw new ProdutoNaoLocalizadoErro('Produto informado não existe');
    }
    return produtoModel;
  }

  async criarProduto(
    produto: CriaProdutoDTO,
  ): Promise<HTTPResponse<ProdutoDTO>> {
    const produtoEntity =
      await this.produtoFactory.criarEntidadeProduto(produto);

    await this.validarProdutoPorNome(produtoEntity.nome);

    const result = await this.produtoRepository.criarProduto(produtoEntity);
    const produtoDTO = this.produtoDTOFactory.criarProdutoDTO(result);

    return {
      mensagem: 'Produto criado com sucesso',
      body: produtoDTO,
    };
  }

  async editarProduto(
    produtoId: string,
    produto: AtualizaProdutoDTO,
  ): Promise<HTTPResponse<ProdutoDTO>> {
    await this.validarProdutoPorId(produtoId);
    
    const produtoEntity =
      await this.produtoFactory.criarEntidadeProduto(produto);

    if (produtoEntity.nome) {
      await this.validarProdutoPorNome(produtoEntity.nome);
    }

    const result = await this.produtoRepository.editarProduto(
      produtoId,
      produtoEntity,
    );
    const produtoDTO = this.produtoDTOFactory.criarProdutoDTO(result);

    return {
      mensagem: 'Produto atualizado com sucesso',
      body: produtoDTO,
    };
  }

  async excluirProduto(
    produtoId: string,
  ): Promise<Omit<HTTPResponse<void>, 'body'>> {
    await this.validarProdutoPorId(produtoId);
    await this.produtoRepository.excluirProduto(produtoId);
    return {
      mensagem: 'Produto excluído com sucesso',
    };
  }

  async buscarProduto(produtoId: string): Promise<ProdutoDTO> {
    const result = await this.validarProdutoPorId(produtoId);
    const produtoDTO = this.produtoDTOFactory.criarProdutoDTO(result);
    return produtoDTO;
  }

  async listarProdutos(): Promise<ProdutoDTO[] | []> {
    const result = await this.produtoRepository.listarProdutos();
    const listaProdutosDTO =
      this.produtoDTOFactory.criarListaProdutoDTO(result);

    return listaProdutosDTO;
  }

  async listarProdutosPorCategoria(
    categoriaId: string,
  ): Promise<ProdutoDTO[] | []> {
    const buscaCategoria =
      await this.categoriaRepository.buscarCategoriaPorId(categoriaId);
    if (!buscaCategoria) {
      throw new CategoriaNaoLocalizadaErro('Categoria informada não existe');
    }

    const result =
      await this.produtoRepository.listarProdutosPorCategoria(categoriaId);
    const listaProdutosDTO =
      this.produtoDTOFactory.criarListaProdutoDTO(result);

    return listaProdutosDTO;
  }
}
