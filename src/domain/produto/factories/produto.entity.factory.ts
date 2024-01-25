import { Injectable } from '@nestjs/common';
import { IProdutoEntityFactory } from '../interfaces/produto.entity.factory.port';
import { CategoriaEntity } from 'src/domain/categoria/entities/categoria.entity';
import { CategoriaModel } from 'src/infrastructure/sql/models/categoria.model';
import { ProdutoModel } from 'src/infrastructure/sql/models/produto.model';
import { ProdutoEntity } from '../entities/produto.entity';

@Injectable()
export class ProdutoEntityFactory implements IProdutoEntityFactory {
    criarEntidadeCategoria(categoriaModel: CategoriaModel): CategoriaEntity {
        const categoriaEntity = new CategoriaEntity(categoriaModel.nome, categoriaModel.descricao, categoriaModel.id);
        return categoriaEntity;
    }

    criarEntidadeProduto(produtoModel: ProdutoModel): ProdutoEntity {
        let categoriaEntity = undefined;
        if (produtoModel.categoria) {
            categoriaEntity = this.criarEntidadeCategoria(produtoModel.categoria);
        }

        return new ProdutoEntity(
            produtoModel.nome,
            categoriaEntity,
            produtoModel.valorUnitario,
            produtoModel.imagemUrl,
            produtoModel.descricao,
            produtoModel.id,
        );
    }
}
