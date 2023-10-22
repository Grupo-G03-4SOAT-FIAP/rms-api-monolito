import { getRepositoryToken } from '@nestjs/typeorm';
import { PedidoRepository } from './pedido.repository';
import { PedidoEntity } from 'src/domain/entities/pedido.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { ProdutoEntity } from 'src/domain/entities/produto.entity';
import { CategoriaEntity } from 'src/domain/entities/categoria.entity';
import { ClienteEntity } from 'src/domain/entities/cliente.entity';
import { PedidoModel } from '../../models/pedido.model';
import { Repository } from 'typeorm';

const clienteEntity = new ClienteEntity(
  'Cliente A',
  'clientea@teste.com.br',
  '00000000000',
  '0a14aa4e-75e7-405f-8301-81f60646c93d',
);

const categoriaEntity = new CategoriaEntity(
  'Lanche',
  '0a14aa4e-75e7-405f-8301-81f60646c93d',
  'Lanche x tudo',
);

const produtoEntity = new ProdutoEntity(
  'Produto X',
  categoriaEntity,
  5.0,
  'http://',
  '0a14aa4e-75e7-405f-8301-81f60646c93d',
  'Teste produto x',
);

const pedidoEntity = new PedidoEntity(
  [produtoEntity],
  'Aprovado',
  'Recebido',
  '0a14aa4e-75e7-405f-8301-81f60646c93d',
  clienteEntity,
);

const pedidoModel = new PedidoModel();
pedidoModel.id = '0a14aa4e-75e7-405f-8301-81f60646c93d';
pedidoModel.itemsPedido = [{ item: 'Produto X' }];
pedidoModel.cliente = null;
pedidoModel.statusPagamento = 'Aprovado';
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

  it('deve editar o status de pagamento de um pedido', async () => {
    const pedidoId = '0a14aa4e-75e7-405f-8301-81f60646c93d';
    const novoStatusPagamento = 'Pendente';
    mockPedidoModel.findOne.mockResolvedValue(Promise.resolve(pedidoModel));

    const resultado = await pedidoRepository.editarStatusPagamento(
      pedidoId,
      novoStatusPagamento,
    );

    expect(mockPedidoModel.update).toHaveBeenCalledWith(pedidoId, {
      statusPagamento: novoStatusPagamento,
    });
    expect(mockPedidoModel.findOne).toHaveBeenCalledWith({
      where: { id: pedidoId },
    });
    expect(resultado).toBe(pedidoModel);
  });
});
