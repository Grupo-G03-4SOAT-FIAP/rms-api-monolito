import { ToCapitalizeString } from '../value_objects/capitalize_string';
import { CPF } from '../value_objects/cpf';
export class ClienteEntity {
  nome: string;
  email: string;
  cpf?: string;
  id?: string;

  constructor(nome: string, email: string, cpf?: string, id?: string) {
    this.id = id;
    this.setNome = nome;
    this.email = email;
    const cpfIntancia = new CPF(cpf);
    this.cpf = cpfIntancia.getValue();
  }

  get getNome(): string {
    return this.nome;
  }
  set setNome(nome: string) {
    const capitalizedNome = new ToCapitalizeString(nome);
    this.nome = capitalizedNome.input;
  }

  get getCpf(): string {
    return this.cpf;
  }
  set setCpf(cpf: string) {
    this.cpf = cpf;
  }
}
