import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { In } from 'typeorm';
import { PedidoRepository } from './pedido.repository';
import { PedidoModel } from '../../models/pedido.model';
import { ItemPedidoModel } from '../../models/item_pedido.model';
import { StatusPedido } from 'src/domain/pedido/enums/pedido.enum';
import {
  pedidoSQLDTOFactoryMock,
  pedidoEntityMock,
  pedidoModelMock,
  pedidoTypeORMMock,
  pedidoEntityNotIdMock,
} from 'src/mocks/pedido.mock';
import {
  itemPedidoModelMock,
  itemPedidoTypeORMMock,
} from 'src/mocks/item_pedido.mock';
import { SQLDTOFactory } from '../../factories/sql.dto.factory';

describe('PedidoRepository', () => {
  let pedidoRepository: PedidoRepository;
  let pedidoId: string;
  let relations: string[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PedidoRepository,
        {
          provide: getRepositoryToken(PedidoModel),
          useValue: pedidoTypeORMMock,
        },
        {
          provide: getRepositoryToken(ItemPedidoModel),
          useValue: itemPedidoTypeORMMock,
        },
        {
          provide: SQLDTOFactory,
          useValue: pedidoSQLDTOFactoryMock,
        },
      ],
    }).compile();

    pedidoRepository = module.get<PedidoRepository>(PedidoRepository);
    pedidoId = '0a14aa4e-75e7-405f-8301-81f60646c93d';
    relations = [
      'cliente',
      'itensPedido',
      'itensPedido.produto',
      'itensPedido.produto.categoria',
    ];
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve criar um pedido', async () => {
    const itensPedido = {
      pedido: { id: pedidoModelMock.id },
      produto: { id: itemPedidoModelMock.produto.id },
      quantidade: itemPedidoModelMock.quantidade,
    };

    pedidoTypeORMMock.create.mockReturnValue(pedidoModelMock);
    pedidoTypeORMMock.save.mockResolvedValue(Promise.resolve(pedidoModelMock));

    itemPedidoTypeORMMock.create.mockReturnValue(itemPedidoModelMock);
    itemPedidoTypeORMMock.save.mockResolvedValue(
      Promise.resolve(itemPedidoModelMock),
    );

    pedidoTypeORMMock.findOne.mockResolvedValue(
      Promise.resolve(pedidoModelMock),
    );

    pedidoSQLDTOFactoryMock.criarPedidoDTO.mockReturnValue(pedidoEntityMock);

    const result = await pedidoRepository.criarPedido(pedidoEntityNotIdMock);

    expect(pedidoTypeORMMock.create).toHaveBeenCalledWith(
      pedidoEntityNotIdMock,
    );
    expect(pedidoTypeORMMock.save).toHaveBeenCalledWith(pedidoModelMock);
    expect(itemPedidoTypeORMMock.create).toHaveBeenCalledWith(itensPedido);
    expect(itemPedidoTypeORMMock.save).toHaveBeenCalledWith([
      itemPedidoModelMock,
    ]);
    expect(pedidoTypeORMMock.findOne).toHaveBeenCalledWith({
      where: { id: pedidoId },
      relations: relations,
    });
    expect(pedidoSQLDTOFactoryMock.criarPedidoDTO).toHaveBeenCalledWith(
      pedidoModelMock,
    );
    expect(result).toStrictEqual(pedidoEntityMock);
  });

  it('deve alterar o status de pagamento do pedido', async () => {
    const novoStatusPagamento = true;

    pedidoTypeORMMock.findOne.mockResolvedValue(
      Promise.resolve(pedidoModelMock),
    );

    pedidoSQLDTOFactoryMock.criarPedidoDTO.mockReturnValue(pedidoEntityMock);

    const result = await pedidoRepository.editarStatusPagamento(
      pedidoId,
      novoStatusPagamento,
    );

    expect(pedidoTypeORMMock.update).toHaveBeenCalledWith(pedidoId, {
      pago: novoStatusPagamento,
    });
    expect(pedidoTypeORMMock.findOne).toHaveBeenCalledWith({
      where: { id: pedidoId },
      relations: relations,
    });
    expect(pedidoSQLDTOFactoryMock.criarPedidoDTO).toHaveBeenCalledWith(
      pedidoModelMock,
    );
    expect(result).toStrictEqual(pedidoEntityMock);
  });

  it('deve editar o status de um pedido', async () => {
    const novoStatusPedido = 'recebido';

    pedidoTypeORMMock.findOne.mockResolvedValue(
      Promise.resolve(pedidoModelMock),
    );

    pedidoSQLDTOFactoryMock.criarPedidoDTO.mockReturnValue(pedidoEntityMock);

    const result = await pedidoRepository.editarStatusPedido(
      pedidoId,
      novoStatusPedido,
    );

    expect(pedidoTypeORMMock.update).toHaveBeenCalledWith(pedidoId, {
      statusPedido: novoStatusPedido,
    });
    expect(pedidoTypeORMMock.findOne).toHaveBeenCalledWith({
      where: { id: pedidoId },
      relations: relations,
    });
    expect(pedidoSQLDTOFactoryMock.criarPedidoDTO).toHaveBeenCalledWith(
      pedidoModelMock,
    );
    expect(result).toStrictEqual(pedidoEntityMock);
  });

  it('deve buscar um pedido por id', async () => {
    pedidoTypeORMMock.findOne.mockResolvedValue(
      Promise.resolve(pedidoModelMock),
    );

    pedidoSQLDTOFactoryMock.criarPedidoDTO.mockReturnValue(pedidoEntityMock);

    const result = await pedidoRepository.buscarPedido(pedidoId);

    expect(pedidoTypeORMMock.findOne).toHaveBeenCalledWith({
      where: { id: pedidoId },
      relations: relations,
    });
    expect(pedidoSQLDTOFactoryMock.criarPedidoDTO).toHaveBeenCalledWith(
      pedidoModelMock,
    );
    expect(result).toStrictEqual(pedidoEntityMock);
  });

  it('deve buscar um pedido por id e retornar nulo', async () => {
    pedidoTypeORMMock.findOne.mockResolvedValue(null);

    const result = await pedidoRepository.buscarPedido(pedidoId);

    expect(pedidoTypeORMMock.findOne).toHaveBeenCalledWith({
      where: { id: pedidoId },
      relations: relations,
    });
    expect(result).toStrictEqual(null);
  });

  it('deve listar pedidos', async () => {
    const listaPedidoMocel = [
      pedidoModelMock,
      pedidoModelMock,
      pedidoModelMock,
    ];
    const listaPedidoEntity = [
      pedidoEntityMock,
      pedidoEntityMock,
      pedidoEntityMock,
    ];
    pedidoTypeORMMock.find.mockResolvedValue(Promise.resolve(listaPedidoMocel));
    pedidoSQLDTOFactoryMock.criarPedidoDTO.mockReturnValue(pedidoEntityMock);

    const result = await pedidoRepository.listarPedidos();

    expect(pedidoTypeORMMock.find).toHaveBeenCalledWith({
      where: {
        statusPedido: In([
          StatusPedido.PRONTO,
          StatusPedido.EM_PREPARACAO,
          StatusPedido.RECEBIDO,
        ]),
      },
      order: {
        statusPedido: 'ASC',
        criadoEm: 'ASC',
      },
      relations: relations,
    });
    expect(pedidoSQLDTOFactoryMock.criarPedidoDTO).toHaveBeenCalledWith(
      pedidoModelMock,
    );
    expect(result).toStrictEqual(listaPedidoEntity);
  });

  it('deve retornar uma lista vazia de pedidos', async () => {
    const listaPedidos = [];
    pedidoTypeORMMock.find.mockResolvedValue(Promise.resolve(listaPedidos));

    const result = await pedidoRepository.listarPedidos();

    expect(pedidoTypeORMMock.find).toHaveBeenCalledWith({
      where: {
        statusPedido: In([
          StatusPedido.PRONTO,
          StatusPedido.EM_PREPARACAO,
          StatusPedido.RECEBIDO,
        ]),
      },
      order: {
        statusPedido: 'ASC',
        criadoEm: 'ASC',
      },
      relations: relations,
    });
    expect(result).toStrictEqual(listaPedidos);
  });

  it('deve listar fila de pedidos recebidos', async () => {
    const listaPedidoMocel = [
      pedidoModelMock,
      pedidoModelMock,
      pedidoModelMock,
    ];
    const listaPedidoEntity = [
      pedidoEntityMock,
      pedidoEntityMock,
      pedidoEntityMock,
    ];
    pedidoTypeORMMock.find.mockResolvedValue(Promise.resolve(listaPedidoMocel));
    pedidoSQLDTOFactoryMock.criarPedidoDTO.mockReturnValue(pedidoEntityMock);

    const result = await pedidoRepository.listarPedidosRecebido();

    expect(pedidoTypeORMMock.find).toHaveBeenCalledWith({
      where: {
        statusPedido: StatusPedido.RECEBIDO,
      },
      order: {
        criadoEm: 'ASC',
      },
      relations: relations,
    });
    expect(pedidoSQLDTOFactoryMock.criarPedidoDTO).toHaveBeenCalledWith(
      pedidoModelMock,
    );
    expect(result).toStrictEqual(listaPedidoEntity);
  });

  it('deve retornar uma lista vazia de pedidos recebidos', async () => {
    const listaPedidos = [];
    pedidoTypeORMMock.find.mockResolvedValue(Promise.resolve(listaPedidos));

    const result = await pedidoRepository.listarPedidosRecebido();

    expect(pedidoTypeORMMock.find).toHaveBeenCalledWith({
      where: {
        statusPedido: StatusPedido.RECEBIDO,
      },
      order: {
        criadoEm: 'ASC',
      },
      relations: relations,
    });
    expect(result).toStrictEqual(listaPedidos);
  });
});
