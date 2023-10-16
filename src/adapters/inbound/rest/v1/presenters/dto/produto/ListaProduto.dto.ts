import { CategoriaModel } from 'src/adapters/outbound/models/categoria.model';

export class ListaProdutoDTO {
  constructor(
    readonly id: string,
    readonly nome: string,
    readonly descricao: string,
    readonly valorUnitario: number,
    readonly imagemUrl: string,
    readonly idCategoria: CategoriaModel,
    readonly ativo: boolean,
  ) {}
}
