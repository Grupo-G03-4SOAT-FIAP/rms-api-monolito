import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ListaProdutoDTO } from '../../../inbound/rest/v1/presenters/dto/produto/ListaProduto.dto';
import { ProdutoModel } from '../../models/produto.model';
import { Repository } from 'typeorm';
import { AtualizaProdutoDTO } from '../../../inbound/rest/v1/presenters/dto/produto/AtualizaProduto.dto';
import { IProdutoRepository } from 'src/domain/ports/produto/IProdutoRepository';
import { Produto } from 'src/domain/entities/Produto';

@Injectable()
export class ProdutoRepository implements IProdutoRepository {
  constructor(
    @InjectRepository(ProdutoModel)
    private readonly produtoRepository: Repository<ProdutoModel>,
  ) {}

  async criaProduto(ProdutoModel: ProdutoModel) {
    await this.produtoRepository.save(ProdutoModel);
  }

  async listaProdutos() {
    const produtosSalvos = await this.produtoRepository.find({
      relations: {
        categoria: true,
      },
    });
    const produtosLista = produtosSalvos.map(
      (produto) =>
        new ListaProdutoDTO(
          produto.id,
          produto.nome,
          produto.descricao,
          produto.valorUnitario,
          produto.imagemUrl,
          produto.categoria?.id ?? null,
          produto.ativo,
        ),
    );
    return produtosLista;
  }

  async atualizaProduto(id: string, novosDados: AtualizaProdutoDTO) {
    const entityName = await this.produtoRepository.findOne({
      where: { id: id },
      relations: {
        categoria: true,
      },
    });
    Object.assign(entityName, novosDados);
    entityName.categoria = <any>{ id: novosDados.idCategoria };
    await this.produtoRepository.save(entityName);
  }

  async deletaProduto(id: string) {
    await this.produtoRepository.delete(id);
  }

  private toProduto(produto: Produto): ProdutoModel {
    const produtoModel: ProdutoModel = new ProdutoModel();

    produtoModel.id = produto.id;
    produtoModel.nome = produto.nome;
    produtoModel.descricao = produto.descricao;
    produtoModel.categoria = produto.categoria
      ? Object.assign(produto.categoria)
      : null;
    produtoModel.valorUnitario = produto.valorUnitario;
    produtoModel.imagemUrl = produto.imagemUrl;
    produtoModel.ativo = produto.ativo;

    return produtoModel;
  }

  private toCategoriaModel(produtoModel: ProdutoModel): Produto {
    const produto: Produto = new Produto();

    produto.id = produtoModel.id;
    produto.nome = produtoModel.nome;
    produto.descricao = produtoModel.descricao;
    produto.ativo = produtoModel.ativo;
    produto.categoria = Object.assign(produtoModel.categoria);

    return produto;
  }
}
