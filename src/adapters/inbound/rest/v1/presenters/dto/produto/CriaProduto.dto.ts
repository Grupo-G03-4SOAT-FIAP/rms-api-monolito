import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
  MaxLength,
  Min,
} from 'class-validator';

export class CriaProdutoDTO {
  @IsString()
  @IsNotEmpty({ message: 'Nome do produto não pode ser vazio' })
  @ApiProperty()
  nome: string;

  @IsString()
  @IsNotEmpty({ message: 'Descrição do produto não pode ser vazia' })
  @MaxLength(1000, {
    message: 'Descrição não pode ter mais que 1000 caracteres',
  })
  @ApiProperty()
  descricao: string;

  @IsNumber({ maxDecimalPlaces: 2, allowNaN: false, allowInfinity: false })
  @Min(1, { message: 'O valor precisa ser maior que zero' })
  @ApiProperty()
  valorUnitario: number;

  @IsUrl(undefined, { message: 'URL para imagem inválida' })
  @ApiProperty()
  imagemUrl: string;

  @IsBoolean()
  @IsNotEmpty({ message: 'Ativo não pode ser vazio' })
  @ApiProperty()
  @ApiPropertyOptional()
  ativo: boolean = true;

  @IsNumber()
  @ApiProperty()
  idCategoria: number;
}
