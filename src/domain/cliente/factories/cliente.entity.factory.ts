import { Injectable } from '@nestjs/common';
import { IClienteEntityFactory } from '../interfaces/cliente.entity.factory.port';
import { ClienteEntity } from '../entities/cliente.entity';

@Injectable()
export class ClienteEntityFactory implements IClienteEntityFactory {
  criarEntidadeCliente(
    nome: string,
    email: string,
    cpf?: string,
    id?: string,
  ): ClienteEntity {
    const clienteEntity = new ClienteEntity(nome, email, cpf, id);
    return clienteEntity;
  }
}
