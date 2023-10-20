import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class AtualizaCategoriaDTO {
  @IsString()
  @IsNotEmpty({ message: 'Nome da categoria não pode ser vazio' })
  @IsOptional()
  nome: string;

  @IsString()
  @IsNotEmpty({ message: 'Descrição da categoria não pode ser vazia' })
  @MaxLength(1000, {
    message: 'Descrição não pode ter mais que 1000 caracteres',
  })
  @IsOptional()
  descricao: string;

  @IsBoolean()
  @IsNotEmpty({ message: 'Ativo não pode ser vazio' })
  @IsOptional()
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
