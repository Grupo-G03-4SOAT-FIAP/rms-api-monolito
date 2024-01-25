import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IProdutoRepository } from 'src/domain/produto/interfaces/produto.repository.port';
import { Repository } from 'typeorm';
import { ProdutoModel } from '../../models/produto.model';
import { ProdutoEntity } from 'src/domain/produto/entities/produto.entity';
import { IProdutoEntityFactory } from 'src/domain/produto/interfaces/produto.entity.factory.port';

@Injectable()
export class ProdutoRepository implements IProdutoRepository {
  readonly relations: string[] = ['categoria'];
  constructor(
    @InjectRepository(ProdutoModel)
    private readonly produtoRepository: Repository<ProdutoModel>,
    @Inject(IProdutoEntityFactory)
    private readonly produtoEntityFactory: IProdutoEntityFactory,
  ) { }

  async criarProduto(produto: ProdutoEntity): Promise<ProdutoEntity> {
    const produtoModel = this.produtoRepository.create(produto);
    await this.produtoRepository.save(produtoModel);
    const produtoEntity = this.produtoEntityFactory.criarEntidadeProduto(produtoModel);
    return produtoEntity;
  }

  async editarProduto(
    produtoId: string,
    produto: ProdutoEntity,
  ): Promise<ProdutoEntity> {
    const produtoModel = this.produtoRepository.create(produto);
    await this.produtoRepository.update(produtoId, produtoModel);

    const produtoModelAtualizado = await this.produtoRepository.findOne({
      where: { id: produtoId },
      relations: this.relations, // Especifica a relação que você deseja incluir
    });

    const produtoEntity = this.produtoEntityFactory.criarEntidadeProduto(produtoModelAtualizado);
    return produtoEntity;
  }

  async excluirProduto(produtoId: string): Promise<void> {
    await this.produtoRepository.softDelete({ id: produtoId });
  }

  async buscarProdutoPorId(produtoId: string): Promise<ProdutoEntity | null> {
    const produtoModel = await this.produtoRepository.findOne({
      where: { id: produtoId },
      relations: this.relations,
    });
    if (produtoModel) {
      const produtoEntity = this.produtoEntityFactory.criarEntidadeProduto(produtoModel);
      return produtoEntity;
    }
    return null;
  }

  async buscarProdutoPorNome(
    nomeProduto: string,
  ): Promise<ProdutoEntity | null> {
    const produtoModel = await this.produtoRepository.findOne({
      where: { nome: nomeProduto },
      relations: this.relations,
    });
    if (produtoModel) {
      const produtoEntity = this.produtoEntityFactory.criarEntidadeProduto(produtoModel);
      return produtoEntity;
    }
    return null;
  }

  async listarProdutos(): Promise<ProdutoEntity[] | []> {
    const produtos = await this.produtoRepository.find({
      relations: this.relations,
    });
    const listaProdutoEntity = produtos.map(
      (produtoModel: ProdutoModel) => {
        return this.produtoEntityFactory.criarEntidadeProduto(produtoModel);
      },
    );

    return listaProdutoEntity;
  }

  async listarProdutosPorCategoria(
    categoriaId: string,
  ): Promise<ProdutoEntity[] | []> {
    const produtos = await this.produtoRepository.find({
      where: { categoria: { id: categoriaId } },
      relations: this.relations,
    });
    const listaProdutoEntity = produtos.map(
      (produtoModel: ProdutoModel) => {
        return this.produtoEntityFactory.criarEntidadeProduto(produtoModel);
      },
    );

    return listaProdutoEntity;
  }
}
