import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ClienteModel } from './cliente.model';

@Entity('pedidos')
export class PedidoModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'items_pedido', type: 'json', nullable: false }) // tipo 'json' para armazenar uma lista de produtos
  itemsPedido: object[];

  @ManyToOne(() => ClienteModel, { nullable: true })
  @JoinColumn({ name: 'id_cliente' }) // A chave estrangeira
  cliente: ClienteModel | null;

  @Column({ name: 'status_pagamento', length: 10, nullable: false })
  statusPagamento: string;

  @Column({ name: 'status_pedido', length: 20, nullable: false })
  statusPedido: string;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm: string;

  @UpdateDateColumn({ name: 'atualizado_em' })
  atualizadoEm: string;
}
