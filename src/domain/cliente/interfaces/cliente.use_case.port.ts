import { HTTPResponse } from 'src/application/common/HTTPResponse';
import {
  AtualizaClienteDTO,
  ClienteDTO,
  CriaClienteDTO,
} from 'src/presentation/rest/v1/presenters/cliente/cliente.dto';

export interface IClienteUseCase {
  listarClientes(): Promise<ClienteDTO[] | []>;
  buscarClientePorId(idCliente: string): Promise<ClienteDTO>;
  buscarClientePorCPF(cpfCliente: string): Promise<ClienteDTO>;
  criarCliente(criaClienteDTO: CriaClienteDTO): Promise<HTTPResponse<ClienteDTO>>;
  editarCliente(
    idCliente: string,
    atualizaClienteDTO: AtualizaClienteDTO,
  ): Promise<HTTPResponse<ClienteDTO>>;
  excluirCliente(idCliente: string): Promise<Omit<HTTPResponse<void>, 'body'>>;
}

export const IClienteUseCase = Symbol('IClienteUseCase');
