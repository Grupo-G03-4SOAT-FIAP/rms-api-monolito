import { Repository } from 'typeorm';
import {
  ClienteDTO,
  CriaClienteDTO,
} from 'src/adapters/inbound/rest/v1/presenters/cliente.dto';
import { ClienteModel } from 'src/adapters/outbound/models/cliente.model';
import { ClienteEntity } from 'src/domain/entities/cliente/cliente.entity';

const clienteModelMock = new ClienteModel();
clienteModelMock.id = '0a14aa4e-75e7-405f-8301-81f60646c93d';
clienteModelMock.nome = 'Jhon';
clienteModelMock.email = 'jhon@teste.com.br';
clienteModelMock.cpf = '83904665030';
clienteModelMock.criadoEm = new Date().toISOString();
clienteModelMock.atualizadoEm = new Date().toISOString();
clienteModelMock.excluidoEm = new Date().toISOString();

const clienteEntityMock = new ClienteEntity(
  'Jhon',
  'jhon@teste.com.br',
  '83904665030',
);

const makeCriaClienteDTO = (
  nome: string,
  email: string,
  cpf?: string,
): CriaClienteDTO => {
  const criaClienteDTO = new CriaClienteDTO();
  criaClienteDTO.nome = nome;
  (criaClienteDTO.email = email), (criaClienteDTO.cpf = cpf);
  return criaClienteDTO;
};

const criaClienteDTOMock = makeCriaClienteDTO(
  'Jhon',
  'jhon@teste.com.br',
  '83904665030',
);

const makeClienteDTO = (
  id: string,
  nome: string,
  email: string,
  cpf: string,
): ClienteDTO => {
  const clienteDTO = new ClienteDTO();
  clienteDTO.id = id;
  clienteDTO.nome = nome;
  clienteDTO.email = email;
  clienteDTO.cpf = cpf;
  return clienteDTO;
};

const clienteDTOMock = makeClienteDTO(
  clienteModelMock.id,
  clienteModelMock.nome,
  clienteModelMock.email,
  clienteModelMock.cpf,
);

const clienteTypeORMMock: jest.Mocked<Repository<ClienteModel>> = {
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
} as Partial<jest.Mocked<Repository<ClienteModel>>> as jest.Mocked<
  Repository<ClienteModel>
>;

const clienteRepositoryMock = {
  criarCliente: jest.fn(),
  editarCliente: jest.fn(),
  excluirCliente: jest.fn(),
  buscarClientePorId: jest.fn(),
  buscarClientePorCPF: jest.fn(),
  buscarClientePorEmail: jest.fn(),
  listarClientes: jest.fn(),
};

const clienteDTOFactoryMock = {
  criarClienteDTO: jest.fn(),
  criarListaClienteDTO: jest.fn(),
};

export {
  clienteModelMock,
  clienteEntityMock,
  clienteDTOMock,
  clienteTypeORMMock,
  clienteRepositoryMock,
  clienteDTOFactoryMock,
  criaClienteDTOMock,
};
