/* istanbul ignore file */

import { Categoria } from './Categoria';

export class Produto {
  id: string;
  nome: string;
  descricao: string;
  categoria: Categoria;
  valorUnitario: number;
  imagemUrl: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  ativo: boolean;

  constructor(
    id: string,
    nome: string,
    descricao: string,
    categoria: Categoria,
    valorUnitario: number,
    imagemUrl: string,
    ativo: boolean = true,
  ) {
    this.id = id;
    this.nome = nome;
    this.descricao = descricao;
    this.categoria = categoria;
    this.valorUnitario = valorUnitario;
    this.imagemUrl = imagemUrl;
    this.ativo = ativo;
  }
}
