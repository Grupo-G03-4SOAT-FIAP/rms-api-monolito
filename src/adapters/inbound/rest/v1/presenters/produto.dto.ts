import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsOptional,
  IsNumber,
  Min,
  IsUrl,
} from 'class-validator';

export class CriaProdutoDTO {
  @IsString()
  @IsNotEmpty({ message: 'Nome do produto não pode ser vazio' })
  nome: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000, {
    message: 'Descrição não pode ter mais que 1000 caracteres',
  })
  descricao?: string;

  @IsNumber({ maxDecimalPlaces: 2, allowNaN: false, allowInfinity: false })
  @Min(1, { message: 'O valor precisa ser maior que zero' })
  valorUnitario: number;

  @IsUrl(undefined, { message: 'URL para imagem inválida' })
  imagemUrl: string;

  @IsString()
  @IsNotEmpty({ message: 'Id categoria não pode ser vazia' })
  categoriaId: string;
}

export class AtualizaProdutoDTO {
  @IsString()
  @IsOptional()
  nome?: string;

  @IsString()
  @MaxLength(1000, {
    message: 'Descrição não pode ter mais que 1000 caracteres',
  })
  @IsOptional()
  descricao?: string;

  @IsNumber({ maxDecimalPlaces: 2, allowNaN: false, allowInfinity: false })
  @Min(1, { message: 'O valor precisa ser maior que zero' })
  @IsOptional()
  valorUnitario?: number;

  @IsUrl(undefined, { message: 'URL para imagem inválida' })
  @IsOptional()
  imagemUrl?: string;

  @IsString()
  @IsOptional()
  categoriaId: string;
}

export class ProdutoDTO {
  id: string;
  nome: string;
  descricao: string;
  valorUnitario: number;
  imagemUrl: string;
  categoriaId: string;
}
