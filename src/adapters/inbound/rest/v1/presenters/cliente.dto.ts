import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CriaClienteDTO {
  @IsString()
  @IsNotEmpty({ message: 'Nome do Cliente não pode ser vazio' })
  @ApiProperty()
  nome: string;

  @IsEmail()
  @IsNotEmpty({
    message: 'Email não pode ser vazio',
  })
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty({
    message: 'CPF não pode ser vazio',
  })
  @MaxLength(11, {
    message: 'CPF precisa ter 11 digitos',
  })
  @ApiProperty()
  cpf: string;
}

export class AtualizaClienteDTO {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  nome?: string;

  @IsEmail()
  @IsOptional()
  @ApiPropertyOptional()
  email?: string;
}

export class ClienteDTO {
  id: string;
  nome: string;
  email: string;
  cpf: string;
}
