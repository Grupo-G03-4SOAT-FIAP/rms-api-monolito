import { AtualizaProdutoDTO, CriaProdutoDTO } from 'src/adapters/inbound/rest/v1/presenters/produto.dto';
import { ProdutoEntity } from 'src/domain/entities/produto.entity';

export interface IProdutoFactory {
  criarEntidadeProdutoFromCriaProdutoDTO(pedido: CriaProdutoDTO): Promise<ProdutoEntity>;
  criarEntidadeProdutoFromAtualizaProdutoDTO(produtoId: string, atualizaProdutoDTO: AtualizaProdutoDTO): Promise<ProdutoEntity>
}

export const IProdutoFactory = Symbol('IProdutoFactory');
