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

  @Column({ name: 'imagem_url', length: 2048, nullable: false })
  @ApiProperty()
  imagemUrl: string;

  @CreateDateColumn({ name: 'criado_em' })
  @ApiProperty()
  criadoEm: string;

  @UpdateDateColumn({ name: 'atualizado_em' })
  @ApiProperty()
  atualizadoEm: string;

  @DeleteDateColumn({ name: 'excluido_em' })
  @ApiProperty()
  excluidoEm: string;

  @ManyToOne(() => CategoriaModel, (categoria) => categoria.produtos, {
    orphanedRowAction: 'delete',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'categoria_id' })
  @ApiProperty()
  categoria: CategoriaModel;
}
