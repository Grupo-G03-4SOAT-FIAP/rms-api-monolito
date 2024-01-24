import { Test, TestingModule } from '@nestjs/testing';
import { PedidoService } from './pedido.service';

describe('PedidoService', () => {
  let pedidoService: PedidoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PedidoService],
    }).compile();

    pedidoService = module.get<PedidoService>(PedidoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve gerar um número de pedido válido', () => {
    const numeroPedido = pedidoService.gerarNumeroPedido();

    expect(numeroPedido).toHaveLength(6);
    expect(typeof numeroPedido).toBe('string');
  });

  it('deve gerar números de pedidos únicos', () => {
    const numeroPedido1 = pedidoService.gerarNumeroPedido();
    const numeroPedido2 = pedidoService.gerarNumeroPedido();

    expect(numeroPedido1).not.toEqual(numeroPedido2);
  });
});
