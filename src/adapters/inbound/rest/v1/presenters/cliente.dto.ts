import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  MaxLength,
  
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CriaClienteDTO {
  @IsString()
  @IsNotEmpty({ message: 'Nome do Cliente não pode ser vazio' })
  @ApiProperty({ description: 'Nome do cliente' })
  nome: string;

  @IsEmail()
  @IsNotEmpty({
    message: 'Email não pode ser vazio',
  })
  @ApiProperty({ description: 'Endereço de e-mail do cliente' })
  email: string;

  @IsString()
  @IsNotEmpty({
    message: 'CPF não pode ser vazio',
  })
  @MaxLength(11, {
    message: 'CPF precisa ter 11 dígitos',
  })
  @ApiProperty({ description: 'CPF do cliente' })
  cpf: string;
}

export class AtualizaClienteDTO {
  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Nome do cliente', required: false })
  nome?: string;

  @IsEmail()
  @IsOptional()
  @ApiProperty({
    description: 'Endereço de e-mail do cliente',
    required: false,
  })
  email?: string;
}

export class ClienteDTO {
  @ApiProperty({ description: 'ID do cliente' })
  id: string;

  @ApiProperty({ description: 'Nome do cliente' })
  nome: string;

  @ApiProperty({ description: 'Endereço de e-mail do cliente' })
  email: string;

  @ApiProperty({ description: 'CPF do cliente' })
  cpf: string;
}
