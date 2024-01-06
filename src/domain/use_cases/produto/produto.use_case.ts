import { Inject, Injectable } from '@nestjs/common';
import { IProdutoUseCase } from 'src/domain/ports/produto/produto.use_case.port';
import { IProdutoRepository } from 'src/domain/ports/produto/produto.repository.port';
import {
  CriaProdutoDTO,
  ProdutoDTO,
  AtualizaProdutoDTO,
} from 'src/adapters/inbound/rest/v1/presenters/produto.dto';
import { ICategoriaRepository } from 'src/domain/ports/categoria/categoria.repository.port';
import { ProdutoModel } from 'src/adapters/outbound/models/produto.model';
import { CategoriaDTO } from 'src/adapters/inbound/rest/v1/presenters/categoria.dto';
import {
  ProdutoDuplicadoErro,
  ProdutoNaoLocalizadoErro,
} from 'src/domain/exceptions/produto.exception';
import { CategoriaNaoLocalizadaErro } from 'src/domain/exceptions/categoria.exception';
import { HTTPResponse } from 'src/utils/HTTPResponse';
import { IProdutoFactory } from 'src/domain/ports/produto/produto.factory.port';
import { ToCapitalizeString } from 'src/utils/capitalize_string';

@Injectable()
export class ProdutoUseCase implements IProdutoUseCase {
  constructor(
    @Inject(IProdutoRepository)
    private readonly produtoRepository: IProdutoRepository,
    @Inject(ICategoriaRepository)
    private readonly categoriaRepository: ICategoriaRepository,
    @Inject(IProdutoFactory)
    private readonly produtoFactory: IProdutoFactory,
  ) {}

  async criarProduto(
    criaProdutoDTO: CriaProdutoDTO,
  ): Promise<HTTPResponse<ProdutoDTO>> {
    const nomeProduto = new ToCapitalizeString(criaProdutoDTO.nome).input;
    const buscaProduto =
      await this.produtoRepository.buscarProdutoPorNome(nomeProduto);
    if (buscaProduto) {
      throw new ProdutoDuplicadoErro('Existe um produto com esse nome');
    }

    const buscaCategoria = await this.categoriaRepository.buscarCategoriaPorId(
      criaProdutoDTO.categoriaId,
    );
    if (!buscaCategoria) {
      throw new CategoriaNaoLocalizadaErro('Categoria informada não existe');
    }

    // factory para criar a entidade produto
    const produtoEntity =
      await this.produtoFactory.criarEntidadeProdutoFromCriaProdutoDTO(
        buscaCategoria,
        criaProdutoDTO,
      );

    const result = await this.produtoRepository.criarProduto(produtoEntity);

    const categoriaDTO = new CategoriaDTO();
    categoriaDTO.id = result.categoria.id;
    categoriaDTO.nome = result.categoria.nome;
    categoriaDTO.descricao = result.categoria.descricao;

    const produtoDTO = new ProdutoDTO();
    produtoDTO.id = result.id;
    produtoDTO.nome = result.nome;
    produtoDTO.descricao = result.descricao;
    produtoDTO.valorUnitario = result.valorUnitario;
    produtoDTO.imagemUrl = result.imagemUrl;
    produtoDTO.categoria = categoriaDTO;

    return {
      mensagem: 'Produto criado com sucesso',
      body: produtoDTO,
    };
  }

