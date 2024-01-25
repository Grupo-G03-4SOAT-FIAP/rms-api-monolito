import { ClienteEntity } from 'src/domain/cliente/entities/cliente.entity';
import { ClienteModel } from 'src/infrastructure/sql/models/cliente.model';
import {
  AtualizaClienteDTO,
  ClienteDTO,
  CriaClienteDTO,
} from 'src/presentation/rest/v1/presenters/cliente/cliente.dto';
import { Repository } from 'typeorm';

// Mock para simular dados da tabela cliente no banco de dados
export const clienteModelMock = new ClienteModel();
clienteModelMock.id = '0a14aa4e-75e7-405f-8301-81f60646c93d';
clienteModelMock.nome = 'Jhon';
clienteModelMock.email = 'jhon@teste.com.br';
clienteModelMock.cpf = '83904665030';
clienteModelMock.criadoEm = new Date().toISOString();
clienteModelMock.atualizadoEm = new Date().toISOString();
clienteModelMock.excluidoEm = new Date().toISOString();

// Mock para simular dados da entidade cliente com todos itens
export const clienteEntityMock = new ClienteEntity(
  'Jhon',
  'jhon@teste.com.br',
  '83904665030',
  '0a14aa4e-75e7-405f-8301-81f60646c93d',
);

// Mock para simular dados da entidade cliente sem id
export const clienteEntityNotIdMock = new ClienteEntity(
  'Jhon',
  'jhon@teste.com.br',
  '83904665030',
);

// Mock para simular dados da entidade cliente sem cpf
export const clienteEntityNotCpfMock = new ClienteEntity(
  'Jhon',
  'jhon@teste.com.br',
);

// Mock para simular o DTO com os dados recebidos pelo usuario ao criar um cliente
export const criaClienteDTOMock = new CriaClienteDTO();
criaClienteDTOMock.nome = clienteModelMock.nome;
criaClienteDTOMock.email = clienteModelMock.email;
criaClienteDTOMock.cpf = clienteModelMock.cpf;

// Mock para simular o DTO com os dados recebidos pelo usuario ao atualizar um cliente
export const atualizaClienteDTOMock = new AtualizaClienteDTO();
atualizaClienteDTOMock.nome = clienteModelMock.nome;
atualizaClienteDTOMock.email = clienteModelMock.email;

// Mock para simular o DTO com os dados recebidos pelo usuario ao atualizar um cliente sem nome
export const atualizaClienteDTONomeNullMock = new AtualizaClienteDTO();
atualizaClienteDTONomeNullMock.nome = null;
atualizaClienteDTONomeNullMock.email = clienteModelMock.email;

// Mock para simular o DTO com dados de cliente enviados para o usuario ao responder uma requisição
export const clienteDTOMock = new ClienteDTO();
clienteDTOMock.id = clienteModelMock.id;
clienteDTOMock.nome = clienteModelMock.nome;
clienteDTOMock.email = clienteModelMock.email;
clienteDTOMock.cpf = clienteModelMock.cpf;

// Mock jest das funções do typeORM interagindo com a tabela cliente
export const clienteTypeORMMock: jest.Mocked<Repository<ClienteModel>> = {
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
} as Partial<jest.Mocked<Repository<ClienteModel>>> as jest.Mocked<
  Repository<ClienteModel>
>;

// Mock jest das funções do repository cliente
export const clienteRepositoryMock = {
  criarCliente: jest.fn(),
  editarCliente: jest.fn(),
  excluirCliente: jest.fn(),
  buscarClientePorId: jest.fn(),
  buscarClientePorCPF: jest.fn(),
  buscarClientePorEmail: jest.fn(),
  listarClientes: jest.fn(),
};

// Mock jest das funções da factory que cria entidade cliente
export const clienteEntityFactoryMock = {
  criarEntidadeCliente: jest.fn(),
};

// Mock jest das funções da factory que cria DTO cliente
export const clienteDTOFactoryMock = {
  criarClienteDTO: jest.fn(),
  criarListaClienteDTO: jest.fn(),
};

// Mock jest das funções do use case cliente
export const clienteUseCaseMock = {
  criarCliente: jest.fn(),
  editarCliente: jest.fn(),
  excluirCliente: jest.fn(),
  buscarClientePorId: jest.fn(),
  buscarClientePorCPF: jest.fn(),
  listarClientes: jest.fn(),
};
