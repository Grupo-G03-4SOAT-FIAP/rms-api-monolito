import { ClienteEntity } from "src/domain/cliente/entities/cliente.entity";
import { StatusPedido } from "../enums/pedido.enum";
import { ItemPedidoEntity } from "./item_pedido.entity";

export class PedidoEntity {
  private _itensPedido: ItemPedidoEntity[];
  private _statusPedido: StatusPedido;
  private _numeroPedido: string;
  private _pago: boolean;
  private _cliente?: ClienteEntity;
  private _id?: string;

  constructor(
    itensPedido: ItemPedidoEntity[],
    statusPedido: StatusPedido,
    numeroPedido: string,
    pago: boolean,
    cliente?: ClienteEntity,
    id?: string,
  ) {
    this.id = id;
    this.numeroPedido = numeroPedido;
    this.pago = pago;
    this.itensPedido = itensPedido;
    this.cliente = cliente;
    this.statusPedido = statusPedido;
  }

  get itensPedido(): ItemPedidoEntity[] {
    return this._itensPedido;
  }

  set itensPedido(itensPedido: ItemPedidoEntity[]) {
    this._itensPedido = itensPedido;
  }

  get statusPedido(): StatusPedido {
    return this._statusPedido;
  }

  set statusPedido(statusPedido: StatusPedido) {
    this._statusPedido = statusPedido;
  }

  get numeroPedido(): string {
    return this._numeroPedido;
  }

  set numeroPedido(numeroPedido: string) {
    this._numeroPedido = numeroPedido;
  }

  get pago(): boolean {
    return this._pago;
  }

  set pago(pago: boolean) {
    this._pago = pago;
  }

  get cliente(): ClienteEntity | undefined {
    return this._cliente;
  }

  set cliente(cliente: ClienteEntity | undefined) {
    this._cliente = cliente;
  }

  get id(): string | undefined {
    return this._id;
  }

  set id(id: string | undefined) {
    this._id = id;
  }
}
