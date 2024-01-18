import { CategoriaModel } from 'src/adapters/outbound/models/categoria.model';
import { ProdutoModel } from 'src/adapters/outbound/models/produto.model';

export interface ICategoriaModelFactory {
  criarCategoriaModel(
    id: string,
    nome: string,
    descricao: string,
    produtos: ProdutoModel[] | null,
    criadoEm: string,
    atualizadoEm: string,
  ): CategoriaModel;
}
