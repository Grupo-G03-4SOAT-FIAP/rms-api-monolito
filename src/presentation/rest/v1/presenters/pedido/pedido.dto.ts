import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CriaItemPedidoDTO, ItemPedidoDTO } from './item_pedido.dto';
import { ClienteDTO } from '../cliente/cliente.dto';
import { StatusPedido } from 'src/domain/pedido/enums/pedido.enum';

export class CriaPedidoDTO {
  @IsNotEmpty({ message: 'Lista de itens do pedido não pode ser vazia' })
  @ApiProperty({ description: 'Lista de produtos' })
  itensPedido: CriaItemPedidoDTO[];

  @IsString()
  @IsOptional()
  @MaxLength(11, {
    message: 'CPF precisa ter 11 dígitos',
  })
  @ApiProperty({ description: 'CPF do cliente', required: false })
  cpfCliente?: string;
}

export class AtualizaPedidoDTO {
  @IsString()
  @IsEnum(StatusPedido)
  @ApiProperty({ description: 'Status do pedido' })
  statusPedido: StatusPedido;
}

export class PedidoDTO {
  @ApiProperty({ description: 'ID do pedido' })
  id: string;

  @ApiProperty({ description: 'Numero do pedido' })
  numeroPedido: string;

  @ApiProperty({ description: 'Itens do pedido' })
  itensPedido: ItemPedidoDTO[];

  @ApiProperty({ description: 'Status do pedido' })
  statusPedido: string;

  @ApiProperty({ description: 'Status do pagamento' })
  pago: boolean;

  @ApiProperty({ description: 'Cliente associado ao pedido' })
  cliente: ClienteDTO;

  @ApiProperty({ description: 'QR Code para pagamento no formato EMVCo' })
  qrCode: string = null;
}
