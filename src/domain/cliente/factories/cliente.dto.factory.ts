import { Injectable } from '@nestjs/common';
import { IClienteDTOFactory } from '../interfaces/cliente.dto.factory.port';
import { ClienteModel } from 'src/infrastructure/sql/models/cliente.model';
import { ClienteDTO } from 'src/presentation/rest/v1/presenters/cliente/cliente.dto';

@Injectable()
export class ClienteDTOFactory implements IClienteDTOFactory {
  criarClienteDTO(cliente: ClienteModel): ClienteDTO {
    const clienteDTO = new ClienteDTO();
    clienteDTO.id = cliente.id;
    clienteDTO.nome = cliente.nome;
    clienteDTO.email = cliente.email;
    clienteDTO.cpf = cliente.cpf;

    return clienteDTO;
  }

  criarListaClienteDTO(clientes: ClienteModel[]): ClienteDTO[] | [] {
    const listaClienteDTO = clientes.map((cliente: ClienteModel) => {
      const clienteDTO = new ClienteDTO();
      clienteDTO.id = cliente.id;
      clienteDTO.nome = cliente.nome;
      clienteDTO.email = cliente.email;
      clienteDTO.cpf = cliente.cpf;
      return clienteDTO;
    });
    return listaClienteDTO;
  }
}
