import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProdutoDTO } from './produto.dto';
import { ClienteDTO } from './cliente.dto';
import { StatusPedido } from 'src/utils/pedido.enum';

export class CriaPedidoDTO {
  @IsUUID(4, { each: true })
  @IsNotEmpty({ message: 'Lista de uuid dos produtos não pode ser vazio' })
  @ApiProperty()
  itensPedido: string[];

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  cpfCliente: string;
}

export class AtualizaPedidoDTO {
  @IsString()
  @IsEnum(StatusPedido)
  @ApiPropertyOptional()
  statusPedido: StatusPedido;
}

export class PedidoDTO {
  id: string;
  itensPedido: ProdutoDTO[];
  statusPedido: string;
  cliente: ClienteDTO;
}
