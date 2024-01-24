import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProdutoDTO } from '../produto/produto.dto';

export class CriaItemPedidoDTO {
  @IsUUID(4, { each: true })
  @IsNotEmpty({ message: 'UUID do produto não pode ser vazio' })
  @ApiProperty({ description: 'UUID do produto' })
  produto: string;

  @IsNotEmpty({ message: 'Quantidade do produto não pode ser vazia' })
  @ApiProperty({ description: 'Quantidade do produto' })
  quantidade: number;
}

export class ItemPedidoDTO {
  @ApiProperty({ description: 'ID do item do pedido' })
  id: string;

  @ApiProperty({ description: 'Produto associado ao item do pedido' })
  produto: ProdutoDTO;

  @ApiProperty({ description: 'Quantidade do produto' })
  quantidade: number;
}
