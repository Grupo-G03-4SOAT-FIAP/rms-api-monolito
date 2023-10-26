import {
  AtualizaClienteDTO,
  ClienteDTO,
  CriaClienteDTO,
} from 'src/adapters/inbound/rest/v1/presenters/cliente.dto';
import { HTTPResponse } from 'src/utils/HTTPResponse';

export interface IClienteUseCase {
  criarCliente(cliente: CriaClienteDTO): Promise<HTTPResponse<ClienteDTO>>;
  editarCliente(
    clienteId: string,
    cliente: AtualizaClienteDTO,
  ): Promise<HTTPResponse<ClienteDTO>>;
  excluirCliente(clienteId: string): Promise<Omit<HTTPResponse<void>, 'body'>>;
  buscarCliente(clienteId: string): Promise<ClienteDTO>;
  listarClientes(): Promise<ClienteDTO[] | []>;
}

export const IClienteUseCase = Symbol('IClienteUseCase');
