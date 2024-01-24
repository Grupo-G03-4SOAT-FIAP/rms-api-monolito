import { ClienteModel } from "src/infrastructure/sql/models/cliente.model";
import { ClienteDTO } from "src/presentation/rest/v1/presenters/cliente/cliente.dto";

export interface IClienteDTOFactory {
  criarClienteDTO(cliente: ClienteModel): ClienteDTO;
  criarListaClienteDTO(clientes: ClienteModel[]): ClienteDTO[] | [];
}

export const IClienteDTOFactory = Symbol('IClienteDTOFactory');
