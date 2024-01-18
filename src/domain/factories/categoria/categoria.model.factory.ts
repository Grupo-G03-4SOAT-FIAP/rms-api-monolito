import { Injectable } from '@nestjs/common';
import { CategoriaModel } from 'src/adapters/outbound/models/categoria.model';
import { ProdutoModel } from 'src/adapters/outbound/models/produto.model';
import { ICategoriaModelFactory } from 'src/domain/ports/categoria/categoria.model.factory.port';

@Injectable()
export class CategoriaModelFactory implements ICategoriaModelFactory {
  criarCategoriaModel(
    id: string,
    nome: string,
    descricao: string,
    produtos: ProdutoModel[],
    criadoEm: string,
    atualizadoEm: string,
  ): CategoriaModel {
    const categoriaModel = new CategoriaModel();
    categoriaModel.id = id;
    categoriaModel.nome = nome;
    categoriaModel.descricao = descricao;
    categoriaModel.produtos = produtos;
    categoriaModel.criadoEm = criadoEm;
    categoriaModel.atualizadoEm = atualizadoEm;
    return categoriaModel;
  }
}
