import { Inject, Injectable } from '@nestjs/common';
import { HTTPResponse } from '../../../application/common/HTTPResponse';
import { CategoriaNaoLocalizadaErro } from '../../../domain/categoria/exceptions/categoria.exception';
import { ICategoriaRepository } from '../../../domain/categoria/interfaces/categoria.repository.port';
import { ProdutoEntity } from '../../../domain/produto/entities/produto.entity';
import {
  ProdutoDuplicadoErro,
  ProdutoNaoLocalizadoErro,
} from '../../../domain/produto/exceptions/produto.exception';
import { IProdutoDTOFactory } from '../../../domain/produto/interfaces/produto.dto.factory.port';
import { IProdutoFactory } from '../../../domain/produto/interfaces/produto.factory.port';
import { IProdutoRepository } from '../../../domain/produto/interfaces/produto.repository.port';
import { IProdutoUseCase } from '../../../domain/produto/interfaces/produto.use_case.port';
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

  async listarProdutos(): Promise<ProdutoDTO[] | []> {
    const listaProdutos = await this.produtoRepository.listarProdutos();
    const listaProdutosDTO =
      this.produtoDTOFactory.criarListaProdutoDTO(listaProdutos);

    return listaProdutosDTO;
  }

  async listarProdutosPorCategoria(
    idCategoria: string,
  ): Promise<ProdutoDTO[] | []> {
    const categoriaEncontrada =
      await this.categoriaRepository.buscarCategoriaPorId(idCategoria);
    if (!categoriaEncontrada) {
      throw new CategoriaNaoLocalizadaErro('Categoria informada não existe');
    }
    const listaProdutos =
      await this.produtoRepository.listarProdutosPorCategoria(idCategoria);
    const listaProdutosDTO =
      this.produtoDTOFactory.criarListaProdutoDTO(listaProdutos);
    return listaProdutosDTO;
  }

  async buscarProduto(idProduto: string): Promise<ProdutoDTO> {
    const produtoEncontrado = await this.validarProdutoPorId(idProduto);
    const produtoDTO =
      this.produtoDTOFactory.criarProdutoDTO(produtoEncontrado);
    return produtoDTO;
  }

  async criarProduto(
    criaProdutoDTO: CriaProdutoDTO,
  ): Promise<HTTPResponse<ProdutoDTO>> {
    await this.validarProdutoPorNome(criaProdutoDTO.nome);
    const produto =
      await this.produtoFactory.criarEntidadeProduto(criaProdutoDTO);
    const produtoCriado = await this.produtoRepository.criarProduto(produto);
    const produtoDTO = this.produtoDTOFactory.criarProdutoDTO(produtoCriado);
    return {
      mensagem: 'Produto criado com sucesso',
      body: produtoDTO,
    };
  }

  async editarProduto(
    idProduto: string,
    atualizaProdutoDTO: AtualizaProdutoDTO,
  ): Promise<HTTPResponse<ProdutoDTO>> {
    await this.validarProdutoPorId(idProduto);
    if (atualizaProdutoDTO.nome)
      await this.validarProdutoPorNome(atualizaProdutoDTO.nome);
    const produto =
      await this.produtoFactory.criarEntidadeProduto(atualizaProdutoDTO);
    const produtoEditado = await this.produtoRepository.editarProduto(
      idProduto,
      produto,
    );
    const produtoDTO = this.produtoDTOFactory.criarProdutoDTO(produtoEditado);
    return {
      mensagem: 'Produto atualizado com sucesso',
      body: produtoDTO,
    };
  }

  async excluirProduto(
    idProduto: string,
  ): Promise<Omit<HTTPResponse<void>, 'body'>> {
    await this.validarProdutoPorId(idProduto);
    await this.produtoRepository.excluirProduto(idProduto);
    return {
      mensagem: 'Produto excluído com sucesso',
    };
  }

  private async validarProdutoPorNome(
    nomeProduto: string,
  ): Promise<ProdutoEntity | null> {
    const produtoEncontrado =
      await this.produtoRepository.buscarProdutoPorNome(nomeProduto);
    if (produtoEncontrado) {
      throw new ProdutoDuplicadoErro('Existe um produto com esse nome');
    }
    return produtoEncontrado;
  }

  private async validarProdutoPorId(
    idProduto: string,
  ): Promise<ProdutoEntity | null> {
    const produtoEncontrado =
      await this.produtoRepository.buscarProdutoPorId(idProduto);
    if (!produtoEncontrado) {
      throw new ProdutoNaoLocalizadoErro('Produto informado não existe');
    }
    return produtoEncontrado;
  }
}
