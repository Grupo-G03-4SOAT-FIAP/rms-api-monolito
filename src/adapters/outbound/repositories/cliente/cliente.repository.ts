import { ClienteEntity } from 'src/domain/entities/cliente.entity';
import { IClienteRepository } from 'src/domain/ports/cliente/cliente.repository.port';
import { ClienteModel } from '../../models/cliente.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ClienteRepository implements IClienteRepository {
  constructor(
    @InjectRepository(ClienteModel)
    private readonly clienteRepository: Repository<ClienteModel>,
  ) {}

  async criarCliente(cliente: ClienteEntity): Promise<ClienteModel> {
    const novoCliente = this.clienteRepository.create(cliente);
    await this.clienteRepository.save(novoCliente);
    return novoCliente;
  }

  async listarClientes(): Promise<[] | ClienteModel[]> {
    return await this.clienteRepository.find();
  }

  async buscarClientePorId(clienteId: string): Promise<ClienteModel> {
    return await this.clienteRepository.findOne({ where: { id: clienteId } });
  }

  async buscarClientePorNome(clienteNome: string): Promise<ClienteModel> {
    return await this.clienteRepository.findOne({
      where: { nome: clienteNome },
    });
  }

  async editarCliente(
    clienteId: string,
    cliente: ClienteEntity,
  ): Promise<ClienteModel> {
    await this.clienteRepository.update(clienteId, cliente);
    return await this.clienteRepository.findOne({ where: { id: clienteId } });
  }

  async deletarCliente(clienteId: string): Promise<void> {
    await this.clienteRepository.softDelete({ id: clienteId });
  }
}
