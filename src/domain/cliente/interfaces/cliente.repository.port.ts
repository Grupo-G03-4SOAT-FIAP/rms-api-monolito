import { ClienteEntity } from '../entities/cliente.entity';

export interface IClienteRepository {
  criarCliente(cliente: ClienteEntity): Promise<ClienteEntity>;
  editarCliente(
    clienteId: string,
    cliente: ClienteEntity,
  ): Promise<ClienteEntity | null>;
  excluirCliente(clienteId: string): Promise<void>;
  buscarClientePorId(clienteId: string): Promise<ClienteEntity | null>;
  buscarClientePorCPF(cpfCliente: string): Promise<ClienteEntity | null>;
  buscarClientePorEmail(emailCliente: string): Promise<ClienteEntity | null>;
  listarClientes(): Promise<ClienteEntity[] | []>;
}

export const IClienteRepository = Symbol('IClienteRepository');
