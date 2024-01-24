import { Inject, Injectable } from '@nestjs/common';
import { IProdutoDTOFactory } from '../interfaces/produto.dto.factory.port';
import { ICategoriaDTOFactory } from 'src/domain/categoria/interfaces/categoria.dto.factory.port';
import { ProdutoModel } from 'src/infrastructure/sql/models/produto.model';
import { ProdutoDTO } from 'src/presentation/rest/v1/presenters/produto/produto.dto';

@Injectable()
export class ProdutoDTOFactory implements IProdutoDTOFactory {
  constructor(
    @Inject(ICategoriaDTOFactory)
    private readonly categoriaDTOFactory: ICategoriaDTOFactory,
  ) {}

  criarProdutoDTO(produto: ProdutoModel): ProdutoDTO {
    const categoriaDTO = this.categoriaDTOFactory.criarCategoriaDTO(
      produto.categoria,
    );

    const produtoDTO = new ProdutoDTO();
    produtoDTO.id = produto.id;
    produtoDTO.nome = produto.nome;
    produtoDTO.descricao = produto.descricao;
    produtoDTO.valorUnitario = produto.valorUnitario;
    produtoDTO.imagemUrl = produto.imagemUrl;
    produtoDTO.categoria = categoriaDTO;

    return produtoDTO;
  }

  criarListaProdutoDTO(produtos: ProdutoModel[]): ProdutoDTO[] | [] {
    const listaProdutosDTO = produtos.map((produto: ProdutoModel) => {
      const categoriaDTO = this.categoriaDTOFactory.criarCategoriaDTO(
        produto.categoria,
      );

      const produtoDTO = new ProdutoDTO();
      produtoDTO.id = produto.id;
      produtoDTO.nome = produto.nome;
      produtoDTO.descricao = produto.descricao;
      produtoDTO.valorUnitario = produto.valorUnitario;
      produtoDTO.imagemUrl = produto.imagemUrl;
      produtoDTO.categoria = categoriaDTO;
      return produtoDTO;
    });

    return listaProdutosDTO;
  }
}
