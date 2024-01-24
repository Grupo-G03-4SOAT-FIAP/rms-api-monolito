import { HTTPResponse } from 'src/application/common/HTTPResponse';
import {
  AtualizaClienteDTO,
  ClienteDTO,
  CriaClienteDTO,
} from 'src/presentation/rest/v1/presenters/cliente/cliente.dto';

export interface IClienteUseCase {
  criarCliente(cliente: CriaClienteDTO): Promise<HTTPResponse<ClienteDTO>>;
  editarCliente(
    clienteId: string,
    cliente: AtualizaClienteDTO,
  ): Promise<HTTPResponse<ClienteDTO>>;
  excluirCliente(clienteId: string): Promise<Omit<HTTPResponse<void>, 'body'>>;
  buscarClientePorId(clienteId: string): Promise<ClienteDTO>;
  buscarClientePorCPF(cpfCliente: string): Promise<ClienteDTO>;
  listarClientes(): Promise<ClienteDTO[] | []>;
}

export const IClienteUseCase = Symbol('IClienteUseCase');
