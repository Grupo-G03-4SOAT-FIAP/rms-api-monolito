import { getRepositoryToken } from '@nestjs/typeorm';
import { PedidoRepository } from './pedido.repository';
import { PedidoEntity } from 'src/domain/entities/pedido.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { ProdutoEntity } from 'src/domain/entities/produto.entity';
import { CategoriaEntity } from 'src/domain/entities/categoria.entity';
import { ClienteEntity } from 'src/domain/entities/cliente.entity';
import { PedidoModel } from '../../models/pedido.model';
import { In, Repository } from 'typeorm';
import { StatusPedido } from 'src/utils/pedido.enum';
import { ProdutoModel } from '../../models/produto.model';

const clienteEntity = new ClienteEntity(
  'Cliente A',
  'clientea@teste.com.br',
  '00000000000',
  '0a14aa4e-75e7-405f-8301-81f60646c93d',
);

const categoriaEntity = new CategoriaEntity(
  'Lanche',
  'Lanche x tudo',
  '0a14aa4e-75e7-405f-8301-81f60646c93d',
);

const produtoEntity = new ProdutoEntity(
  'Produto X',
  categoriaEntity,
  5.0,
  'http://',
  'Teste produto x',
  '0a14aa4e-75e7-405f-8301-81f60646c93d',
);

const pedidoEntity = new PedidoEntity(
  [produtoEntity],
  StatusPedido.RECEBIDO,
  clienteEntity,
  '0a14aa4e-75e7-405f-8301-81f60646c93d',
);

const produtoModel = new ProdutoModel();
produtoModel.id = '0a14aa4e-75e7-405f-8301-81f60646c93d';
produtoModel.nome = 'Produto X';
produtoModel.descricao = 'Lanche x tudo';
produtoModel.criadoEm = new Date().toISOString();
produtoModel.atualizadoEm = new Date().toISOString();
produtoModel.excluidoEm = new Date().toISOString();

const pedidoModel = new PedidoModel();
pedidoModel.id = '0a14aa4e-75e7-405f-8301-81f60646c93d';
pedidoModel.itensPedido = [produtoModel];
pedidoModel.cliente = null;
pedidoModel.statusPedido = 'Recebido';
pedidoModel.criadoEm = new Date().toISOString();
pedidoModel.atualizadoEm = new Date().toISOString();

describe('PedidoRepository', () => {
  let pedidoRepository: PedidoRepository;
  let mockPedidoModel: jest.Mocked<Repository<PedidoModel>>;

  beforeEach(async () => {
    mockPedidoModel = {
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
    } as Partial<Repository<PedidoModel>> as jest.Mocked<
      Repository<PedidoModel>
    >;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PedidoRepository,
        {
          provide: getRepositoryToken(PedidoModel),
          useValue: mockPedidoModel,
        },
      ],
    }).compile();

    pedidoRepository = module.get<PedidoRepository>(PedidoRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve criar um pedido', async () => {
    mockPedidoModel.create.mockReturnValue(pedidoModel);
    mockPedidoModel.save.mockResolvedValue(Promise.resolve(pedidoModel));

    const resultado = await pedidoRepository.criarPedido(pedidoEntity);

    expect(mockPedidoModel.create).toHaveBeenCalledWith(pedidoEntity);
    expect(mockPedidoModel.save).toHaveBeenCalledWith(pedidoModel);
    expect(resultado).toBe(pedidoModel);
  });

  it('deve editar o status de um pedido', async () => {
    const pedidoId = '0a14aa4e-75e7-405f-8301-81f60646c93d';
    const novoStatusPedido = 'Recebido';

    mockPedidoModel.findOne.mockResolvedValue(Promise.resolve(pedidoModel));

    const resultado = await pedidoRepository.editarStatusPedido(
      pedidoId,
      novoStatusPedido,
    );

    expect(mockPedidoModel.update).toHaveBeenCalledWith(pedidoId, {
      statusPedido: novoStatusPedido,
    });
    expect(mockPedidoModel.findOne).toHaveBeenCalledWith({
      where: { id: pedidoId },
    });
    expect(resultado).toBe(pedidoModel);
  });

  it('deve buscar um pedido', async () => {
    const pedidoId = '0a14aa4e-75e7-405f-8301-81f60646c93d';

    mockPedidoModel.findOne.mockResolvedValue(Promise.resolve(pedidoModel));

    const resultado = await pedidoRepository.buscarPedido(pedidoId);

    expect(mockPedidoModel.findOne).toHaveBeenCalledWith({
      where: { id: pedidoId },
    });
    expect(resultado).toBe(pedidoModel);
  });

  it('deve listar pedidos com statusPagamento aprovado e ordenado por statusPedido', async () => {
    const listaPedidos = [pedidoModel, pedidoModel, pedidoModel];
    mockPedidoModel.find.mockResolvedValue(Promise.resolve(listaPedidos));

    const resultado = await pedidoRepository.listarPedidos();

    expect(mockPedidoModel.find).toHaveBeenCalledWith({
      where: {
        statusPagamento: 'Aprovado',
        statusPedido: In(['Pronto', 'Em preparação', 'Recebido']),
      },
    });
    expect(resultado).toBe(listaPedidos);
  });
});
