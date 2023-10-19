import { CriaProdutoDTO } from './CriaProduto.dto';

export class AtualizaProdutoDTO extends CriaProdutoDTO {
  constructor(
    nome?: string,
    descricao?: string,
    valorUnitario?: number,
    imagemUrl?: string,
    ativo: boolean = true,
    idCategoria?: string,
  ) {
    super();
    this.nome = nome;
    this.descricao = descricao;
    this.valorUnitario = valorUnitario;
    this.imagemUrl = imagemUrl;
    this.ativo = ativo;
    this.idCategoria = idCategoria;
  }
}
