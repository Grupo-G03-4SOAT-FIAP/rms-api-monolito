import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PedidoModel } from './pedido.model';

@Entity('cliente_pedido')
export class ClientePedidoModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'nome', length: 100, nullable: false })
  nome: string;

  @Column({ name: 'email', length: 100, nullable: false })
  email: string;

  @Column({ name: 'cpf', length: 100, nullable: false })
  cpf: string;

  @OneToOne(() => PedidoModel, { nullable: false })
  @JoinColumn({ name: 'id_pedido' })
  pedido: PedidoModel;
}
