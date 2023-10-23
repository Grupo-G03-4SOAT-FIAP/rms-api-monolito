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

@Entity('categorias')
export class CategoriaModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'nome', length: 100, nullable: false })
  nome: string;

  @Column({ name: 'descricao', length: 255, nullable: true })
  descricao: string;

  @OneToMany(() => ProdutoModel, (produtoModel) => produtoModel.categoria, {
    cascade: true,
    eager: false,
  })
  @JoinColumn({ name: 'categoriaId' })
  produtos: ProdutoModel[];

  @Column({ name: 'ativo', nullable: false, default: true })
  ativo: boolean;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm: string;

  @UpdateDateColumn({ name: 'atualizado_em' })
  atualizadoEm: string;

  @DeleteDateColumn({ name: 'excluido_em' })
  excluidoEm: string;
}
