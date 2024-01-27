import { Injectable } from '@nestjs/common';
import { CategoriaEntity } from 'src/domain/categoria/entities/categoria.entity';
import { ProdutoEntity } from 'src/domain/produto/entities/produto.entity';
import { IProdutoEntityFactory } from 'src/domain/produto/interfaces/produto.entity.factory.port';

@Injectable()
export class ProdutoEntityFactory implements IProdutoEntityFactory {
  criarEntidadeProduto(
    nome: string,
    categoria: CategoriaEntity,
    valorUnitario: number,
    imagemUrl: string,
    descricao?: string,
    id?: string,
  ): ProdutoEntity {
    const produtoEntity = new ProdutoEntity(
      nome,
      categoria,
      valorUnitario,
      imagemUrl,
      descricao,
      id,
    );
    return produtoEntity;
  }
}
