import { Test, TestingModule } from '@nestjs/testing';
import { IPedidoRepository } from 'src/domain/ports/pedido/pedido.repository.port';
import { IPedidoFactory } from 'src/domain/ports/pedido/pedido.factory.port';
import { PedidoUseCase } from './pedido.use_case';
import {
  pedidoFactoryMock,
  pedidoRepositoryMock,
  pedidoModel,
  pedidoEntity,
  criaPedidoDTO,
  atualizaPedidoDTO,
  pedidoDTO,
} from 'src/mocks/pedido.mock';

describe('PedidoUseCase', () => {
  let pedidoUseCase: PedidoUseCase;
  let pedidoRepository: IPedidoRepository;
  let pedidoFactory: IPedidoFactory;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PedidoUseCase,
        {
          provide: IPedidoRepository,
          useValue: pedidoRepositoryMock,
        },
        {
          provide: IPedidoFactory,
          useValue: pedidoFactoryMock,
        },
      ],
    }).compile();

    pedidoUseCase = module.get<PedidoUseCase>(PedidoUseCase);
    pedidoRepository = module.get<IPedidoRepository>(IPedidoRepository);
    pedidoFactory = module.get<IPedidoFactory>(IPedidoFactory);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('criarPedido', () => {
    it('should create a pedido successfully', async () => {
      pedidoFactoryMock.criarEntidadePedido.mockReturnValue(pedidoEntity);
      pedidoRepositoryMock.criarPedido.mockReturnValue(pedidoModel);

      const result = await pedidoUseCase.criarPedido(criaPedidoDTO);

      expect(pedidoFactoryMock.criarEntidadePedido).toHaveBeenCalledWith(criaPedidoDTO);
      expect(pedidoRepositoryMock.criarPedido).toHaveBeenCalledWith(pedidoEntity);
      expect(result).toBe({
        mensagem: 'Pedido criado com sucesso',
        body: pedidoDTO,
      });
    });
  });
});
