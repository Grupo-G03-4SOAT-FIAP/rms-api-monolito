import { PedidoModel } from 'src/adapters/outbound/models/pedido.model';
import { PedidoEntity } from 'src/domain/entities/pedido/pedido.entity';
import { Repository } from 'typeorm';
import { StatusPedido } from '../utils/pedido.enum';
import { produtoEntity, produtoModel } from './produto.mock';
import { clienteModel, clienteEntity } from './cliente.mock';
import {
  AtualizaPedidoDTO,
  CriaPedidoDTO,
  PedidoDTO,
} from 'src/adapters/inbound/rest/v1/presenters/pedido.dto';
import { ClienteDTO } from 'src/adapters/inbound/rest/v1/presenters/cliente.dto';
import { ProdutoDTO } from 'src/adapters/inbound/rest/v1/presenters/produto.dto';

const pedidoModel = new PedidoModel();
pedidoModel.id = '0a14aa4e-75e7-405f-8301-81f60646c93d';
pedidoModel.numeroPedido = '05012024';
pedidoModel.itensPedido = [produtoModel];
pedidoModel.cliente = clienteModel;
pedidoModel.statusPedido = 'recebido';
pedidoModel.criadoEm = new Date().toISOString();
pedidoModel.atualizadoEm = new Date().toISOString();

const pedidoEntity = new PedidoEntity(
  [produtoEntity],
  StatusPedido.RECEBIDO,
  '05012024',
  clienteEntity,
  '0a14aa4e-75e7-405f-8301-81f60646c93d',
);

const makeCriaPedidoDTO = (
  itensPedido: string[],
  cpfCliente?: string,
): CriaPedidoDTO => {
  const criaPedidoDTO = new CriaPedidoDTO();
  criaPedidoDTO.itensPedido = itensPedido;
  criaPedidoDTO.cpfCliente = cpfCliente;
  return criaPedidoDTO;
};

const criaPedidoDTO = makeCriaPedidoDTO(
  ['0a14aa4e-75e7-405f-8301-81f60646c93d'],
  '83904665030',
);

const makeAtualizaPedidoDTO = (
  statusPedido: StatusPedido,
): AtualizaPedidoDTO => {
  const atualizaPedidoDTO = new AtualizaPedidoDTO();
  atualizaPedidoDTO.statusPedido = statusPedido;
  return atualizaPedidoDTO;
};

const atualizaPedidoDTO = makeAtualizaPedidoDTO(StatusPedido.RECEBIDO);

const makePedidoDTO = (
  id: string,
  numeroPedido: string,
  itensPedido: ProdutoDTO[],
  statusPedido: string,
  cliente: ClienteDTO,
): PedidoDTO => {
  const pedidoDTO = new PedidoDTO();
  pedidoDTO.id = id;
  pedidoDTO.numeroPedido = numeroPedido;
  pedidoDTO.itensPedido = itensPedido;
  pedidoDTO.statusPedido = statusPedido;
  pedidoDTO.cliente = cliente;
  return pedidoDTO;
};

const pedidoDTO = makePedidoDTO(
  pedidoModel.id,
  pedidoModel.numeroPedido,
  pedidoModel.itensPedido,
  pedidoModel.statusPedido,
  pedidoModel.cliente,
);

const pedidoModelMock: jest.Mocked<Repository<PedidoModel>> = {
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
} as Partial<jest.Mocked<Repository<PedidoModel>>> as jest.Mocked<
  Repository<PedidoModel>
>;

const pedidoRepositoryMock = {
  criarPedido: jest.fn(),
  editarStatusPedido: jest.fn(),
  buscarPedido: jest.fn(),
  listarPedidos: jest.fn(),
  listarPedidosRecebido: jest.fn(),
};

const pedidoFactoryMock = {
  criarItemPedido: jest.fn(),
  criarEntidadeCliente: jest.fn(),
  criarEntidadePedido: jest.fn(),
};

export {
  pedidoModel,
  pedidoEntity,
  criaPedidoDTO,
  atualizaPedidoDTO,
  pedidoDTO,
  pedidoModelMock,
  pedidoRepositoryMock,
  pedidoFactoryMock,
};
