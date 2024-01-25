import { Inject, Injectable } from '@nestjs/common';
import { HTTPResponse } from 'src/application/common/HTTPResponse';
import { ClienteEntity } from 'src/domain/cliente/entities/cliente.entity';
import {
  ClienteDuplicadoErro,
  ClienteNaoLocalizadoErro,
  ClienteNomeUndefinedErro,
} from 'src/domain/cliente/exceptions/cliente.exception';
import { IClienteDTOFactory } from 'src/domain/cliente/interfaces/cliente.dto.factory.port';
import { IClienteEntityFactory } from 'src/domain/cliente/interfaces/cliente.entity.factory.port';
import { IClienteRepository } from 'src/domain/cliente/interfaces/cliente.repository.port';
import { IClienteUseCase } from 'src/domain/cliente/interfaces/cliente.use_case.port';
import {
  AtualizaClienteDTO,
  ClienteDTO,
  CriaClienteDTO,
} from 'src/presentation/rest/v1/presenters/cliente/cliente.dto';

@Injectable()
export class ClienteUseCase implements IClienteUseCase {
  constructor(
    @Inject(IClienteRepository)
    private readonly clienteRepository: IClienteRepository,
    @Inject(IClienteEntityFactory)
    private readonly clienteEntityFactory: IClienteEntityFactory,
    @Inject(IClienteDTOFactory)
    private readonly clienteDTOFactory: IClienteDTOFactory,
  ) {}

  private async validarClientePorId(clienteId: string): Promise<ClienteEntity> {
    const cliente = await this.clienteRepository.buscarClientePorId(clienteId);
    if (!cliente) {
      throw new ClienteNaoLocalizadoErro('Cliente informado não existe');
    }
    return cliente;
  }

  private async validarClientePorCPF(
    cpfCliente: string,
  ): Promise<ClienteEntity | null> {
    const cliente =
      await this.clienteRepository.buscarClientePorCPF(cpfCliente);
    if (cliente) {
      throw new ClienteDuplicadoErro('Existe um cliente com esse cpf');
    }
    return cliente;
  }

  private async validarClientePorEmail(
    emailCliente: string,
  ): Promise<ClienteEntity | null> {
    const cliente =
      await this.clienteRepository.buscarClientePorEmail(emailCliente);
    if (cliente) {
      throw new ClienteDuplicadoErro('Existe um cliente com esse email');
    }
    return cliente;
  }

  async criarCliente(
    cliente: CriaClienteDTO,
  ): Promise<HTTPResponse<ClienteDTO>> {
    const { nome, email, cpf } = cliente;

    if (email) {
      await this.validarClientePorEmail(email);
    }

    if (cpf) {
      await this.validarClientePorCPF(cpf);
    }

    const clienteEntity = this.clienteEntityFactory.criarEntidadeCliente(
      nome,
      email,
      cpf,
    );
    const result = await this.clienteRepository.criarCliente(clienteEntity);
    const clienteDTO = this.clienteDTOFactory.criarClienteDTO(result);

    return {
      mensagem: 'Cliente criado com sucesso',
      body: clienteDTO,
    };
  }

  async editarCliente(
    clienteId: string,
    cliente: AtualizaClienteDTO,
  ): Promise<HTTPResponse<ClienteDTO>> {
    const { nome, email } = cliente;

    if (nome == null) {
      throw new ClienteNomeUndefinedErro('Nome não pode ser nulo');
    }

    await this.validarClientePorId(clienteId);

    if (email) {
      await this.validarClientePorEmail(email);
    }

    const clienteEntity = this.clienteEntityFactory.criarEntidadeCliente(
      nome,
      email,
    );
    const result = await this.clienteRepository.editarCliente(
      clienteId,
      clienteEntity,
    );
    const clienteDTO = this.clienteDTOFactory.criarClienteDTO(result);

    return {
      mensagem: 'Cliente atualizado com sucesso',
      body: clienteDTO,
    };
  }

  async excluirCliente(
    clienteId: string,
  ): Promise<Omit<HTTPResponse<void>, 'body'>> {
    await this.validarClientePorId(clienteId);
    await this.clienteRepository.excluirCliente(clienteId);
    return {
      mensagem: 'Cliente excluído com sucesso',
    };
  }

  async buscarClientePorId(clienteId: string): Promise<ClienteDTO> {
    const result = await this.validarClientePorId(clienteId);
    const clienteDTO = this.clienteDTOFactory.criarClienteDTO(result);
    return clienteDTO;
  }

  async buscarClientePorCPF(cpfCliente: string): Promise<ClienteDTO> {
    const result = await this.clienteRepository.buscarClientePorCPF(cpfCliente);
    if (!result) {
      throw new ClienteNaoLocalizadoErro('Cliente informado não existe');
    }
    const clienteDTO = this.clienteDTOFactory.criarClienteDTO(result);
    return clienteDTO;
  }

  async listarClientes(): Promise<ClienteDTO[] | []> {
    const result = await this.clienteRepository.listarClientes();
    const listaClienteDTO = this.clienteDTOFactory.criarListaClienteDTO(result);
    return listaClienteDTO;
  }
}
