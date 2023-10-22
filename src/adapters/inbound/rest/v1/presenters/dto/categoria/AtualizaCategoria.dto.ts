import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AtualizaCategoriaDTO {
  @IsString()
  @IsNotEmpty({ message: 'Nome da categoria não pode ser vazio' })
  @IsOptional()
  @ApiProperty()
  @ApiPropertyOptional()
  nome: string;

  @IsString()
  @IsNotEmpty({ message: 'Descrição da categoria não pode ser vazia' })
  @MaxLength(1000, {
    message: 'Descrição não pode ter mais que 1000 caracteres',
  })
  @IsOptional()
  @ApiProperty()
  @ApiPropertyOptional()
  descricao: string;

  @IsBoolean()
  @IsNotEmpty({ message: 'Ativo não pode ser vazio' })
  @IsOptional()
  @ApiProperty()
  @ApiPropertyOptional()
  ativo: boolean;

  constructor(categoria?: {
    nome?: string;
    descricao?: string;
    ativo?: boolean;
  }) {
    this.nome = categoria?.nome;
    this.descricao = categoria?.descricao;
    this.ativo = categoria?.ativo;
  }
}
