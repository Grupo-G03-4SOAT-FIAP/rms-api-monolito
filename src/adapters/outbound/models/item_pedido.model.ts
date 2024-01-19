import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PedidoModel } from './pedido.model';
import { ProdutoModel } from './produto.model';

@Entity('itens_pedido')
export class ItemPedidoModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => PedidoModel, (pedido) => pedido.itensPedido, {
    nullable: false,
  })
  @JoinColumn({ name: 'pedido_id' })
  pedido: PedidoModel;

  @ManyToOne(() => ProdutoModel)
  @JoinColumn({ name: 'produto_id' })
  produto: ProdutoModel;

  @Column({ name: 'quantidade', nullable: false })
  quantidade: number;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm: string;

  @UpdateDateColumn({ name: 'atualizado_em' })
  atualizadoEm: string;
}
