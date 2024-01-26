import { ProdutoEntity } from '../entities/produto.entity';
import { CategoriaEntity } from 'src/domain/categoria/entities/categoria.entity';
import { ProdutoModel } from 'src/infrastructure/sql/models/produto.model';
import { CategoriaModel } from 'src/infrastructure/sql/models/categoria.model';

export interface IProdutoEntityFactory {
  criarEntidadeCategoria(categoriaModel: CategoriaModel): CategoriaEntity;
  criarEntidadeProduto(produtoModel: ProdutoModel): ProdutoEntity;
}

export const IProdutoEntityFactory = Symbol('IProdutoEntityFactory');
