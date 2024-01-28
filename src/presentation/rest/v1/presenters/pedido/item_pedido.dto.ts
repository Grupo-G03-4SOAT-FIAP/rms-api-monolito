import { IsDefined, IsInt, IsNotEmpty, IsUUID, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProdutoDTO } from '../produto/produto.dto';

export class CriaItemPedidoDTO {
  @IsUUID('4', { message: 'O produto deve ser um UUID válido' })
  @IsNotEmpty({ message: 'UUID do produto não pode ser vazio' })
  @IsDefined({ each: true, message: 'produto não pode ser nulo' })
  @ApiProperty({ description: 'UUID do produto' })
  produto: string;

  @IsInt({ message: 'A quantidade deve ser um número inteiro' })
  @Min(1, { message: 'A quantidade deve ser pelo menos 1' })
  @IsNotEmpty({ message: 'Quantidade do produto não pode ser vazia' })
  @IsDefined({ each: true, message: 'Quantidade não pode ser nulo' })
  @ApiProperty({ description: 'Quantidade do produto' })
  quantidade: number;
}

export class ItemPedidoDTO {
  @ApiProperty({ description: 'ID do item do pedido' })
  id: string;

  @ApiProperty({
    description: 'Produto associado ao item do pedido',
    type: ProdutoDTO,
  })
  produto: ProdutoDTO;

  @ApiProperty({ description: 'Quantidade do produto' })
  quantidade: number;
}
