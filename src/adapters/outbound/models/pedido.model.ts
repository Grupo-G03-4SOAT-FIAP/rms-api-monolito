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
import { ApiProperty } from '@nestjs/swagger';

@Entity('pedidos')
export class PedidoModel {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column({ name: 'itens_pedido', type: 'json', nullable: false }) // tipo 'json' para armazenar uma lista de produtos
  @ApiProperty()
  itensPedido: ProdutoModel[];

  @ManyToOne(() => ClienteModel, { nullable: true })
  @JoinColumn({ name: 'id_cliente' }) // A chave estrangeira
  @ApiProperty()
  cliente: ClienteModel | null;

  @Column({ name: 'status_pedido', length: 20, nullable: false })
  @ApiProperty()
  statusPedido: string;

  @CreateDateColumn({ name: 'criado_em' })
  @ApiProperty()
  criadoEm: string;

  @UpdateDateColumn({ name: 'atualizado_em' })
  @ApiProperty()
  atualizadoEm: string;
}
