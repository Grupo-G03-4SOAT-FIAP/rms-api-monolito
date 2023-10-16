interface IListaCategoria {
  id: number;
  nome: string;
  descricao: string;
}

export class ListaCategoriaDTO {
  readonly id: number;
  readonly nome: string;
  readonly descricao: string;
  constructor(categoria?: Partial<IListaCategoria>) {
    this.id = categoria?.id;
    this.nome = categoria?.nome;
    this.descricao = categoria?.descricao;
  }
}
