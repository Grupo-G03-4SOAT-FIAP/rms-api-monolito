import { ClienteDTO } from 'src/adapters/inbound/rest/v1/presenters/cliente.dto';
import { ClienteModel } from 'src/adapters/outbound/models/cliente.model';
import { ClienteEntity } from 'src/domain/entities/cliente.entity';

const clienteModel = new ClienteModel();
clienteModel.id = '0a14aa4e-75e7-405f-8301-81f60646c93d';
clienteModel.nome = 'Jhon';
clienteModel.email = 'jhon@teste.com.br';
clienteModel.cpf = '83904665030';
clienteModel.criadoEm = new Date().toISOString();
clienteModel.atualizadoEm = new Date().toISOString();
clienteModel.excluidoEm = new Date().toISOString();

const clienteEntity = new ClienteEntity(
  'Jhon',
  'jhon@teste.com.br',
  '83904665030',
  '0a14aa4e-75e7-405f-8301-81f60646c93d',
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

const clienteDTO = makeClienteDTO(
  '0a14aa4e-75e7-405f-8301-81f60646c93d',
  'Jhon',
  'jhon@teste.com.br',
  '83904665030',
);

export { clienteModel, clienteEntity, clienteDTO };
