import { ToCapitalizeString } from '../value_objects/capitalize_string';

export class CategoriaEntity {
  nome: string;
  descricao?: string;
  id?: string;

  constructor(nome: string, descricao?: string, id?: string) {
    this.id = id;
    const capitalizedNome = new ToCapitalizeString(nome);
    this.nome = capitalizedNome.input;
    if (descricao) {
      const capitalizedDescricao = new ToCapitalizeString(descricao);
      this.descricao = capitalizedDescricao.input;
    }
  }
}
