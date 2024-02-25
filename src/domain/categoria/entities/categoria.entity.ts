import { ToCapitalizeString } from '../../../domain/common/utils/capitalize_string';

export class CategoriaEntity {
  private _nome: string;
  private _descricao?: string;
  private _id?: string;

  constructor(nome: string, descricao?: string, id?: string) {
    this.id = id;
    this.nome = nome;
    this.descricao = descricao;
  }

  get nome(): string {
    return this._nome;
  }

  set nome(nome: string) {
    const capitalizedNome = new ToCapitalizeString(nome);
    this._nome = capitalizedNome.input;
  }

  get descricao(): string | undefined {
    return this._descricao;
  }

  set descricao(descricao: string | undefined) {
    if (descricao) {
      const capitalizedDescricao = new ToCapitalizeString(descricao);
      this._descricao = capitalizedDescricao.input;
    }
  }

  get id(): string | undefined {
    return this._id;
  }

  set id(id: string | undefined) {
    this._id = id;
  }
}