  async editarProduto(
    produtoId: string,
    atualizaProdutoDTO: AtualizaProdutoDTO,
  ): Promise<HTTPResponse<ProdutoDTO>> {
    const buscaProdutoPorId =
      await this.produtoRepository.buscarProdutoPorId(produtoId);
    if (!buscaProdutoPorId) {
      throw new ProdutoNaoLocalizadoErro('Produto informado não existe');
    }

    if (atualizaProdutoDTO.nome) {
      const nomeProduto = new ToCapitalizeString(atualizaProdutoDTO.nome).input;
      const buscaProdutoPorNome =
        await this.produtoRepository.buscarProdutoPorNome(nomeProduto);
      if (buscaProdutoPorNome) {
        throw new ProdutoDuplicadoErro('Existe um produto com esse nome');
      }
    }

    let categoriaModel = buscaProdutoPorId.categoria;
    if (atualizaProdutoDTO.categoriaId) {
      const buscaCategoria =
        await this.categoriaRepository.buscarCategoriaPorId(
          atualizaProdutoDTO.categoriaId,
        );
      if (!buscaCategoria) {
        throw new CategoriaNaoLocalizadaErro('Categoria informada não existe');
      }
      categoriaModel = buscaCategoria;
    }

    // factory para criar a entidade produto
    const produtoEntity =
      await this.produtoFactory.criarEntidadeProdutoFromAtualizaProdutoDTO(
        categoriaModel,
        atualizaProdutoDTO,
      );

    const result = await this.produtoRepository.editarProduto(
      produtoId,
      produtoEntity,
    );

    const categoriaDTO = new CategoriaDTO();
    categoriaDTO.id = result.categoria.id;
    categoriaDTO.nome = result.categoria.nome;
    categoriaDTO.descricao = result.categoria.descricao;

    const produtoDTO = new ProdutoDTO();
    produtoDTO.id = result.id;
    produtoDTO.nome = result.nome;
    produtoDTO.descricao = result.descricao;
    produtoDTO.valorUnitario = result.valorUnitario;
    produtoDTO.imagemUrl = result.imagemUrl;
    produtoDTO.categoria = categoriaDTO;

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

    const categoriaDTO = new CategoriaDTO();
    categoriaDTO.id = result.categoria.id;
    categoriaDTO.nome = result.categoria.nome;
    categoriaDTO.descricao = result.categoria.descricao;

    const produtoDTO = new ProdutoDTO();
    produtoDTO.id = result.id;
    produtoDTO.nome = result.nome;
    produtoDTO.descricao = result.descricao;
    produtoDTO.valorUnitario = result.valorUnitario;
    produtoDTO.imagemUrl = result.imagemUrl;
    produtoDTO.categoria = categoriaDTO;

    return produtoDTO;
  }

  async listarProdutos(): Promise<ProdutoDTO[] | []> {
    const result = await this.produtoRepository.listarProdutos();
    const listaProdutosDTO = result.map((produto: ProdutoModel) => {
      const produtoDTO = new ProdutoDTO();
      produtoDTO.id = produto.id;
      produtoDTO.nome = produto.nome;
      produtoDTO.descricao = produto.descricao;
      produtoDTO.valorUnitario = produto.valorUnitario;
      produtoDTO.imagemUrl = produto.imagemUrl;
      produtoDTO.categoria = null;

      if (produto.categoria) {
        const categoriaDTO = new CategoriaDTO();
        categoriaDTO.id = produto.categoria.id;
        categoriaDTO.nome = produto.categoria.nome;
        categoriaDTO.descricao = produto.categoria.descricao;
        produtoDTO.categoria = categoriaDTO;
      }

      return produtoDTO;
    });

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
    const listaProdutosDTO = result.map((produto: ProdutoModel) => {
      const categoriaDTO = new CategoriaDTO();
      categoriaDTO.id = produto.categoria.id;
      categoriaDTO.nome = produto.categoria.nome;
      categoriaDTO.descricao = produto.categoria.descricao;

      const produtoDTO = new ProdutoDTO();
      produtoDTO.id = produto.id;
      produtoDTO.nome = produto.nome;
      produtoDTO.descricao = produto.descricao;
      produtoDTO.valorUnitario = produto.valorUnitario;
      produtoDTO.imagemUrl = produto.imagemUrl;
      produtoDTO.categoria = categoriaDTO;

      return produtoDTO;
    });

    return listaProdutosDTO;
  }
}
