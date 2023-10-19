/* istanbul ignore file */

import { ProdutoEntity } from './produto.entity';

export class CategoriaEntity {
  id: string;
  nome: string;
  descricao: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  produtos: ProdutoEntity[];
  ativo: boolean;

  constructor(
    id?: string,
    nome?: string,
    descricao?: string,
    ativo: boolean = true,
  ) {
    this.id = id;
    this.nome = nome;
    this.descricao = descricao;
    this.ativo = ativo;
  }
}
