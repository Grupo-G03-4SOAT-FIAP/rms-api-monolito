import { Inject, Injectable } from '@nestjs/common';
import {
  CriaClienteDTO,
  ClienteDTO,
  AtualizaClienteDTO,
} from 'src/adapters/inbound/rest/v1/presenters/cliente.dto';
import { ClienteModel } from 'src/adapters/outbound/models/cliente.model';
import { ClienteEntity } from 'src/domain/entities/cliente.entity';
import {
  ClienteNaoLocalizadoErro,
  NomeClienteDuplicadoErro,
} from 'src/domain/exceptions/cliente.exception';
import { IClienteRepository } from 'src/domain/ports/cliente/cliente.repository.port';
import { IClienteUseCase } from 'src/domain/ports/cliente/cliente.use_case.port';
import { HTTPResponse } from 'src/utils/HTTPResponse';

@Injectable()
export class ClienteUseCase implements IClienteUseCase {
  constructor(
    @Inject(IClienteRepository)
    private readonly clienteRepository: IClienteRepository,
  ) {}

  async criarCliente(
    cliente: CriaClienteDTO,
  ): Promise<HTTPResponse<ClienteDTO>> {
    const { nome, email, cpf } = cliente;

    const buscaCliente =
      await this.clienteRepository.buscarClientePorNome(nome);
    if (buscaCliente) {
      throw new NomeClienteDuplicadoErro('Existe um cliente com esse nome');
    }

    const clienteEntity = new ClienteEntity(nome, email, cpf);
    const result = await this.clienteRepository.criarCliente(clienteEntity);

    const clienteDTO = new ClienteDTO();
    clienteDTO.id = result.id;
    clienteDTO.nome = result.nome;
    clienteDTO.cpf = result.cpf;

    return {
      mensagem: 'Cliente criado com sucesso',
      body: clienteDTO,
    };
  }

  async listarClientes(): Promise<ClienteDTO[] | []> {
    const result = await this.clienteRepository.listarClientes();
    const listaClientesDTO = result.map((cliente: ClienteModel) => {
      const clienteDTO = new ClienteDTO();
      clienteDTO.id = cliente.id;
      clienteDTO.nome = cliente.nome;
      clienteDTO.email = cliente.email;
      clienteDTO.cpf = cliente.cpf;
      return clienteDTO;
    });
    return listaClientesDTO;
  }

  async buscarCliente(clienteId: string): Promise<ClienteDTO> {
    const result = await this.clienteRepository.buscarClientePorId(clienteId);
    if (!result) {
      throw new ClienteNaoLocalizadoErro('Cliente informado não existe');
    }

    const clienteDTO = new ClienteDTO();
    clienteDTO.id = result.id;
    clienteDTO.nome = result.nome;
    clienteDTO.email = result.email;
    clienteDTO.cpf = result.cpf;

    return clienteDTO;
  }

  async editarCliente(
    clienteId: string,
    cliente: AtualizaClienteDTO,
  ): Promise<HTTPResponse<ClienteDTO>> {
    const { nome, email, cpf } = cliente;

    const buscaClientePorNome =
      await this.clienteRepository.buscarClientePorNome(nome);
    if (buscaClientePorNome) {
      throw new NomeClienteDuplicadoErro('Existe uma cliente com esse nome');
    }

    const buscaClientePorId =
      await this.clienteRepository.buscarClientePorId(clienteId);
    if (!buscaClientePorId) {
      throw new ClienteNaoLocalizadoErro('Cliente informado não existe');
    }

    const clienteEntity = new ClienteEntity(nome, email, cpf);
    const result = await this.clienteRepository.editarCliente(
      clienteId,
      clienteEntity,
    );

    const clienteDTO = new ClienteDTO();
    clienteDTO.id = result.id;
    clienteDTO.nome = result.nome;
    clienteDTO.email = result.email;
    clienteDTO.cpf = result.cpf;

    return {
      mensagem: 'Cliente atualizada com sucesso',
      body: clienteDTO,
    };
  }

  async excluirCliente(
    clienteId: string,
  ): Promise<Omit<HTTPResponse<void>, 'body'>> {
    const buscarCliente =
      await this.clienteRepository.buscarClientePorId(clienteId);
    if (!buscarCliente) {
      throw new ClienteNaoLocalizadoErro('Cliente informado não existe');
    }

    await this.clienteRepository.deletarCliente(clienteId);
    return {
      mensagem: 'Cliente excluido com sucesso',
    };
  }
}
