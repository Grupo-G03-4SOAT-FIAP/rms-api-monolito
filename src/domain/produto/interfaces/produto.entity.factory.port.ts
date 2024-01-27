import { ProdutoEntity } from '../entities/produto.entity';
import { CategoriaEntity } from 'src/domain/categoria/entities/categoria.entity';

export interface IProdutoEntityFactory {
  criarEntidadeProduto(
    nome: string,
    categoria: CategoriaEntity,
    valorUnitario: number,
    imagemUrl: string,
    descricao?: string,
    id?: string,
  ): ProdutoEntity;
}

export const IProdutoEntityFactory = Symbol('IProdutoEntityFactory');
