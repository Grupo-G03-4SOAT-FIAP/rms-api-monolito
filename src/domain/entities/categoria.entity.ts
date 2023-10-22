import { ProdutoEntity } from './produto.entity';

export class CategoriaEntity {
  id: string;
  nome: string;
  descricao: string;
  ativo: boolean;
  produtos: ProdutoEntity[];

  constructor(
    nome: string,
    id?: string,
    descricao?: string,
    ativo?: boolean,
    produtos?: ProdutoEntity[],
  ) {
    this.id = id;
    this.nome = nome;
    this.descricao = descricao;
    this.ativo = ativo;
    this.produtos = produtos;
  }
}
