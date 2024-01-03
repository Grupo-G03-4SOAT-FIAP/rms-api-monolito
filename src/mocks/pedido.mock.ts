import { PedidoModel } from 'src/adapters/outbound/models/pedido.model';
import { PedidoEntity } from 'src/domain/entities/pedido.entity';
import { Repository } from 'typeorm';
import { StatusPedido } from '../utils/pedido.enum';
import { produtoEntity, produtoModel } from './produto.mock';
import { clienteEntity } from './cliente.mock';

const pedidoEntity = new PedidoEntity(
  [produtoEntity],
  StatusPedido.RECEBIDO,
  '123456',
  clienteEntity,
  '0a14aa4e-75e7-405f-8301-81f60646c93d',
);

const pedidoModel = new PedidoModel();
pedidoModel.id = '0a14aa4e-75e7-405f-8301-81f60646c93d';
pedidoModel.numeroPedido = '123456';
pedidoModel.itensPedido = [produtoModel];
pedidoModel.cliente = null;
pedidoModel.statusPedido = 'recebido';
pedidoModel.criadoEm = new Date().toISOString();
pedidoModel.atualizadoEm = new Date().toISOString();

const pedidoRepositoryMock: jest.Mocked<Repository<PedidoModel>> = {
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
} as Partial<jest.Mocked<Repository<PedidoModel>>> as jest.Mocked<
  Repository<PedidoModel>
>;

export { pedidoEntity, pedidoModel, pedidoRepositoryMock };
