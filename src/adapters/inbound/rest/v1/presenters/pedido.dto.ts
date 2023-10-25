import { IsString, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';
import { ProdutoDTO } from './produto.dto';
import { ClienteDTO } from './cliente.dto';

export class CriaPedidoDTO {
  @IsString()
  @IsNotEmpty({ message: 'Nome da categoria não pode ser vazio' })
  nome: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000, {
    message: 'Descrição não pode ter mais que 1000 caracteres',
  })
  descricao?: string;
}

export class AtualizaPedidoDTO {
  @IsString()
  @IsOptional()
  nome?: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000, {
    message: 'Descrição não pode ter mais que 1000 caracteres',
  })
  descricao?: string;
}

export class PedidoDTO {
  id: string;
  itemsPedido: ProdutoDTO[];
  statusPagamento: string;
  statusPedido: string;
  cliente: ClienteDTO;
}
