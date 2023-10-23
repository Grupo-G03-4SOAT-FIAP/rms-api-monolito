import { ProdutoEntity } from './produto.entity';

export class CategoriaEntity {
  nome: string;
  descricao?: string;
  id?: string;
  produtos?: ProdutoEntity[];

  constructor(
    nome: string,
    descricao?: string,
    id?: string,
    ativo?: boolean,
    produtos?: ProdutoEntity[],
  ) {
    this.id = id;
    this.nome = nome;
    this.descricao = descricao;
    this.produtos = produtos;
  }
}
