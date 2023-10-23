import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProdutoModel } from '../../models/produto.model';
import { Repository } from 'typeorm';
import { IProdutoRepository } from 'src/domain/ports/produto/produto.repository.port';
import { ProdutoEntity } from 'src/domain/entities/produto.entity';

@Injectable()
export class ProdutoRepository implements IProdutoRepository {
  constructor(
    @InjectRepository(ProdutoModel)
    private readonly produtoRepository: Repository<ProdutoModel>,
  ) {}

  async criarProduto(produto: ProdutoEntity): Promise<ProdutoModel> {
    const novoProduto = this.produtoRepository.create(produto);
    await this.produtoRepository.save(novoProduto);
    return novoProduto;
  }

  async editarProduto(
    produtoId: string,
    produto: ProdutoEntity,
  ): Promise<ProdutoModel> {
    await this.produtoRepository.update(produtoId, produto);

    return await this.produtoRepository.findOne({
      where: { id: produtoId },
    });
  }

  async excluirProduto(produtoId: string): Promise<void> {
    await this.produtoRepository.delete({ id: produtoId });
  }

  async buscarProduto(produtoId: string): Promise<ProdutoModel | null> {
    return await this.produtoRepository.findOne({
      where: { id: produtoId },
    });
  }

  async listarProdutos(): Promise<ProdutoModel[] | []> {
    const produtos = await this.produtoRepository.find({});
    return produtos;
  }

  async listarProdutosPorCategoria(
    categoriaId: string,
  ): Promise<ProdutoModel[] | []> {
    const produtos = await this.produtoRepository.find({
      where: { categoria: { id: categoriaId } },
    });
    return produtos;
  }
}
