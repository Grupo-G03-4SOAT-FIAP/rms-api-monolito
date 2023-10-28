import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsOptional,
  IsNumber,
  Min,
  IsUrl,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CategoriaDTO } from './categoria.dto';

export class CriaProdutoDTO {
  @IsString()
  @IsNotEmpty({ message: 'Nome do produto não pode ser vazio' })
  @ApiProperty()
  nome: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000, {
    message: 'Descrição não pode ter mais que 1000 caracteres',
  })
  @ApiPropertyOptional()
  descricao?: string;

  @IsNumber({ maxDecimalPlaces: 2, allowNaN: false, allowInfinity: false })
  @Min(1, { message: 'O valor precisa ser maior que zero' })
  @ApiProperty()
  valorUnitario: number;

  @IsUrl(undefined, { message: 'URL para imagem inválida' })
  @ApiProperty()
  imagemUrl: string;

  @IsString()
  @IsNotEmpty({ message: 'Id categoria não pode ser vazia' })
  @ApiProperty()
  categoriaId: string;
}

export class AtualizaProdutoDTO {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  nome?: string;

  @IsString()
  @MaxLength(1000, {
    message: 'Descrição não pode ter mais que 1000 caracteres',
  })
  @IsOptional()
  @ApiPropertyOptional()
  descricao?: string;

  @IsNumber({ maxDecimalPlaces: 2, allowNaN: false, allowInfinity: false })
  @Min(1, { message: 'O valor precisa ser maior que zero' })
  @IsOptional()
  @ApiPropertyOptional()
  valorUnitario?: number;

  @IsUrl(undefined, { message: 'URL para imagem inválida' })
  @IsOptional()
  @ApiPropertyOptional()
  imagemUrl?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  categoriaId: string;
}

export class ProdutoDTO {
  id: string;
  nome: string;
  descricao: string;
  valorUnitario: number;
  imagemUrl: string;
  categoria: CategoriaDTO;
}
