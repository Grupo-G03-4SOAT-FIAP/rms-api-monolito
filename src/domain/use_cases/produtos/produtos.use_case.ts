import { Inject, Injectable } from '@nestjs/common';
import { ProdutoModel } from 'src/adapters/outbound/models/produto.model';
import { CriaProdutoDTO } from 'src/adapters/inbound/rest/v1/presenters/dto/produto/CriaProduto.dto';
import { AtualizaProdutoDTO } from 'src/adapters/inbound/rest/v1/presenters/dto/produto/AtualizaProduto.dto';
import { IProdutoUseCase } from 'src/domain/ports/produto/IProdutoUseCase';
import { IProdutoRepository } from 'src/domain/ports/produto/IProdutoRepository';

@Injectable()
export class ProdutoUseCase implements IProdutoUseCase {
  constructor(
    @Inject(IProdutoRepository)
    private readonly produtoRepository: IProdutoRepository,
  ) {}

  async criaNovo(dadosProduto: CriaProdutoDTO) {
    const produto = new ProdutoModel();

    produto.nome = dadosProduto.nome;
    produto.descricao = dadosProduto.descricao;
    produto.valorUnitario = dadosProduto.valorUnitario;
    produto.imagemUrl = dadosProduto.imagemUrl;
    produto.categoria = <any>{ id_categoria: dadosProduto.idCategoria };
    produto.ativo = dadosProduto.ativo;

    const produtoCadastrado = this.produtoRepository.criaProduto(produto);
    return produtoCadastrado;
  }

  async listaTodos() {
    return this.produtoRepository.listaProdutos();
  }

  async listaPorCategoria(categoriaId: string) {
    return await this.produtoRepository.listaProdutosPorCategoria(categoriaId);
  }

  async atualiza(id: string, dadosProduto: AtualizaProdutoDTO) {
    const produtoAlterado = await this.produtoRepository.atualizaProduto(
      id,
      dadosProduto,
    );

    return {
      mensagem: 'produto atualizado com sucesso',
      produto: produtoAlterado,
    };
  }

  async remove(id: string) {
    const produtoRemovido = await this.produtoRepository.deletaProduto(id);

    return {
      mensagem: 'produto removido com sucesso',
      produto: produtoRemovido,
    };
  }
}
