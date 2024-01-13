import { PedidoModel } from 'src/adapters/outbound/models/pedido.model';
import { PedidoEntity } from 'src/domain/entities/pedido/pedido.entity';
import { Repository } from 'typeorm';
import { StatusPedido } from '../utils/pedido.enum';
import { produtoEntityMock, produtoModelMock } from './produto.mock';
import { clienteModelMock, clienteEntityMock } from './cliente.mock';
import {
  AtualizaPedidoDTO,
  CriaPedidoDTO,
  PedidoDTO,
} from 'src/adapters/inbound/rest/v1/presenters/pedido.dto';
import { ClienteDTO } from 'src/adapters/inbound/rest/v1/presenters/cliente.dto';
import { ProdutoDTO } from 'src/adapters/inbound/rest/v1/presenters/produto.dto';

const pedidoModelMock = new PedidoModel();
pedidoModelMock.id = '0a14aa4e-75e7-405f-8301-81f60646c93d';
pedidoModelMock.numeroPedido = '05012024';
pedidoModelMock.itensPedido = [produtoModelMock];
pedidoModelMock.cliente = clienteModelMock;
pedidoModelMock.statusPedido = 'recebido';
pedidoModelMock.criadoEm = new Date().toISOString();
pedidoModelMock.atualizadoEm = new Date().toISOString();

const pedidoEntityMock = new PedidoEntity(
  [produtoEntityMock],
  StatusPedido.RECEBIDO,
  '05012024',
  clienteEntityMock,
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

const criaPedidoDTOMock = makeCriaPedidoDTO(
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

const atualizaPedidoDTOMock = makeAtualizaPedidoDTO(StatusPedido.RECEBIDO);

const makePedidoDTO = (
  id: string,
  numeroPedido: string,
  itensPedido: ProdutoDTO[],
  statusPedido: string,
  cliente: ClienteDTO,
  qrCode: string,
): PedidoDTO => {
  const pedidoDTO = new PedidoDTO();
  pedidoDTO.id = id;
  pedidoDTO.numeroPedido = numeroPedido;
  pedidoDTO.itensPedido = itensPedido;
  pedidoDTO.statusPedido = statusPedido;
  pedidoDTO.cliente = cliente;
  pedidoDTO.qrCode = qrCode;
  return pedidoDTO;
};

const pedidoDTOMock = makePedidoDTO(
  pedidoModelMock.id,
  pedidoModelMock.numeroPedido,
  pedidoModelMock.itensPedido,
  pedidoModelMock.statusPedido,
  pedidoModelMock.cliente,
  null
);

const pedidoTypeORMMock: jest.Mocked<Repository<PedidoModel>> = {
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

const gatewayPagamentoServiceMock = {
  criarPedido: jest.fn(),
  consultarPedido: jest.fn(),
};

const pedidoFactoryMock = {
  criarItemPedido: jest.fn(),
  criarEntidadeCliente: jest.fn(),
  criarEntidadePedido: jest.fn(),
};

const pedidoServiceMock = {
  gerarNumeroPedido: jest.fn(),
};

export {
  pedidoModelMock,
  pedidoEntityMock,
  criaPedidoDTOMock,
  atualizaPedidoDTOMock,
  pedidoDTOMock,
  pedidoTypeORMMock,
  pedidoRepositoryMock,
  gatewayPagamentoServiceMock,
  pedidoFactoryMock,
  pedidoServiceMock,
};
