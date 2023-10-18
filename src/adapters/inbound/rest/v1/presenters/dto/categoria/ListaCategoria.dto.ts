export class ListaCategoriaDTO {
  readonly id: number;
  readonly nome: string;
  readonly descricao: string;
  constructor(categoria: { id?: number; nome?: string; descricao?: string }) {
    this.id = categoria.id;
    this.nome = categoria.nome;
    this.descricao = categoria.descricao;
  }
}
