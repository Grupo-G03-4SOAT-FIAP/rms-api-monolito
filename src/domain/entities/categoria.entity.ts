/* istanbul ignore file */

import { ProdutoEntity } from './produto.entity';

export class CategoriaEntity {
  id: string;
  nome: string;
  descricao: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  ativo: boolean;
  produtos: Produto[];
  constructor(categoria: {
    id?: number;
    nome?: string;
    descricao?: string;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
    ativo?: boolean;
    produtos?: Produto[];
  }) {
    this.id = categoria?.id;
    this.nome = categoria?.nome;
    this.descricao = categoria?.descricao;
    this.ativo = categoria?.ativo;
    this.createdAt = categoria?.createdAt;
    this.updatedAt = categoria?.updatedAt;
    this.deletedAt = categoria?.deletedAt;
    this.produtos = categoria?.produtos;
  }
}
