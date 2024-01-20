import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProdutoModel } from '../../models/produto.model';
import { Repository } from 'typeorm';
import { IProdutoRepository } from 'src/domain/ports/produto/produto.repository.port';
import { ProdutoEntity } from 'src/domain/entities/produto/produto.entity';

@Injectable()
export class ProdutoRepository implements IProdutoRepository {
  constructor(
    @InjectRepository(ProdutoModel)
    private readonly produtoRepository: Repository<ProdutoModel>,
  ) {}

  async criarProduto(produto: ProdutoEntity): Promise<ProdutoModel> {
    const produtoModel = this.produtoRepository.create(produto);
    await this.produtoRepository.save(produtoModel);
    return produtoModel;
  }

  async editarProduto(
    produtoId: string,
    produto: ProdutoEntity,
  ): Promise<ProdutoModel> {
    const produtoModel = this.produtoRepository.create(produto);
    await this.produtoRepository.update(produtoId, produtoModel);

    return await this.produtoRepository.findOne({
      where: { id: produtoId },
      relations: ['categoria'], // Especifica a relação que você deseja incluir
    });
  }

  async excluirProduto(produtoId: string): Promise<void> {
    await this.produtoRepository.softDelete({ id: produtoId });
  }

  async buscarProdutoPorId(produtoId: string): Promise<ProdutoModel | null> {
    return await this.produtoRepository.findOne({
      where: { id: produtoId },
      relations: ['categoria'],
    });
  }

  async buscarProdutoPorNome(
    nomeProduto: string,
  ): Promise<ProdutoModel | null> {
    return await this.produtoRepository.findOne({
      where: { nome: nomeProduto },
      relations: ['categoria'],
    });
  }

  async listarProdutos(): Promise<ProdutoModel[] | []> {
    const produtos = await this.produtoRepository.find({
      relations: ['categoria'],
    });
    return produtos;
  }

  async listarProdutosPorCategoria(
    categoriaId: string,
  ): Promise<ProdutoModel[] | []> {
    const produtos = await this.produtoRepository.find({
      where: { categoria: { id: categoriaId } },
      relations: ['categoria'],
    });
    return produtos;
  }
}
