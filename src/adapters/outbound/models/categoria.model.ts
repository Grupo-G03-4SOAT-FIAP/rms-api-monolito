import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { ProdutoModel } from './produto.model';
import { ApiProperty } from '@nestjs/swagger';

@Entity('categorias')
export class CategoriaModel {
  constructor(categoria: {
    id?: number;
    nome?: string;
    descricao?: string;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
    ativo?: boolean;
  }) {
    this.id = categoria?.id;
    this.nome = categoria?.nome;
    this.descricao = categoria?.descricao;
    this.ativo = categoria?.ativo;
    this.createdAt = categoria?.createdAt;
    this.updatedAt = categoria?.updatedAt;
    this.deletedAt = categoria?.deletedAt;
  }
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ name: 'nome', length: 100, nullable: false })
  @ApiProperty()
  nome: string;

  @Column({ name: 'descricao', length: 255, nullable: true })
  @ApiProperty()
  descricao: string;

  @CreateDateColumn({ name: 'created_at' })
  @ApiProperty()
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  @ApiProperty()
  updatedAt: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  @ApiProperty()
  deletedAt: string;

  @Column({ name: 'ativo', nullable: false, default: true })
  @ApiProperty()
  ativo: boolean;

  @OneToMany(() => ProdutoModel, (produtoModel) => produtoModel.categoria, {
    cascade: true,
    eager: false,
  })
  @ApiProperty()
  produtos: ProdutoModel[];
}
