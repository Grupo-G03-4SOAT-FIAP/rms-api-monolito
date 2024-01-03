import { Test, TestingModule } from '@nestjs/testing';
import { IPedidoRepository } from 'src/domain/ports/pedido/pedido.repository.port';
import { IPedidoFactory } from 'src/domain/ports/pedido/pedido.factory.port';
import { pedidoRepositoryMock } from 'src/mocks/pedido.repository.mock';
import { pedidoFactoryMock } from 'src/mocks/pedido/pedido.factory.mock';
import { PedidoUseCase } from './pedido.use_case';

describe('PedidoUseCase', () => {
  let pedidoUseCase: PedidoUseCase;

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
  });

  describe('criarPedido', () => {
    it('should create a pedido successfully', async () => {});
  });
});
