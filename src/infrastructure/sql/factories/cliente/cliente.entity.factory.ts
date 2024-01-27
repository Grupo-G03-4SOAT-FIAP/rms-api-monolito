import { Injectable } from '@nestjs/common';
import { ClienteEntity } from 'src/domain/cliente/entities/cliente.entity';
import { IClienteEntityFactory } from 'src/domain/cliente/interfaces/cliente.entity.factory.port';

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
