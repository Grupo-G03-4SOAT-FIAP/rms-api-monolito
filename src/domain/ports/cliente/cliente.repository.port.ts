import { ClienteModel } from 'src/adapters/outbound/models/cliente.model';
import { ClienteEntity } from 'src/domain/entities/cliente.entity';

export interface IClienteRepository {
  criarCliente(cliente: ClienteEntity): Promise<ClienteModel>;
  listarClientes(): Promise<ClienteModel[] | []>;
  buscarClientePorId(clienteId: string): Promise<ClienteModel | null>;
  buscarClientePorNome(clienteNome: string): Promise<ClienteModel | null>;
  editarCliente(
    clienteId: string,
    cliente: ClienteEntity,
  ): Promise<ClienteModel | null>;
  deletarCliente(clienteId: string): Promise<void>;
}

export const IClienteRepository = Symbol('IClienteRepository');
