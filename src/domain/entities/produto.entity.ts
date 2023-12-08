import { ToCapitalizeString } from 'src/utils/capitalize_string';
import { CategoriaEntity } from './categoria.entity';

export class ProdutoEntity {
  private _nome: string;
  categoria: CategoriaEntity;
  valorUnitario: number;
  imagemUrl: string;
  private _descricao?: string;
  id?: string;

  constructor(
    nome: string,
    categoria: CategoriaEntity,
    valorUnitario: number,
    imagemUrl: string,
    descricao?: string,
    id?: string,
  ) {
    this.id = id;
    this.nome = nome;
    this.descricao = descricao;
    this.categoria = categoria;
    this.valorUnitario = valorUnitario;
    this.imagemUrl = imagemUrl;
  }

  get nome(): string {
    return this._nome;
  }

  set nome(nome: string) {
    const capitalizedNome = new ToCapitalizeString(nome);
    this._nome = capitalizedNome.input;
  }

  get descricao(): string {
    return this._descricao;
  }
  
  set descricao(descricao: string) {
    const capitalizedDescricao = new ToCapitalizeString(descricao);
    this._descricao = capitalizedDescricao.input;
  }
}
