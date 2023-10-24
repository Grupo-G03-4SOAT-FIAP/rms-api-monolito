import { ClienteModel } from 'src/adapters/outbound/models/cliente.model';
import { HTTPResponse } from '../types/HTTPResponse';
import {
  AtualizaClienteDTO,
  ClienteDTO,
  CriaClienteDTO,
} from 'src/adapters/inbound/rest/v1/presenters/cliente.dto';

export interface IClienteUseCase {
  criarCliente(cliente: CriaClienteDTO): Promise<HTTPResponse<ClienteDTO>>;
  listarClientes(): Promise<ClienteDTO[] | []>;
  buscarCliente(clienteId: string): Promise<ClienteDTO>;
  editarCliente(
    clienteId: string,
    cliente: AtualizaClienteDTO,
  ): Promise<HTTPResponse<ClienteDTO>>;
  excluirCliente(clienteId: string): Promise<Omit<HTTPResponse<void>, 'body'>>;
}

export const IClienteUseCase = Symbol('IClienteUseCase');
