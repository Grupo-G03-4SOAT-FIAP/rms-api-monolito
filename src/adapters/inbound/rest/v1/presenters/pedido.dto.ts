import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsEnum,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProdutoDTO } from './produto.dto';
import { ClienteDTO } from './cliente.dto';
import { StatusPedido } from 'src/utils/pedido.enum';

export class CriaPedidoDTO {
  @IsUUID(4, { each: true })
  @IsNotEmpty({ message: 'Lista de UUIDs dos produtos não pode ser vazia' })
  @ApiProperty({ description: 'Lista de UUIDs dos produtos' })
  itensPedido: string[];

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
  itensPedido: ProdutoDTO[];

  @ApiProperty({ description: 'Status do pedido' })
  statusPedido: string;

  @ApiProperty({ description: 'Cliente associado ao pedido' })
  cliente: ClienteDTO;
}
