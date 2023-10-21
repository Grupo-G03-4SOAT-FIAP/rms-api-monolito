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
  id: number;

  @Column({ name: 'nome', length: 100, nullable: false })
  nome: string;

  @Column({ name: 'descricao', length: 255, nullable: true })
  descricao: string;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm: string;

  @UpdateDateColumn({ name: 'atualizado_em' })
  atualizadoEm: string;

  @DeleteDateColumn({ name: 'excluido_em' })
  excluidoEm: string;

  @Column({ name: 'ativo', nullable: false, default: true })
  ativo: boolean;

  @OneToMany(() => ProdutoModel, (produtoModel) => produtoModel.categoria, {
    cascade: true,
    eager: false,
  })
  produtos: ProdutoModel[];
}
