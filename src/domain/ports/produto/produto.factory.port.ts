import {
  AtualizaProdutoDTO,
  CriaProdutoDTO,
} from 'src/adapters/inbound/rest/v1/presenters/produto.dto';
import { CategoriaEntity } from 'src/domain/entities/categoria/categoria.entity';
import { ProdutoEntity } from 'src/domain/entities/produto/produto.entity';

export interface IProdutoFactory {
  criarEntidadeCategoria(categoriaId: string): Promise<CategoriaEntity>;
  criarEntidadeProduto(
    produto: CriaProdutoDTO | AtualizaProdutoDTO,
  ): Promise<ProdutoEntity>;
}

export const IProdutoFactory = Symbol('IProdutoFactory');
