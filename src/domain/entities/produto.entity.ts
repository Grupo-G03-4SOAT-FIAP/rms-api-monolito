import { CategoriaEntity } from './categoria.entity';

export class ProdutoEntity {
  id: string;
  nome: string;
  descricao: string;
  categoria: CategoriaEntity;
  valorUnitario: number;
  imagemUrl: string;
  ativo: boolean;

  constructor(
    nome: string,
    categoria: CategoriaEntity,
    valorUnitario: number,
    imagemUrl: string,
    id?: string,
    descricao?: string,
    ativo?: boolean,
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
