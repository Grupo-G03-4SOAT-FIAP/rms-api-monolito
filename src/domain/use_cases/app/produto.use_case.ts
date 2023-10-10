import { Injectable } from '@nestjs/common';
import { ProdutoService } from 'src/adapters/outbound/repositories/produto.service';
import { ProdutoEntity } from 'src/domain/entities/produto.entity';
import { CriaProdutoDTO } from 'src/adapters/outbound/models/dto/CriaProduto.dto';
import { AtualizaProdutoDTO } from 'src/adapters/outbound/models/dto/AtualizaProduto.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class ProdutoUseCase {
  constructor(private readonly produtoService: ProdutoService) {}

  async criaNovo(dadosProduto: CriaProdutoDTO) {
    const produto = new ProdutoEntity();

    produto.nome = dadosProduto.nome;
    produto.usuarioId = dadosProduto.usuarioId;
    produto.valor = dadosProduto.valor;
    produto.quantidade = dadosProduto.quantidade;
    produto.descricao = dadosProduto.descricao;
    produto.categoria = dadosProduto.categoria;
    produto.caracteristicas = dadosProduto.caracteristicas;
    produto.imagens = dadosProduto.imagens;

    const produtoCadastrado = this.produtoService.criaProduto(produto);
    return produtoCadastrado;
  }

  async listaTodos() {
    return this.produtoService.listProdutos();
  }

  async atualiza(id: string, dadosProduto: AtualizaProdutoDTO) {
    const produtoAlterado = await this.produtoService.atualizaProduto(
      id,
      dadosProduto,
    );

    return {
      mensagem: 'produto atualizado com sucesso',
      produto: produtoAlterado,
    };
  }

  async remove(id: string) {
    const produtoRemovido = await this.produtoService.deletaProduto(id);

    return {
      mensagem: 'produto removido com sucesso',
      produto: produtoRemovido,
    };
  }
}
