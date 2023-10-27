import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsEnum,
} from 'class-validator';
import { ProdutoDTO } from './produto.dto';
import { ClienteDTO } from './cliente.dto';
import { StatusPedido } from 'src/utils/pedido.enum';

export class CriaPedidoDTO {
  @IsUUID(4, { each: true })
  @IsNotEmpty({ message: 'Lista de uuid dos produtos não pode ser vazio' })
  itensPedido: string[];

  @IsString()
  @IsOptional()
  cpfCliente: string;
}

export class AtualizaPedidoDTO {
  @IsString()
  @IsEnum(StatusPedido)
  statusPedido: StatusPedido;
}

export class PedidoDTO {
  id: string;
  itensPedido: ProdutoDTO[];
  statusPedido: string;
  cliente: ClienteDTO;
}
