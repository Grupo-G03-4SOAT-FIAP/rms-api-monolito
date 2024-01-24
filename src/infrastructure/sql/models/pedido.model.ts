import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ClienteModel } from './cliente.model';
import { ItemPedidoModel } from './item_pedido.model';

@Entity('pedidos')
export class PedidoModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'numero_pedido', nullable: false, unique: true })
  numeroPedido: string;

  @OneToMany(() => ItemPedidoModel, (itemPedido) => itemPedido.pedido, {
    nullable: false,
  })
  itensPedido: ItemPedidoModel[];

  @ManyToOne(() => ClienteModel, { nullable: true })
  @JoinColumn({ name: 'id_cliente' })
  cliente: ClienteModel | null;

  @Column({ name: 'pago', nullable: false })
  pago: boolean;

  @Column({ name: 'status_pedido', length: 20, nullable: false })
  statusPedido: string;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm: string;

  @UpdateDateColumn({ name: 'atualizado_em' })
  atualizadoEm: string;
}
