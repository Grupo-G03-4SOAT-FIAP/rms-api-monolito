import { Test, TestingModule } from '@nestjs/testing';
import { ClienteEntityFactory } from './cliente.entity.factory';
import {
  clienteEntityMock,
  clienteEntityNotCpfMock,
  clienteEntityNotIdMock,
} from 'src/mocks/cliente.mock';

describe('ClienteEntityFactory', () => {
  let clienteEntityFactory: ClienteEntityFactory;
  let nome: string;
  let email: string;
  let cpf: string;
  let id: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClienteEntityFactory],
    }).compile();

    clienteEntityFactory =
      module.get<ClienteEntityFactory>(ClienteEntityFactory);
    nome = 'Jhon';
    email = 'jhon@teste.com.br';
    cpf = '83904665030';
    id = '0a14aa4e-75e7-405f-8301-81f60646c93d';
  });

  it('deve criar uma entidade cliente', () => {
    const result = clienteEntityFactory.criarEntidadeCliente(
      nome,
      email,
      cpf,
      id,
    );
    expect(result).toStrictEqual(clienteEntityMock);
  });

  it('deve criar uma entidade cliente sem id', () => {
    const result = clienteEntityFactory.criarEntidadeCliente(nome, email, cpf);
    expect(result).toStrictEqual(clienteEntityNotIdMock);
  });

  it('deve criar uma entidade cliente sem cpf', () => {
    const result = clienteEntityFactory.criarEntidadeCliente(nome, email);
    expect(result).toStrictEqual(clienteEntityNotCpfMock);
  });
});
