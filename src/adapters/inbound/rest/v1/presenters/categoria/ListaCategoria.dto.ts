export class ListaCategoriaDTO {
  constructor(
    readonly id: number,
    readonly nome: string,
    readonly descricao: string,
    readonly ativo: boolean,
  ) {}
}
