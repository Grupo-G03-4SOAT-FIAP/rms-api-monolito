export class CategoriaEntity {
  nome: string;
  descricao?: string;
  id?: string;

  constructor(nome: string, descricao?: string, id?: string) {
    this.id = id;
    this.nome = nome;
    this.descricao = descricao;
  }
}
