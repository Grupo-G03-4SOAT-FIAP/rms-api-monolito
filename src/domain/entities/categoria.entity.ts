import { ToCapitalizeString } from '../helpers/capitalize_string';

export class CategoriaEntity {
  nome: string;
  descricao?: string;
  id?: string;

  constructor(nome: string, descricao?: string, id?: string) {
    this.id = id;
    this.setNome = nome;
    this.setDescricao = descricao;
  }

  get getNome(): string {
    return this.nome;
  }

  set setNome(nome: string) {
    const capitalizedNome = new ToCapitalizeString(nome);
    this.nome = capitalizedNome.input;
  }

  get getDescricao(): string {
    return this.descricao;
  }

  set setDescricao(descricao: string) {
    const capitalizedDescricao = new ToCapitalizeString(descricao);
    this.descricao = capitalizedDescricao.input;
  }
}
