import { CategoriaEntity } from './categoria.entity';

export class ProdutoEntity {
  nome: string;
  categoria: CategoriaEntity;
  valorUnitario: number;
  imagemUrl: string;
  descricao?: string;
  id?: string;

  constructor(
    nome: string,
    categoria: CategoriaEntity,
    valorUnitario: number,
    imagemUrl: string,
    descricao?: string,
    id?: string,
  ) {
    this.id = id;
    this.nome = nome;
    this.descricao = descricao;
    this.categoria = categoria;
    this.valorUnitario = valorUnitario;
    this.imagemUrl = imagemUrl;
  }
}
