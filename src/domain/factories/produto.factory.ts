import { Injectable } from '@nestjs/common';
import { CategoriaEntity } from '../entities/categoria.entity';
import { ProdutoEntity } from '../entities/produto.entity';
import { IProdutoFactory } from '../ports/produto/produto.factory.port';
import { AtualizaProdutoDTO, CriaProdutoDTO } from 'src/adapters/inbound/rest/v1/presenters/produto.dto';
import { CategoriaModel } from 'src/adapters/outbound/models/categoria.model';

@Injectable()
export class ProdutoFactory implements IProdutoFactory {
  async criarEntidadeProdutoFromCriaProdutoDTO(categoria: CategoriaModel, criaProdutoDTO: CriaProdutoDTO): Promise<ProdutoEntity> {
    const categoriaEntity = new CategoriaEntity(
      categoria.nome,
      categoria.descricao,
      categoria.id,
    );

    const produtoEntity = new ProdutoEntity(
      criaProdutoDTO.nome,
      categoriaEntity,
      criaProdutoDTO.valorUnitario,
      criaProdutoDTO.imagemUrl,
      criaProdutoDTO.descricao,
    );

    return produtoEntity;
  }

  async criarEntidadeProdutoFromAtualizaProdutoDTO(categoria: CategoriaModel, atualizaProdutoDTO: AtualizaProdutoDTO): Promise<ProdutoEntity> {
    const categoriaEntity = new CategoriaEntity(
      categoria.nome,
      categoria.descricao,
      categoria.id,
    );

    const produtoEntity = new ProdutoEntity(
      atualizaProdutoDTO.nome,
      categoriaEntity,
      atualizaProdutoDTO.valorUnitario,
      atualizaProdutoDTO.imagemUrl,
      atualizaProdutoDTO.descricao,
    );

    return produtoEntity;
  }
}
