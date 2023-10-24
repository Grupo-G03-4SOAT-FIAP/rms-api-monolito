import { CPF } from '../value_objects/cpf';
export class ClienteEntity {
  private _nome: string;
  email: string;
  private _cpf: string;
  id?: string;

  constructor(nome: string, email: string, cpf: string, id?: string) {
    this.id = id;
    this._nome = nome;
    this.email = email;
    const cpfIntancia = new CPF(cpf);
    this._cpf = cpfIntancia.getValue();
  }

  get nome(): string {
    return this._nome;
  }
  set nome(nome: string) {
    this._nome = this.toCapitalize(nome);
  }

  private toCapitalize(input: string): string {
    return input
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  get cpf(): string {
    return this._cpf;
  }
  set cpf(cpf: string) {
    this._cpf = cpf;
  }
}
