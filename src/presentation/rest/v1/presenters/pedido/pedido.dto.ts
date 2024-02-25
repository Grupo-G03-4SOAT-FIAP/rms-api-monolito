import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsEnum,
  MaxLength,
  IsArray,
  ArrayMinSize,
  IsDefined,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CriaItemPedidoDTO, ItemPedidoDTO } from './item_pedido.dto';
import { ClienteDTO } from '../cliente/cliente.dto';
import { StatusPedido } from '../../../../../domain/pedido/enums/pedido.enum';

export class CriaPedidoDTO {
  @IsArray({ message: 'ItensPedido deve ser uma lista' })
  @ArrayMinSize(1, { message: 'Lista de itens do pedido não pode ser vazia' })
  @ValidateNested({
    each: true,
    message: 'cada deve ser uma lista de objetos com produto e quantidade',
  })
  @Type(() => CriaItemPedidoDTO)
  @IsDefined({ each: true, message: 'O item do pedido não pode ser nulo' })
  @ApiProperty({
    description: 'Lista de produtos',
    isArray: true,
    type: CriaItemPedidoDTO,
  })
  itensPedido: CriaItemPedidoDTO[];

  @IsString()
  @IsOptional()
  @MaxLength(11, {
    message: 'CPF precisa ter 11 dígitos',
  })
  @IsDefined({ each: true, message: 'CPF não pode ser nulo' })
  @ApiProperty({ description: 'CPF do cliente', required: false })
  cpfCliente?: string;
}

export class AtualizaPedidoDTO {
  @IsString()
  @IsEnum(StatusPedido)
  @IsDefined({ each: true, message: 'O status do pedido não pode ser nulo' })
  @ApiProperty({ description: 'Status do pedido' })
  statusPedido: StatusPedido;
}

export class PedidoDTO {
  @ApiProperty({ description: 'ID do pedido' })
  id: string;

  @ApiProperty({ description: 'Numero do pedido' })
  numeroPedido: string;

  @ApiProperty({
    description: 'Itens do pedido',
    type: ItemPedidoDTO,
    isArray: true,
  })
  itensPedido: ItemPedidoDTO[];

  @ApiProperty({ description: 'Status do pedido' })
  statusPedido: string;

  @ApiProperty({ description: 'Data de criação do pedido' })
  criadoEm: string;

  @ApiProperty({ description: 'Data da última atualização do pedido' })
  atualizadoEm: string;

  @ApiProperty({ description: 'Status do pagamento' })
  pago: boolean;

  @ApiProperty({ description: 'Cliente associado ao pedido', type: ClienteDTO })
  cliente: ClienteDTO;

  @ApiProperty({ description: 'QR Code para pagamento no formato EMVCo' })
  qrCode: string = null;
}
