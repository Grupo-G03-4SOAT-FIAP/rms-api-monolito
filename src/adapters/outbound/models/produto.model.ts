import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CategoriaModel } from './categoria.model';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'produtos' })
export class ProdutoModel {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column({ name: 'nome', length: 100, nullable: false })
  @ApiProperty()
  nome: string;

  @Column({ name: 'descricao', length: 255, nullable: true })
  @ApiProperty()
  descricao: string;

  @Column({ name: 'valor_unitario', nullable: false })
  @ApiProperty()
  valorUnitario: number;

  @Column({ name: 'imagem_url', length: 2048, nullable: true })
  @ApiProperty()
  imagemUrl: string;

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

  @ManyToOne(() => CategoriaModel, (categoria) => categoria.produtos, {
    orphanedRowAction: 'delete',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'id_categoria' })
  @ApiProperty({ type: Number })
  categoria: CategoriaModel;

  constructor(
    id?: string,
    nome?: string,
    descricao?: string,
    valorUnitario?: number,
    imagemUrl?: string,
    categoria?: CategoriaModel,
    ativo: boolean = true,
  ) {
    this.id = id;
    this.nome = nome;
    this.descricao = descricao;
    this.valorUnitario = valorUnitario;
    this.imagemUrl = imagemUrl;
    this.categoria = categoria;
    this.ativo = ativo;
  }
}
