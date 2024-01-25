import { ClienteDTO } from 'src/presentation/rest/v1/presenters/cliente/cliente.dto';
import { ClienteEntity } from '../entities/cliente.entity';

export interface IClienteDTOFactory {
  criarClienteDTO(cliente: ClienteEntity): ClienteDTO;
  criarListaClienteDTO(clientes: ClienteEntity[]): ClienteDTO[] | [];
}

export const IClienteDTOFactory = Symbol('IClienteDTOFactory');
