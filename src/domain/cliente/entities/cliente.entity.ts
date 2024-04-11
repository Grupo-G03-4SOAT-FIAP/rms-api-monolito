import { ToCapitalizeString } from 'src/domain/common/utils/capitalize_string';
import { CPF } from '../value_objects/cpf';

export class ClienteEntity {
  private _nome: string;
  private _email: string;
  private _cpf?: string;
  private _id?: string;

  constructor(nome: string, email: string, cpf?: string, id?: string) {
    this.id = id;
    this.nome = nome;
    this.email = email;
    this.cpf = cpf;
  }

  get nome(): string {
    return this._nome;
  }

  set nome(nome: string) {
    const capitalizedNome = new ToCapitalizeString(nome);
    this._nome = capitalizedNome.input;
  }

  get email(): string {
    return this._email;
  }

  set email(email: string) {
    this._email = email;
  }

  get cpf(): string | undefined {
    return this._cpf;
  }

  set cpf(cpf: string | undefined) {
    if (cpf) {
      const cpfObject = new CPF(cpf);
      this._cpf = cpfObject.getValue();
    }
  }

  get id(): string | undefined {
    return this._id;
  }

  set id(id: string | undefined) {
    this._id = id;
  }
}
