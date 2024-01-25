import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ClienteModel } from '../../models/cliente.model';
import { IClienteRepository } from 'src/domain/cliente/interfaces/cliente.repository.port';
import { ClienteEntity } from 'src/domain/cliente/entities/cliente.entity';

@Injectable()
export class ClienteRepository implements IClienteRepository {
  constructor(
    @InjectRepository(ClienteModel)
    private readonly clienteRepository: Repository<ClienteModel>,
  ) {}

  async criarCliente(cliente: ClienteEntity): Promise<ClienteModel> {
    const clienteModel = this.clienteRepository.create(cliente);
    await this.clienteRepository.save(clienteModel);
    return clienteModel;
  }

  async editarCliente(
    clienteId: string,
    cliente: ClienteEntity,
  ): Promise<ClienteModel> {
    const clienteModel = this.clienteRepository.create(cliente);
    await this.clienteRepository.update(clienteId, clienteModel);
    return await this.clienteRepository.findOne({ where: { id: clienteId } });
  }

  async excluirCliente(clienteId: string): Promise<void> {
    await this.clienteRepository.softDelete({ id: clienteId });
  }

  async buscarClientePorId(clienteId: string): Promise<ClienteModel> {
    return await this.clienteRepository.findOne({ where: { id: clienteId } });
  }

  async buscarClientePorCPF(cpfCliente: string): Promise<ClienteModel> {
    return await this.clienteRepository.findOne({
      where: { cpf: cpfCliente },
    });
  }

  async buscarClientePorEmail(emailCliente: string): Promise<ClienteModel> {
    return await this.clienteRepository.findOne({
      where: { email: emailCliente },
    });
  }

  async listarClientes(): Promise<[] | ClienteModel[]> {
    return await this.clienteRepository.find({});
  }
}