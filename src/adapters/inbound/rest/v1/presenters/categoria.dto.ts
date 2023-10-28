import { IsString, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CriaCategoriaDTO {
  @IsString()
  @IsNotEmpty({ message: 'Nome da categoria não pode ser vazio' })
  @ApiProperty()
  nome: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000, {
    message: 'Descrição não pode ter mais que 1000 caracteres',
  })
  @ApiProperty()
  descricao?: string;
}

export class AtualizaCategoriaDTO {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  nome?: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000, {
    message: 'Descrição não pode ter mais que 1000 caracteres',
  })
  @ApiPropertyOptional()
  descricao?: string;
}

export class CategoriaDTO {
  id: string;
  nome: string;
  descricao: string;
}
