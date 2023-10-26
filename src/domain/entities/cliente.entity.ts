import { CPF } from '../value_objects/cpf';
export class ClienteEntity {
  nome: string;
  email: string;
  cpf?: string;
  id?: string;

  constructor(nome: string, email: string, cpf?: string, id?: string) {
    this.id = id;
    this.nome = nome;
    this.email = email;
    const cpfIntancia = new CPF(cpf);
    this.cpf = cpfIntancia.getValue();
  }

  get getNome(): string {
    return this.nome;
  }
  set setNome(nome: string) {
    this.nome = this.toCapitalize(nome);
  }

  private toCapitalize(input: string): string {
    return input
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  get getCpf(): string {
    return this.cpf;
  }
  set setCpf(cpf: string) {
    this.cpf = cpf;
  }
}
