import { ProdutoEntity } from "../entities/produto.entity";
import { AtualizaProdutoDTO, CriaProdutoDTO } from "src/presentation/rest/v1/presenters/produto/produto.dto";
import { CategoriaEntity } from "src/domain/categoria/entities/categoria.entity";

export interface IProdutoFactory {
  criarEntidadeCategoria(categoriaId: string): Promise<CategoriaEntity>;
  criarEntidadeProduto(
    produto: CriaProdutoDTO | AtualizaProdutoDTO,
  ): Promise<ProdutoEntity>;
}

export const IProdutoFactory = Symbol('IProdutoFactory');
