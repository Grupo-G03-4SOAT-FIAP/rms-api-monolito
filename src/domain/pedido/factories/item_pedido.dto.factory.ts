import { Injectable } from '@nestjs/common';
import { IItemPedidoDTOFactory } from '../interfaces/item_pedido.factory.port';
import { CriaItemPedidoDTO } from '../../../presentation/rest/v1/presenters/pedido/item_pedido.dto';

@Injectable()
export class ItemPedidoDTOFactory implements IItemPedidoDTOFactory {
  criarItemPedidoDTO(produto: string, quantidade: number): CriaItemPedidoDTO {
    const itemPedidoDTO = new CriaItemPedidoDTO();
    itemPedidoDTO.produto = produto;
    itemPedidoDTO.quantidade = quantidade;
    return itemPedidoDTO;
  }
}
