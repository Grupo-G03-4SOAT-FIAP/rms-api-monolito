import { ClienteEntity } from './cliente.entity';

describe('ClienteEntity', () => {
  let nome: string;
  let email: string;
  let cpf: string;
  let id: string;

  beforeEach(() => {
    nome = 'jhon';
    email = 'jhon@teste.com.br';
    cpf = '83904665030';
    id = '0a14aa4e-75e7-405f-8301-81f60646c93d';
  });

  it('Deve criar uma instância de ClienteEntity', () => {
    const cliente = new ClienteEntity(nome, email, cpf, id);

    expect(cliente.nome).toEqual('Jhon');
    expect(cliente.email).toEqual(email);
    expect(cliente.cpf).toEqual(cpf);
    expect(cliente.id).toEqual(id);
  });

  it('Deve criar uma instância de ClienteEntity', () => {
    const cliente = new ClienteEntity(nome, email);

    expect(cliente.nome).toEqual('Jhon');
    expect(cliente.email).toEqual(email);
    expect(cliente.cpf).toBeUndefined();
    expect(cliente.id).toBeUndefined();
  });
});
