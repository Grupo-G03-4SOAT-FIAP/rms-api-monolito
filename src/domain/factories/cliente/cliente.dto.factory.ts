import { Injectable } from '@nestjs/common';
import { ClienteDTO } from 'src/adapters/inbound/rest/v1/presenters/cliente.dto';
import { ClienteModel } from 'src/adapters/outbound/models/cliente.model';
import { IClienteDTOFactory } from 'src/domain/ports/cliente/cliente.dto.factory.port';

@Injectable()
export class ClienteDTOFactory implements IClienteDTOFactory {
  async criarClienteDTO(cliente: ClienteModel): Promise<ClienteDTO> {
    const clienteDTO = new ClienteDTO();
    clienteDTO.id = cliente.id;
    clienteDTO.nome = cliente.nome;
    clienteDTO.email = cliente.email;
    clienteDTO.cpf = cliente.cpf;

    return clienteDTO;
  }

  async criarListaClienteDTO(
    clientes: ClienteModel[],
  ): Promise<ClienteDTO[] | []> {
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
