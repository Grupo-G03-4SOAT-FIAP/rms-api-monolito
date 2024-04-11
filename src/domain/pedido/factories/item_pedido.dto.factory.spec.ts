import { Test, TestingModule } from '@nestjs/testing';
import { ItemPedidoDTOFactory } from './item_pedido.dto.factory';
import { CriaItemPedidoDTO } from '../../../presentation/rest/v1/presenters/pedido/item_pedido.dto';

describe('ItemPedidoDTOFactory', () => {
  let itemPedidoDTOFactory: ItemPedidoDTOFactory;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ItemPedidoDTOFactory],
    }).compile();

    itemPedidoDTOFactory =
      module.get<ItemPedidoDTOFactory>(ItemPedidoDTOFactory);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Deve ser possível criar um itemPedidoDTO', async () => {
    const item = itemPedidoDTOFactory.criarItemPedidoDTO('produto', 20);
    expect(item).toBeInstanceOf(CriaItemPedidoDTO);
  });
});
