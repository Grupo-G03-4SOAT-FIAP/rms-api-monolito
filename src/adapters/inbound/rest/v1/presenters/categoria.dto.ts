import { IsString, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';

export class CriaCategoriaDTO {
  @IsString()
  @IsNotEmpty({ message: 'Nome da categoria não pode ser vazio' })
  nome: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000, {
    message: 'Descrição não pode ter mais que 1000 caracteres',
  })
  descricao?: string;
}

export class AtualizaCategoriaDTO {
  @IsString()
  @IsOptional()
  nome?: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000, {
    message: 'Descrição não pode ter mais que 1000 caracteres',
  })
  descricao?: string;
}

export class CategoriaDTO {
  id: string;
  nome: string;
  descricao: string;
}
