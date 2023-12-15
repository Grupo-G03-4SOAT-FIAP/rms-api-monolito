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
import { ProdutoModel } from './produto.model';

@Entity('pedidos')
export class PedidoModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'numero_pedido', nullable: false, unique: true })
  numeroPedido: string;

  @Column({ name: 'itens_pedido', type: 'json', nullable: false }) // tipo 'json' para armazenar uma lista de produtos
  itensPedido: ProdutoModel[];

  @ManyToOne(() => ClienteModel, { nullable: true })
  @JoinColumn({ name: 'id_cliente' }) // A chave estrangeira
  cliente: ClienteModel | null;

  @Column({ name: 'status_pedido', length: 20, nullable: false })
  statusPedido: string;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm: string;

  @UpdateDateColumn({ name: 'atualizado_em' })
  atualizadoEm: string;
}
