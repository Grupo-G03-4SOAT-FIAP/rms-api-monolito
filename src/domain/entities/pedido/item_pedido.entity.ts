import { ProdutoEntity } from '../produto/produto.entity';

export class ItemPedidoEntity {
  private _produto: ProdutoEntity;
  private _quantidade: number;
  private _id?: string;

  constructor(produto: ProdutoEntity, quantidade: number, id?: string) {
    this._produto = produto;
    this._quantidade = quantidade;
    this._id = id;
  }

  get produto(): ProdutoEntity {
    return this._produto;
  }

  set produto(produto: ProdutoEntity) {
    this._produto = produto;
  }

  get quantidade(): number {
    return this._quantidade;
  }

  set quantidade(quantidade: number) {
    this._quantidade = quantidade;
  }

  get id(): string | undefined {
    return this._id;
  }

  set id(id: string | undefined) {
    this._id = id;
  }
}
