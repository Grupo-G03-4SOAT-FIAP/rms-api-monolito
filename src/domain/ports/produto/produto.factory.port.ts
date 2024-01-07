import {
  AtualizaProdutoDTO,
  CriaProdutoDTO,
} from 'src/adapters/inbound/rest/v1/presenters/produto.dto';
import { CategoriaModel } from 'src/adapters/outbound/models/categoria.model';
import { ProdutoEntity } from 'src/domain/entities/produto/produto.entity';

export interface IProdutoFactory {
  criarEntidadeProdutoFromCriaProdutoDTO(
    categoria: CategoriaModel,
    criaProdutoDTO: CriaProdutoDTO,
  ): Promise<ProdutoEntity>;
  criarEntidadeProdutoFromAtualizaProdutoDTO(
    categoria: CategoriaModel,
    atualizaProdutoDTO: AtualizaProdutoDTO,
  ): Promise<ProdutoEntity>;
}

export const IProdutoFactory = Symbol('IProdutoFactory');
