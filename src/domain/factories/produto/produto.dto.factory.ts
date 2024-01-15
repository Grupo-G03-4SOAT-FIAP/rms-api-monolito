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
  ) { }

  async criarProdutoDTO(produto: ProdutoModel): Promise<ProdutoDTO> {
    const categoriaDTO = await this.categoriaDTOFactory.criarCategoriaDTO(
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

  async criarListaProdutoDTO(
    produtos: ProdutoModel[],
  ): Promise<ProdutoDTO[] | []> {
    const listaProdutosDTO = await Promise.all(
      produtos.map(async (produto: ProdutoModel) => {
        const produtoDTO = new ProdutoDTO();
        produtoDTO.id = produto.id;
        produtoDTO.nome = produto.nome;
        produtoDTO.descricao = produto.descricao;
        produtoDTO.valorUnitario = produto.valorUnitario;
        produtoDTO.imagemUrl = produto.imagemUrl;

        if (produtoDTO.categoria) {
          produtoDTO.categoria = await this.categoriaDTOFactory.criarCategoriaDTO(
            produto.categoria,
          );
        }

        return produtoDTO;
      }),
    );

    return listaProdutosDTO;
  }
}
