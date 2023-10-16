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

interface ICategoriaModel {
  id: string;
  nome: string;
  descricao: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  ativo: boolean;
  produtos: ProdutoModel[];
}

@Entity('categorias')
export class CategoriaModel {
  constructor(categoria?: Partial<ICategoriaModel>) {
    this.id = categoria?.id;
    this.nome = categoria?.nome;
    this.descricao = categoria?.descricao;
    this.ativo = categoria?.ativo;
    this.createdAt = categoria?.createdAt;
    this.updatedAt = categoria?.updatedAt;
    this.deletedAt = categoria?.deletedAt;
    this.produtos = categoria?.produtos;
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'nome', length: 100, nullable: false })
  nome: string;

  @Column({ name: 'descricao', length: 255, nullable: true })
  descricao: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: string;

  @Column({ name: 'ativo', nullable: false, default: true })
  ativo: boolean;

  @OneToMany(() => ProdutoModel, (produtoModel) => produtoModel.categoria, {
    cascade: true,
    eager: false,
  })
  produtos: ProdutoModel[];
}
