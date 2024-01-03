import { ClienteModel } from 'src/adapters/outbound/models/cliente.model';
import { ClienteEntity } from 'src/domain/entities/cliente.entity';

const clienteEntity = new ClienteEntity(
  'Jhon',
  'jhon@teste.com.br',
  '83904665030',
  '0a14aa4e-75e7-405f-8301-81f60646c93d',
);

const clienteModel = new ClienteModel();
clienteModel.id = '0a14aa4e-75e7-405f-8301-81f60646c93d';
clienteModel.nome = 'Jhon';
clienteModel.email = 'jhon@teste.com.br';
clienteModel.cpf = '83904665030';
clienteModel.criadoEm = new Date().toISOString();
clienteModel.atualizadoEm = new Date().toISOString();
clienteModel.excluidoEm = new Date().toISOString();

export { clienteEntity, clienteModel };
