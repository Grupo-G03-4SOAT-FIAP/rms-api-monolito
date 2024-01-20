import {
  produtoDTOMock,
  produtoEntityMock,
  produtoModelMock,
} from './produto.mock';
import { ItemPedidoModel } from 'src/adapters/outbound/models/item_pedido.model';
import { ItemPedidoEntity } from 'src/domain/entities/pedido/item_pedido.entity';
import { pedidoModelMock } from './pedido.mock';
import { ProdutoDTO } from 'src/adapters/inbound/rest/v1/presenters/produto.dto';
import { Repository } from 'typeorm';
import {
  CriaItemPedidoDTO,
  ItemPedidoDTO,
} from 'src/adapters/inbound/rest/v1/presenters/item_pedido.dto';

const itemPedidoModelMock = new ItemPedidoModel();
itemPedidoModelMock.id = '0a14aa4e-75e7-405f-8301-81f60646c93d';
itemPedidoModelMock.pedido = pedidoModelMock;
itemPedidoModelMock.produto = produtoModelMock;
itemPedidoModelMock.quantidade = 2;
itemPedidoModelMock.criadoEm = new Date().toISOString();
itemPedidoModelMock.atualizadoEm = new Date().toISOString();

const itemPedidoEntityMock = new ItemPedidoEntity(produtoEntityMock, 2);

const makeCriaItemPedidoDTO = (
  produto: string,
  quantidade: number,
): CriaItemPedidoDTO => {
  const criaItemPedidoDTO = new CriaItemPedidoDTO();
  criaItemPedidoDTO.produto = produto;
  criaItemPedidoDTO.quantidade = quantidade;
  return criaItemPedidoDTO;
};

const criaItemPedidoDTOMock = makeCriaItemPedidoDTO(
  '0a14aa4e-75e7-405f-8301-81f60646c93d',
  2,
);

const makeItemPedidoDTO = (
  id: string,
  produto: ProdutoDTO,
  quantidade: number,
): ItemPedidoDTO => {
  const itemPedidoDTO = new ItemPedidoDTO();
  itemPedidoDTO.id = id;
  itemPedidoDTO.produto = produto;
  itemPedidoDTO.quantidade = quantidade;
  return itemPedidoDTO;
};

const itemPedidoDTOMock = makeItemPedidoDTO(
  itemPedidoModelMock.id,
  produtoDTOMock,
  itemPedidoModelMock.quantidade,
);

const itemPedidoTypeORMMock: jest.Mocked<Repository<ItemPedidoModel>> = {
  create: jest.fn(),
  save: jest.fn(),
} as Partial<jest.Mocked<Repository<ItemPedidoModel>>> as jest.Mocked<
  Repository<ItemPedidoModel>
>;

export {
  itemPedidoModelMock,
  itemPedidoEntityMock,
  criaItemPedidoDTOMock,
  itemPedidoDTOMock,
  itemPedidoTypeORMMock,
};
