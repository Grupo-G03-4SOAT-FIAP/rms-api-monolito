import { ClienteEntity } from '../entities/cliente.entity';

export interface IClienteEntityFactory {
  criarEntidadeCliente(
    nome: string,
    email: string,
    cpf?: string,
    id?: string,
  ): ClienteEntity;
}

export const IClienteEntityFactory = Symbol('IClienteEntityFactory');
