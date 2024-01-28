import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsOptional,
  IsNumber,
  Min,
  IsUrl,
  IsUUID,
  IsDefined,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CategoriaDTO } from '../categoria/categoria.dto';

export class CriaProdutoDTO {
  @IsString()
  @IsNotEmpty({ message: 'Nome do produto não pode ser vazio' })
  @IsDefined({ each: true, message: 'Nome não pode ser nulo' })
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
  @IsNotEmpty({ message: 'Valor unitário do produto não pode ser vazio' })
  @IsDefined({ each: true, message: 'Valor unitário não pode ser nulo' })
  @ApiProperty({ description: 'Valor unitário do produto' })
  valorUnitario: number;

  @IsUrl(undefined, { message: 'URL para imagem inválida' })
  @IsNotEmpty({ message: 'URL do produto não pode ser vazio' })
  @IsDefined({ each: true, message: 'URL não pode ser nulo' })
  @ApiProperty({ description: 'URL da imagem do produto' })
  imagemUrl: string;

  @IsUUID('4', { message: 'A categoria deve ser um UUID válido' })
  @IsNotEmpty({ message: 'ID da categoria não pode ser vazio' })
  @IsDefined({ each: true, message: 'ID da categoria não pode ser nulo' })
  @ApiProperty({ description: 'ID da categoria' })
  categoriaId: string;
}

export class AtualizaProdutoDTO {
  @IsString()
  @IsOptional()
  @IsDefined({ each: true, message: 'Nome não pode ser nulo' })
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
  @IsDefined({ each: true, message: 'Valor unitário não pode ser nulo' })
  @ApiProperty({ description: 'Valor unitário do produto', required: false })
  valorUnitario?: number;

  @IsUrl(undefined, { message: 'URL para imagem inválida' })
  @IsOptional()
  @IsDefined({ each: true, message: 'URL não pode ser nulo' })
  @ApiProperty({ description: 'URL da imagem do produto', required: false })
  imagemUrl?: string;

  @IsUUID('4', { message: 'A categoria deve ser um UUID válido' })
  @IsOptional()
  @IsDefined({ each: true, message: 'ID da categoria não pode ser nulo' })
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

  @ApiProperty({ description: 'Categoria do produto', type: CategoriaDTO })
  categoria: CategoriaDTO;
}
