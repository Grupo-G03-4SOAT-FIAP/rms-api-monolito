import { Inject, Injectable } from '@nestjs/common';
import { HTTPResponse } from 'src/application/common/HTTPResponse';
import { ClienteEntity } from 'src/domain/cliente/entities/cliente.entity';
import {
  ClienteDuplicadoErro,
  ClienteNaoLocalizadoErro,
} from 'src/domain/cliente/exceptions/cliente.exception';
import { IClienteDTOFactory } from 'src/domain/cliente/interfaces/cliente.dto.factory.port';
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
    @Inject(IClienteDTOFactory)
    private readonly clienteDTOFactory: IClienteDTOFactory,
  ) {}

  async listarClientes(): Promise<ClienteDTO[] | []> {
    const listaClientes = await this.clienteRepository.listarClientes();
    const listaClientesDTO = this.clienteDTOFactory.criarListaClienteDTO(listaClientes);
    return listaClientesDTO;
  }

  async buscarClientePorId(idCliente: string): Promise<ClienteDTO> {
    const clienteEncontrado = await this.validarClientePorId(idCliente);
    const clienteDTO = this.clienteDTOFactory.criarClienteDTO(clienteEncontrado);
    return clienteDTO;
  }

  async buscarClientePorCPF(cpfCliente: string): Promise<ClienteDTO> {
    const clienteEncontrado = await this.clienteRepository.buscarClientePorCPF(cpfCliente);
    if (!clienteEncontrado) {
      throw new ClienteNaoLocalizadoErro('Cliente informado não existe');
    }
    const clienteDTO = this.clienteDTOFactory.criarClienteDTO(clienteEncontrado);
    return clienteDTO;
  }

  async criarCliente(
    criaClienteDTO: CriaClienteDTO,
  ): Promise<HTTPResponse<ClienteDTO>> {
    if (criaClienteDTO.email) {
      await this.validarClientePorEmail(criaClienteDTO.email);
    }
    if (criaClienteDTO.cpf) {
      await this.validarClientePorCPF(criaClienteDTO.cpf);
    }
    const cliente = new ClienteEntity(criaClienteDTO.nome, criaClienteDTO.email, criaClienteDTO.cpf);
    const clienteCriado = await this.clienteRepository.criarCliente(cliente);
    const clienteDTO = this.clienteDTOFactory.criarClienteDTO(clienteCriado);
    return {
      mensagem: 'Cliente criado com sucesso',
      body: clienteDTO,
    };
  }

  async editarCliente(
    idCliente: string,
    atualizaClienteDTO: AtualizaClienteDTO,
  ): Promise<HTTPResponse<ClienteDTO>> {
    await this.validarClientePorId(idCliente);
    if (atualizaClienteDTO.email) {
      await this.validarClientePorEmail(atualizaClienteDTO.email);
    }
    const cliente = new ClienteEntity(atualizaClienteDTO.nome, atualizaClienteDTO.email);
    const clienteEditado = await this.clienteRepository.editarCliente(
      idCliente,
      cliente,
    );
    const clienteDTO = this.clienteDTOFactory.criarClienteDTO(clienteEditado);
    return {
      mensagem: 'Cliente atualizado com sucesso',
      body: clienteDTO,
    };
  }

  async excluirCliente(
    idCliente: string,
  ): Promise<Omit<HTTPResponse<void>, 'body'>> {
    await this.validarClientePorId(idCliente);
    await this.clienteRepository.excluirCliente(idCliente);
    return {
      mensagem: 'Cliente excluído com sucesso',
    };
  }

  private async validarClientePorId(idCliente: string): Promise<ClienteEntity> {
    const clienteEncontrado = await this.clienteRepository.buscarClientePorId(idCliente);
    if (!clienteEncontrado) {
      throw new ClienteNaoLocalizadoErro('Cliente informado não existe');
    }
    return clienteEncontrado;
  }

  private async validarClientePorCPF(
    cpfCliente: string,
  ): Promise<ClienteEntity | null> {
    const clienteEncontrado =
      await this.clienteRepository.buscarClientePorCPF(cpfCliente);
    if (clienteEncontrado) {
      throw new ClienteDuplicadoErro('Existe um cliente com esse cpf');
    }
    return clienteEncontrado;
  }

  private async validarClientePorEmail(
    emailCliente: string,
  ): Promise<ClienteEntity | null> {
    const clienteEncontrado =
      await this.clienteRepository.buscarClientePorEmail(emailCliente);
    if (clienteEncontrado) {
      throw new ClienteDuplicadoErro('Existe um cliente com esse email');
    }
    return clienteEncontrado;
  }
}
