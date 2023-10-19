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

@Entity({ name: 'produtos' })
export class ProdutoModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'nome', length: 100, nullable: false })
  nome: string;

  @Column({ name: 'descricao', length: 255, nullable: true })
  descricao: string;

  @Column({ name: 'valor_unitario', nullable: false })
  valorUnitario: number;

  @Column({ name: 'imagem_url', length: 2048, nullable: true })
  imagemUrl: string;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm: string;

  @UpdateDateColumn({ name: 'atualizado_em' })
  atualizadoEm: string;

  @DeleteDateColumn({ name: 'excluido_em' })
  excluidoEm: string;

  @Column({ name: 'ativo', nullable: false, default: true })
  ativo: boolean;

  @ManyToOne(() => CategoriaModel, (categoria) => categoria.produtos, {
    orphanedRowAction: 'delete',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'id_categoria' })
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
