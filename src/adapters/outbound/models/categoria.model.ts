import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ProdutoModel } from './produto.model';
import { ApiProperty } from '@nestjs/swagger';

@Entity('categorias')
export class CategoriaModel {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column({ name: 'nome', length: 100, nullable: false })
  @ApiProperty()
  nome: string;

  @Column({ name: 'descricao', length: 255, nullable: true })
  @ApiProperty()
  descricao: string;

  @CreateDateColumn({ name: 'criado_em' })
  @ApiProperty()
  criadoEm: string;

  @UpdateDateColumn({ name: 'atualizado_em' })
  @ApiProperty()
  atualizadoEm: string;

  @DeleteDateColumn({ name: 'excluido_em' })
  @ApiProperty()
  excluidoEm: string;

  @OneToMany(() => ProdutoModel, (produtoModel) => produtoModel.categoria, {
    cascade: true,
    eager: false,
  })
  @JoinColumn({ name: 'categoria_id' })
  @ApiProperty()
  produtos: ProdutoModel[];
}
