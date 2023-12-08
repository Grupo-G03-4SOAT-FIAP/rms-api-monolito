import { CriaProdutoDTO } from 'src/adapters/inbound/rest/v1/presenters/produto.dto';
import { ProdutoEntity } from 'src/domain/entities/produto.entity';

export interface IProdutoFactory {
  criarEntidadeProduto(pedido: CriaProdutoDTO): Promise<ProdutoEntity>;
}

export const IProdutoFactory = Symbol('IProdutoFactory');
