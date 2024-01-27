import { Injectable } from '@nestjs/common';
import { IProdutoEntityFactory } from '../interfaces/produto.entity.factory.port';
import { ProdutoEntity } from '../entities/produto.entity';
import { CategoriaEntity } from 'src/domain/categoria/entities/categoria.entity';

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
