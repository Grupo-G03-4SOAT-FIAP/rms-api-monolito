import { ProdutoEntity } from './produto.entity';

export class CategoriaEntity {
  nome: string;
  descricao?: string;
  produtos?: ProdutoEntity[];
  id?: string;

  constructor(
    nome: string,
    descricao?: string,
    produtos?: ProdutoEntity[],
    id?: string,
  ) {
    this.id = id;
    this.nome = nome;
    this.descricao = descricao;
    this.produtos = produtos;
  }
}
