import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
} from 'class-validator';

export class AtualizaProdutoDTO {
  @IsString()
  @IsNotEmpty({ message: 'Nome do produto não pode ser vazia' })
  @IsOptional()
  nome: string;

  @IsString()
  @IsNotEmpty({ message: 'Descrição do produto não pode ser vazia' })
  @MaxLength(1000, {
    message: 'Descrição não pode ter mais que 1000 caracteres',
  })
  @IsOptional()
  descricao: string;

  @IsNumber({ maxDecimalPlaces: 2, allowNaN: false, allowInfinity: false })
  @Min(1, { message: 'O valor precisa ser maior que zero' })
  @IsOptional()
  valorUnitario: number;

  @IsUrl(undefined, { message: 'URL para imagem inválida' })
  @IsOptional()
  imagemUrl: string;

  @IsBoolean()
  @IsNotEmpty({ message: 'Ativo não pode ser vazio' })
  @IsOptional()
  ativo: boolean;

  @IsNumber()
  @IsOptional()
  idCategoria: number;

  constructor(
    nome?: string,
    descricao?: string,
    valorUnitario?: number,
    imagemUrl?: string,
    ativo?: boolean,
    idCategoria?: number,
  ) {
    this.nome = nome;
    this.descricao = descricao;
    this.valorUnitario = valorUnitario;
    this.imagemUrl = imagemUrl;
    this.ativo = ativo;
    this.idCategoria = idCategoria;
  }
}
