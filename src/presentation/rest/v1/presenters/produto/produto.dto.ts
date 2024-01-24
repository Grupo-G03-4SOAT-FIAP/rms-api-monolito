import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsOptional,
  IsNumber,
  Min,
  IsUrl,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CategoriaDTO } from '../categoria/categoria.dto';

export class CriaProdutoDTO {
  @IsString()
  @IsNotEmpty({ message: 'Nome do produto não pode ser vazio' })
  @ApiProperty({ description: 'Nome do produto' })
  nome: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000, {
    message: 'Descrição não pode ter mais que 1000 caracteres',
  })
  @ApiProperty({ description: 'Descrição do produto', required: false })
  descricao?: string;

  @IsNumber({ maxDecimalPlaces: 2, allowNaN: false, allowInfinity: false })
  @Min(1, { message: 'O valor precisa ser maior que zero' })
  @ApiProperty({ description: 'Valor unitário do produto' })
  valorUnitario: number;

  @IsUrl(undefined, { message: 'URL para imagem inválida' })
  @ApiProperty({ description: 'URL da imagem do produto' })
  imagemUrl: string;

  @IsUUID()
  @IsNotEmpty({ message: 'ID da categoria não pode ser vazio' })
  @ApiProperty({ description: 'ID da categoria' })
  categoriaId: string;
}

export class AtualizaProdutoDTO {
  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Nome do produto', required: false })
  nome?: string;

  @IsString()
  @MaxLength(1000, {
    message: 'Descrição não pode ter mais que 1000 caracteres',
  })
  @IsOptional()
  @ApiProperty({ description: 'Descrição do produto', required: false })
  descricao?: string;

  @IsNumber({ maxDecimalPlaces: 2, allowNaN: false, allowInfinity: false })
  @Min(1, { message: 'O valor precisa ser maior que zero' })
  @IsOptional()
  @ApiProperty({ description: 'Valor unitário do produto', required: false })
  valorUnitario?: number;

  @IsUrl(undefined, { message: 'URL para imagem inválida' })
  @IsOptional()
  @ApiProperty({ description: 'URL da imagem do produto', required: false })
  imagemUrl?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'ID da categoria', required: false })
  categoriaId?: string;
}

export class ProdutoDTO {
  @ApiProperty({ description: 'ID do produto' })
  id: string;

  @ApiProperty({ description: 'Nome do produto' })
  nome: string;

  @ApiProperty({ description: 'Descrição do produto' })
  descricao: string;

  @ApiProperty({ description: 'Valor unitário do produto' })
  valorUnitario: number;

  @ApiProperty({ description: 'URL da imagem do produto' })
  imagemUrl: string;

  @ApiProperty({ description: 'Categoria do produto' })
  categoria: CategoriaDTO;
}
