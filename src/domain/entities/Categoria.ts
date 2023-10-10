/* istanbul ignore file */

import { Produto } from './Produto';

export class Categoria {
  id: number;
  nome: string;
  descricao: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  produtos: Produto[];
  ativo: boolean;

  constructor(
    id?: number,
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
