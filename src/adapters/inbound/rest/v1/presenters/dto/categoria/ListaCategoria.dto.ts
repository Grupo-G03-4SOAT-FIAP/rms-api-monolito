interface IListaCategoria {
  id: string;
  nome: string;
  descricao: string;
}

export class ListaCategoriaDTO {
  readonly id: string;
  readonly nome: string;
  readonly descricao: string;
  constructor(categoria?: Partial<IListaCategoria>) {
    this.id = categoria?.id;
    this.nome = categoria?.nome;
    this.descricao = categoria?.descricao;
  }
}
