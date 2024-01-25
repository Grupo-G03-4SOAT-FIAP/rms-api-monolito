import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { ClienteModel } from '../../models/cliente.model';
import { IClienteRepository } from 'src/domain/cliente/interfaces/cliente.repository.port';
import { ClienteEntity } from 'src/domain/cliente/entities/cliente.entity';
import { IClienteEntityFactory } from 'src/domain/cliente/interfaces/cliente.entity.factory.port';

@Injectable()
export class ClienteRepository implements IClienteRepository {
  constructor(
    @InjectRepository(ClienteModel)
    private readonly clienteRepository: Repository<ClienteModel>,
    @Inject(IClienteEntityFactory)
    private readonly clienteEntityFactory: IClienteEntityFactory,
  ) {}

  async criarCliente(cliente: ClienteEntity): Promise<ClienteEntity> {
    const clienteModel = this.clienteRepository.create(cliente);
    await this.clienteRepository.save(clienteModel);
    return this.clienteEntityFactory.criarEntidadeCliente(
      clienteModel.nome,
      clienteModel.email,
      clienteModel.cpf,
      clienteModel.id,
    );
  }

  async editarCliente(
    clienteId: string,
    cliente: ClienteEntity,
  ): Promise<ClienteEntity | null> {
    const clienteModel = this.clienteRepository.create(cliente);
    await this.clienteRepository.update(clienteId, clienteModel);
    const clienteModelEditado = await this.clienteRepository.findOne({
      where: { id: clienteId },
    });
    if (clienteModel) {
      return this.clienteEntityFactory.criarEntidadeCliente(
        clienteModelEditado.nome,
        clienteModelEditado.email,
        clienteModelEditado.cpf,
        clienteModelEditado.id,
      );
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
      return this.clienteEntityFactory.criarEntidadeCliente(
        clienteModel.nome,
        clienteModel.email,
        clienteModel.cpf,
        clienteModel.id,
      );
    }
    return null;
  }

  async buscarClientePorCPF(cpfCliente: string): Promise<ClienteEntity | null> {
    const clienteModel = await this.clienteRepository.findOne({
      where: { cpf: cpfCliente },
    });
    if (clienteModel) {
      return this.clienteEntityFactory.criarEntidadeCliente(
        clienteModel.nome,
        clienteModel.email,
        clienteModel.cpf,
        clienteModel.id,
      );
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
      return this.clienteEntityFactory.criarEntidadeCliente(
        clienteModel.nome,
        clienteModel.email,
        clienteModel.cpf,
        clienteModel.id,
      );
    }
    return null;
  }

  async listarClientes(): Promise<[] | ClienteEntity[]> {
    const listaClienteModel = await this.clienteRepository.find({});
    const listaClienteEntity = listaClienteModel.map(
      (cliente: ClienteModel) => {
        return this.clienteEntityFactory.criarEntidadeCliente(
          cliente.nome,
          cliente.email,
          cliente.cpf,
          cliente.id,
        );
      },
    );

    return listaClienteEntity;
  }
}
