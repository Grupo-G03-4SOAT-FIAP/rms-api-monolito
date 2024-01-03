import { Test, TestingModule } from '@nestjs/testing';
import { StatusPedido } from 'src/utils/pedido.enum';
import { PedidoFactory } from './pedido.factory';
import { PedidoService } from 'src/domain/services/pedido.service';
import { ClienteNaoLocalizadoErro } from 'src/domain/exceptions/cliente.exception';

describe('PedidoFactory', () => {
  let pedidoFactory: PedidoFactory;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PedidoFactory,
        PedidoService,
        // Add mock providers for IClienteRepository and IProdutoRepository
        // to isolate the unit tests.
      ],
    }).compile();

    pedidoFactory = module.get<PedidoFactory>(PedidoFactory);
  });

  it('should be defined', () => {
    expect(pedidoFactory).toBeDefined();
  });

  // Add more test cases here based on your requirements.

  // Example test case for criarEntidadeCliente method
  it('should throw ClienteNaoLocalizadoErro if cliente is not found', async () => {
    const fakeCpf = '12345678901';

    // Mock the behavior of clienteRepository.buscarClientePorCPF
    jest.spyOn(pedidoFactory['clienteRepository'], 'buscarClientePorCPF').mockResolvedValue(null);

    await expect(pedidoFactory.criarEntidadeCliente(fakeCpf)).rejects.toThrowError(ClienteNaoLocalizadoErro);
  });

  // Example test case for criarEntidadePedido method
  it('should create PedidoEntity with the correct properties', async () => {
    const fakePedidoDTO = /* create a fake PedidoDTO here */;
    const pedidoEntity = await pedidoFactory.criarEntidadePedido(fakePedidoDTO);

    expect(pedidoEntity.itensPedido).toHaveLength(1);
    expect(pedidoEntity.statusPedido).toBe(StatusPedido.RECEBIDO);
  });
});
