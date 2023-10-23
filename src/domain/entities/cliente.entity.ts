export class ClienteEntity {
  nome: string;
  email: string;
  cpf: string;
  id?: string;

  constructor(nome: string, email: string, cpf: string, id?: string) {
    this.id = id;
    this.nome = nome;
    this.email = email;
    this.cpf = cpf;
  }
}
