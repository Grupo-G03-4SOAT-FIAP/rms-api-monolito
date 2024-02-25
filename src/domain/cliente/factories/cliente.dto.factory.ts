import { Injectable } from '@nestjs/common';
import { IClienteDTOFactory } from '../interfaces/cliente.dto.factory.port';
import { ClienteDTO } from '../../../presentation/rest/v1/presenters/cliente/cliente.dto';
import { ClienteEntity } from '../entities/cliente.entity';

@Injectable()
export class ClienteDTOFactory implements IClienteDTOFactory {
  criarClienteDTO(cliente: ClienteEntity): ClienteDTO {
    const clienteDTO = new ClienteDTO();
    clienteDTO.id = cliente.id;
    clienteDTO.nome = cliente.nome;
    clienteDTO.email = cliente.email;
    clienteDTO.cpf = cliente.cpf;
    return clienteDTO;
  }

  criarListaClienteDTO(clientes: ClienteEntity[]): ClienteDTO[] | [] {
    const listaClienteDTO = clientes.map((cliente: ClienteEntity) => {
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
