import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ClienteModel } from '../../models/cliente.model';
import { IClienteRepository } from 'src/domain/cliente/interfaces/cliente.repository.port';
import { ClienteEntity } from 'src/domain/cliente/entities/cliente.entity';
import { RepositoryDTO } from '../repository.dto';

@Injectable()
export class ClienteRepository implements IClienteRepository {
  constructor(
    private readonly repositoryDTO: RepositoryDTO,
    @InjectRepository(ClienteModel)
    private readonly clienteRepository: Repository<ClienteModel>,
  ) {}

  async criarCliente(cliente: ClienteEntity): Promise<ClienteEntity> {
    const clienteModel = this.clienteRepository.create(cliente);
    await this.clienteRepository.save(clienteModel);
    return this.repositoryDTO.criarClienteDTO(clienteModel);
  }

  async editarCliente(
    clienteId: string,
    cliente: ClienteEntity,
  ): Promise<ClienteEntity | null> {
    const clienteModel = this.clienteRepository.create(cliente);
    await this.clienteRepository.update(clienteId, clienteModel);
    const clienteModelAtualizado = await this.clienteRepository.findOne({
      where: { id: clienteId },
    });
    if (clienteModelAtualizado) {
      return this.repositoryDTO.criarClienteDTO(clienteModelAtualizado);
    }
    return null;
  }

  async excluirCliente(clienteId: string): Promise<void> {
    await this.clienteRepository.softDelete({ id: clienteId });
  }

  async buscarClientePorId(clienteId: string): Promise<ClienteEntity | null> {
    const clienteModel = await this.clienteRepository.findOne({
      where: { id: clienteId },
    });
    if (clienteModel) {
      return this.repositoryDTO.criarClienteDTO(clienteModel);
    }
    return null;
  }

  async buscarClientePorCPF(cpfCliente: string): Promise<ClienteEntity | null> {
    const clienteModel = await this.clienteRepository.findOne({
      where: { cpf: cpfCliente },
    });
    if (clienteModel) {
      return this.repositoryDTO.criarClienteDTO(clienteModel);
    }
    return null;
  }

  async buscarClientePorEmail(
    emailCliente: string,
  ): Promise<ClienteEntity | null> {
    const clienteModel = await this.clienteRepository.findOne({
      where: { email: emailCliente },
    });
    if (clienteModel) {
      return this.repositoryDTO.criarClienteDTO(clienteModel);
    }
    return null;
  }

  async listarClientes(): Promise<[] | ClienteEntity[]> {
    const listaClienteModel = await this.clienteRepository.find({});
    const clienteEntityList = listaClienteModel.map((cliente: ClienteModel) => {
      return this.repositoryDTO.criarClienteDTO(cliente);
    });

    return clienteEntityList;
  }
}
