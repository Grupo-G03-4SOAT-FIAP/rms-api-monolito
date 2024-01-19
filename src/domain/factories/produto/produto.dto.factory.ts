import { Inject, Injectable } from '@nestjs/common';
import { ProdutoDTO } from 'src/adapters/inbound/rest/v1/presenters/produto.dto';
import { ProdutoModel } from 'src/adapters/outbound/models/produto.model';
import { ICategoriaDTOFactory } from 'src/domain/ports/categoria/categoria.dto.factory.port';
import { IProdutoDTOFactory } from 'src/domain/ports/produto/produto.dto.factory.port';

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
