import { Inject, Injectable } from '@nestjs/common';
import { IProdutoUseCase } from 'src/domain/ports/produto/produto.use_case.port';
import { IProdutoRepository } from 'src/domain/ports/produto/produto.repository.port';
import {
  CriaProdutoDTO,
  ProdutoDTO,
  AtualizaProdutoDTO,
} from 'src/adapters/inbound/rest/v1/presenters/produto.dto';
import { ProdutoEntity } from 'src/domain/entities/produto.entity';
import { ICategoriaRepository } from 'src/domain/ports/categoria/categoria.repository.port';
import { ProdutoModel } from 'src/adapters/outbound/models/produto.model';
import { CategoriaDTO } from 'src/adapters/inbound/rest/v1/presenters/categoria.dto';
import {
  NomeProdutoDuplicadoErro,
  ProdutoNaoLocalizadoErro,
} from 'src/domain/exceptions/produto.exception';
import { CategoriaNaoLocalizadaErro } from 'src/domain/exceptions/categoria.exception';

@Injectable()
export class ProdutoUseCase implements IProdutoUseCase {
  constructor(
    @Inject(IProdutoRepository)
    private readonly produtoRepository: IProdutoRepository,
    @Inject(ICategoriaRepository)
    private readonly categoriaRepository: ICategoriaRepository,
  ) {}

  async criarProduto(
    produto: CriaProdutoDTO,
  ): Promise<{ mensagem: string; produto: ProdutoDTO }> {
    const { nome, descricao, valorUnitario, imagemUrl, idCategoria } = produto; // Desempacotando os valores do DTO

    const buscaProduto =
      await this.produtoRepository.buscarProdutoPorNome(nome);
    if (buscaProduto) {
      throw new NomeProdutoDuplicadoErro('Existe um produto com esse nome');
    }

    const buscaCategoria =
      await this.categoriaRepository.buscarCategoriaPorId(idCategoria);
    if (!buscaCategoria) {
      throw new CategoriaNaoLocalizadaErro('Categoria informada não existe');
    }

    const produtoEntity = new ProdutoEntity(
      nome,
      buscaCategoria,
      valorUnitario,
      imagemUrl,
      descricao,
    );
    const result = await this.produtoRepository.criarProduto(produtoEntity);

    const produtoDTO = new ProdutoDTO();
    produtoDTO.id = result.id;
    produtoDTO.nome = result.nome;
    produtoDTO.descricao = result.descricao;
    produtoDTO.valorUnitario = result.valorUnitario;
    produtoDTO.imagemUrl = result.imagemUrl;

    const categoriaDTO = new CategoriaDTO();
    categoriaDTO.id = result.categoria.id;
    categoriaDTO.nome = result.categoria.nome;
    categoriaDTO.descricao = result.categoria.descricao;

    produtoDTO.categoria = categoriaDTO;

    return {
      mensagem: 'Produto criado com sucesso',
      produto: produtoDTO,
    };
  }

  async editarProduto(
    produtoId: string,
    produto: AtualizaProdutoDTO,
  ): Promise<{ mensagem: string; produto: ProdutoDTO }> {
    const { nome, descricao, valorUnitario, imagemUrl, idCategoria } = produto; // Desempacotando os valores do DTO

    const buscaProdutoPorNome =
      await this.produtoRepository.buscarProdutoPorNome(nome);
    if (buscaProdutoPorNome) {
      throw new NomeProdutoDuplicadoErro('Existe um produto com esse nome');
    }

    const buscaProdutoPorId =
      await this.produtoRepository.buscarProdutoPorId(produtoId);
    if (!buscaProdutoPorId) {
      throw new ProdutoNaoLocalizadoErro('Produto informado não existe');
    }

    const buscaCategoria =
      await this.categoriaRepository.buscarCategoriaPorId(idCategoria);
    if (!buscaCategoria) {
      throw new CategoriaNaoLocalizadaErro('Categoria informada não existe');
    }

    const produtoEntity = new ProdutoEntity(
      nome,
      buscaCategoria,
      valorUnitario,
      imagemUrl,
      descricao,
    );
    const result = await this.produtoRepository.editarProduto(
      produtoId,
      produtoEntity,
    );

    const produtoDTO = new ProdutoDTO();
    produtoDTO.id = result.id;
    produtoDTO.nome = result.nome;
    produtoDTO.descricao = result.descricao;
    produtoDTO.valorUnitario = result.valorUnitario;
    produtoDTO.imagemUrl = result.imagemUrl;

    const categoriaDTO = new CategoriaDTO();
    categoriaDTO.id = result.categoria.id;
    categoriaDTO.nome = result.categoria.nome;
    categoriaDTO.descricao = result.categoria.descricao;

    produtoDTO.categoria = categoriaDTO;

    return {
      mensagem: 'Produto editado com sucesso',
      produto: produtoDTO,
    };
  }

  async excluirProduto(produtoId: string): Promise<{ mensagem: string }> {
    const buscaProduto =
      await this.produtoRepository.buscarProdutoPorId(produtoId);
    if (!buscaProduto) {
      throw new ProdutoNaoLocalizadoErro('Produto informado não existe');
    }

    await this.produtoRepository.excluirProduto(produtoId);
    return {
      mensagem: 'Produto excluido com sucesso',
    };
  }

  async buscarProduto(produtoId: string): Promise<ProdutoDTO> {
    const result = await this.produtoRepository.buscarProdutoPorId(produtoId);
    if (!result) {
      throw new ProdutoNaoLocalizadoErro('Produto informado não existe');
    }

    const produtoDTO = new ProdutoDTO();
    produtoDTO.id = result.id;
    produtoDTO.nome = result.nome;
    produtoDTO.descricao = result.descricao;
    produtoDTO.valorUnitario = result.valorUnitario;
    produtoDTO.imagemUrl = result.imagemUrl;

    const categoriaDTO = new CategoriaDTO();
    categoriaDTO.id = result.categoria.id;
    categoriaDTO.nome = result.categoria.nome;
    categoriaDTO.descricao = result.categoria.descricao;

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

      const categoriaDTO = new CategoriaDTO();
      categoriaDTO.id = produto.categoria.id;
      categoriaDTO.nome = produto.categoria.nome;
      categoriaDTO.descricao = produto.categoria.descricao;

      produtoDTO.categoria = categoriaDTO;
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
      const produtoDTO = new ProdutoDTO();
      produtoDTO.id = produto.id;
      produtoDTO.nome = produto.nome;
      produtoDTO.descricao = produto.descricao;
      produtoDTO.valorUnitario = produto.valorUnitario;
      produtoDTO.imagemUrl = produto.imagemUrl;

      const categoriaDTO = new CategoriaDTO();
      categoriaDTO.id = produto.categoria.id;
      categoriaDTO.nome = produto.categoria.nome;
      categoriaDTO.descricao = produto.categoria.descricao;

      produtoDTO.categoria = categoriaDTO;
      return produtoDTO;
    });

    return listaProdutosDTO;
  }
}
