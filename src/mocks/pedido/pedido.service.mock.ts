import { PedidoService } from 'src/domain/services/pedido.service';

const pedidoServiceMock: jest.Mocked<Pick<PedidoService, 'gerarNumeroPedido'>> =
  {
    gerarNumeroPedido: jest.fn(),
  };

export { pedidoServiceMock };
