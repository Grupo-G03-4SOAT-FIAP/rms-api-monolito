import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ListaProdutoDTO } from '../../../inbound/rest/v1/presenters/produto/ListaProduto.dto';
import { ProdutoModel } from '../../models/produto.model';
import { Repository } from 'typeorm';
import { AtualizaProdutoDTO } from '../../../inbound/rest/v1/presenters/produto/AtualizaProduto.dto';
import { IProdutoRepository } from 'src/domain/ports/produto/IProdutoRepository';

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
    const produtosSalvos = await this.produtoRepository.find();
    const produtosLista = produtosSalvos.map(
      (produto) =>
        new ListaProdutoDTO(
          produto.id,
          produto.nome,
          produto.descricao,
          produto.valorUnitario,
          produto.imagemUrl,
          produto.categoria,
          produto.ativo,
        ),
    );
    return produtosLista;
  }

  async listaProdutosPorCategoria(id_categoria: number) {
    const produtos = await this.produtoRepository.find({
      where: { categoria: { id: id_categoria } },
    });
    const produtosLista = produtos.map(
      (produto) =>
        new ListaProdutoDTO(
          produto.id,
          produto.nome,
          produto.descricao,
          produto.valorUnitario,
          produto.imagemUrl,
          produto.categoria,
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
}
