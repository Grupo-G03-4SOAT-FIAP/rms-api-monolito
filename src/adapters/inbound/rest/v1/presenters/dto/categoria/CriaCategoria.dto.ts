import { IsBoolean, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CriaCategoriaDTO {
  constructor(categoria?: { nome: string; descricao: string }) {
    this.nome = categoria?.nome;
    this.descricao = categoria?.descricao;
  }
  @IsString()
  @IsNotEmpty({ message: 'Nome da categoria não pode ser vazio' })
  nome: string;

  @IsString()
  @IsNotEmpty({ message: 'Descrição da categoria não pode ser vazia' })
  @MaxLength(1000, {
    message: 'Descrição não pode ter mais que 1000 caracteres',
  })
  descricao: string;

  @IsBoolean()
  @IsNotEmpty({ message: 'Ativo não pode ser vazio' })
  ativo: boolean = true;
}
