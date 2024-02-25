import { Inject, Injectable } from '@nestjs/common';
import { IProdutoDTOFactory } from '../interfaces/produto.dto.factory.port';
import { ICategoriaDTOFactory } from '../../../domain/categoria/interfaces/categoria.dto.factory.port';
import { ProdutoDTO } from '../../../presentation/rest/v1/presenters/produto/produto.dto';
import { ProdutoEntity } from '../entities/produto.entity';

@Injectable()
export class ProdutoDTOFactory implements IProdutoDTOFactory {
  constructor(
    @Inject(ICategoriaDTOFactory)
    private readonly categoriaDTOFactory: ICategoriaDTOFactory,
  ) {}

  criarProdutoDTO(produto: ProdutoEntity): ProdutoDTO {
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

  criarListaProdutoDTO(produtos: ProdutoEntity[]): ProdutoDTO[] | [] {
    const listaProdutosDTO = produtos.map((produto: ProdutoEntity) => {
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
