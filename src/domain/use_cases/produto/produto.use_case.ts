import { Inject, Injectable } from '@nestjs/common';
import { IProdutoUseCase } from 'src/domain/ports/produto/produto.use_case.port';
import { IProdutoRepository } from 'src/domain/ports/produto/produto.repository.port';
import {
  CriaProdutoDTO,
  ProdutoDTO,
  AtualizaProdutoDTO,
} from 'src/adapters/inbound/rest/v1/presenters/produto.dto';
import { ICategoriaRepository } from 'src/domain/ports/categoria/categoria.repository.port';
import {
  ProdutoDuplicadoErro,
  ProdutoNaoLocalizadoErro,
} from 'src/domain/exceptions/produto.exception';
import { CategoriaNaoLocalizadaErro } from 'src/domain/exceptions/categoria.exception';
import { HTTPResponse } from 'src/utils/HTTPResponse';
import { IProdutoFactory } from 'src/domain/ports/produto/produto.factory.port';
import { IProdutoDTOFactory } from 'src/domain/ports/produto/produto.dto.factory.port';

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

  async criarProduto(
    produto: CriaProdutoDTO,
  ): Promise<HTTPResponse<ProdutoDTO>> {
    const produtoEntity =
      await this.produtoFactory.criarEntidadeProduto(produto);

    const buscaProduto = await this.produtoRepository.buscarProdutoPorNome(
      produtoEntity.nome,
    );
    if (buscaProduto) {
      throw new ProdutoDuplicadoErro('Existe um produto com esse nome');
    }

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
    const produtoEntity =
      await this.produtoFactory.criarEntidadeProduto(produto);

    const buscaProdutoPorId =
      await this.produtoRepository.buscarProdutoPorId(produtoId);
    if (!buscaProdutoPorId) {
      throw new ProdutoNaoLocalizadoErro('Produto informado não existe');
    }

    if (produtoEntity.nome) {
      const buscaProdutoPorNome =
        await this.produtoRepository.buscarProdutoPorNome(produtoEntity.nome);
      if (buscaProdutoPorNome) {
        throw new ProdutoDuplicadoErro('Existe um produto com esse nome');
      }
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
    const buscaProduto =
      await this.produtoRepository.buscarProdutoPorId(produtoId);
    if (!buscaProduto) {
      throw new ProdutoNaoLocalizadoErro('Produto informado não existe');
    }

    await this.produtoRepository.excluirProduto(produtoId);
    return {
      mensagem: 'Produto excluído com sucesso',
    };
  }

  async buscarProduto(produtoId: string): Promise<ProdutoDTO> {
    const result = await this.produtoRepository.buscarProdutoPorId(produtoId);
    if (!result) {
      throw new ProdutoNaoLocalizadoErro('Produto informado não existe');
    }

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
