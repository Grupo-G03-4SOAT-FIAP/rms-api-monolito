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
import { CategoriaModel } from '../../models/categoria.model';

const clienteEntity = new ClienteEntity(
  'Jhon',
  'jhon@teste.com.br',
  '83904665030',
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

const categoriaModel = new CategoriaModel();
categoriaModel.id = '0a14aa4e-75e7-405f-8301-81f60646c93d';
categoriaModel.nome = 'Lanche';
categoriaModel.descricao = 'Lanche x tudo';
categoriaModel.produtos = null;
categoriaModel.criadoEm = new Date().toISOString();
categoriaModel.atualizadoEm = new Date().toISOString();
categoriaModel.excluidoEm = new Date().toISOString();

const produtoModel = new ProdutoModel();
produtoModel.id = '0a14aa4e-75e7-405f-8301-81f60646c93d';
produtoModel.nome = 'Produto X';
produtoModel.descricao = 'Teste produto x';
produtoModel.valorUnitario = 5.0;
produtoModel.imagemUrl = 'http://';
produtoModel.categoria = categoriaModel;
produtoModel.criadoEm = new Date().toISOString();
produtoModel.atualizadoEm = new Date().toISOString();
produtoModel.excluidoEm = new Date().toISOString();

const pedidoModel = new PedidoModel();
pedidoModel.id = '0a14aa4e-75e7-405f-8301-81f60646c93d';
pedidoModel.itensPedido = [produtoModel];
pedidoModel.cliente = null;
pedidoModel.statusPedido = 'recebido';
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
      relations: ['cliente'],
    });
    expect(resultado).toBe(pedidoModel);
  });

  it('deve buscar um pedido por id', async () => {
    mockPedidoModel.findOne.mockResolvedValue(Promise.resolve(pedidoModel));

    const pedidoId = '0a14aa4e-75e7-405f-8301-81f60646c93d';
    const resultado = await pedidoRepository.buscarPedido(pedidoId);

    expect(mockPedidoModel.findOne).toHaveBeenCalledWith({
      where: { id: pedidoId },
      relations: ['cliente'],
    });
    expect(resultado).toBe(pedidoModel);
  });

  it('deve buscar um pedido por id e retornar nulo', async () => {
    mockPedidoModel.findOne.mockResolvedValue(null);

    const pedidoId = '0a14aa4e-75e7-405f-8301-81f60646c93d';
    const resultado = await pedidoRepository.buscarPedido(pedidoId);

    expect(mockPedidoModel.findOne).toHaveBeenCalledWith({
      where: { id: pedidoId },
      relations: ['cliente'],
    });
    expect(resultado).toBe(null);
  });

  it('deve listar pedidos prontos e em preparação', async () => {
    const listaPedidos = [pedidoModel, pedidoModel, pedidoModel];
    mockPedidoModel.find.mockResolvedValue(Promise.resolve(listaPedidos));

    const resultado = await pedidoRepository.listarPedidos();

    expect(mockPedidoModel.find).toHaveBeenCalledWith({
      where: {
        statusPedido: In([StatusPedido.PRONTO, StatusPedido.EM_PREPARACAO]),
      },
      relations: ['cliente'],
    });
    expect(resultado).toBe(listaPedidos);
  });

  it('deve retornar uma lista vazia de pedidos prontos e em preparação', async () => {
    const listaPedidos = [];
    mockPedidoModel.find.mockResolvedValue(Promise.resolve(listaPedidos));

    const resultado = await pedidoRepository.listarPedidos();

    expect(mockPedidoModel.find).toHaveBeenCalledWith({
      where: {
        statusPedido: In([StatusPedido.PRONTO, StatusPedido.EM_PREPARACAO]),
      },
      relations: ['cliente'],
    });
    expect(resultado).toBe(listaPedidos);
  });

  it('deve listar fila de pedidos recebidos', async () => {
    const listaPedidos = [pedidoModel, pedidoModel, pedidoModel];
    mockPedidoModel.find.mockResolvedValue(Promise.resolve(listaPedidos));

    const resultado = await pedidoRepository.listarPedidosRecebido();

    expect(mockPedidoModel.find).toHaveBeenCalledWith({
      where: {
        statusPedido: StatusPedido.RECEBIDO,
      },
      order: {
        criadoEm: 'ASC',
      },
      relations: ['cliente'],
    });
    expect(resultado).toBe(listaPedidos);
  });

  it('deve retornar uma lista vazia de pedidos recebidos', async () => {
    const listaPedidos = [];
    mockPedidoModel.find.mockResolvedValue(Promise.resolve(listaPedidos));

    const resultado = await pedidoRepository.listarPedidosRecebido();

    expect(mockPedidoModel.find).toHaveBeenCalledWith({
      where: {
        statusPedido: StatusPedido.RECEBIDO,
      },
      order: {
        criadoEm: 'ASC',
      },
      relations: ['cliente'],
    });
    expect(resultado).toBe(listaPedidos);
  });
});
