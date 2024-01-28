import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  MaxLength,
  IsDefined,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CriaClienteDTO {
  @IsString()
  @IsNotEmpty({ message: 'Nome do Cliente não pode ser vazio' })
  @IsDefined({ each: true, message: 'Nome não pode ser nulo' })
  @ApiProperty({ description: 'Nome do cliente' })
  nome: string;

  @IsEmail()
  @IsNotEmpty({
    message: 'Email não pode ser vazio',
  })
  @IsDefined({ each: true, message: 'Email não pode ser nulo' })
  @ApiProperty({ description: 'Endereço de e-mail do cliente' })
  email: string;

  @IsString()
  @IsNotEmpty({
    message: 'CPF não pode ser vazio',
  })
  @MaxLength(11, {
    message: 'CPF precisa ter 11 dígitos',
  })
  @IsDefined({ each: true, message: 'CPF não pode ser nulo' })
  @ApiProperty({ description: 'CPF do cliente' })
  cpf: string;
}

export class AtualizaClienteDTO {
  @IsString()
  @IsOptional()
  @IsDefined({ each: true, message: 'Nome não pode ser nulo' })
  @ApiProperty({ description: 'Nome do cliente', required: false })
  nome?: string;

  @IsEmail()
  @IsOptional()
  @IsDefined({ each: true, message: 'Nome não pode ser nulo' })
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
