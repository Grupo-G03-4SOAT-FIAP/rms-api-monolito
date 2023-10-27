import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('clientes')
export class ClienteModel {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column({ name: 'nome', length: 100, nullable: false })
  @ApiProperty()
  nome: string;

  @Column({ name: 'email', length: 100, nullable: false })
  @ApiProperty()
  email: string;

  @Column({ name: 'cpf', length: 100, nullable: false })
  @ApiProperty()
  cpf: string;

  @CreateDateColumn({ name: 'criado_em' })
  @ApiProperty()
  criadoEm: string;

  @UpdateDateColumn({ name: 'atualizado_em' })
  @ApiProperty()
  atualizadoEm: string;

  @DeleteDateColumn({ name: 'excluido_em' })
  @ApiProperty()
  excluidoEm: string;
}
