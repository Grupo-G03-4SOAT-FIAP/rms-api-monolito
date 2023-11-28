import { IsString, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CriaCategoriaDTO {
  @IsString()
  @IsNotEmpty({ message: 'Nome da categoria não pode ser vazio' })
  @ApiProperty({ description: 'Nome da categoria' })
  nome: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000, {
    message: 'Descrição não pode ter mais que 1000 caracteres',
  })
  @ApiProperty({ description: 'Descrição da categoria' })
  descricao: string;
}

export class AtualizaCategoriaDTO {
  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Nome da categoria', required: false })
  nome?: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000, {
    message: 'Descrição não pode ter mais que 1000 caracteres',
  })
  @ApiProperty({ description: 'Descrição da categoria', required: false })
  descricao?: string;
}

export class CategoriaDTO {
  @ApiProperty({ description: 'ID da categoria' })
  id: string;

  @ApiProperty({ description: 'Nome da categoria' })
  nome: string;

  @ApiProperty({ description: 'Descrição da categoria' })
  descricao: string;
}
