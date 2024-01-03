import { ProdutoModel } from 'src/adapters/outbound/models/produto.model';
import { ProdutoEntity } from 'src/domain/entities/produto.entity';
import { categoriaEntity, categoriaModel } from './categoria.mock';

const produtoEntity = new ProdutoEntity(
  'Produto X',
  categoriaEntity,
  5.0,
  'http://',
  'Teste produto x',
  '0a14aa4e-75e7-405f-8301-81f60646c93d',
);

const produtoModel = new ProdutoModel();
produtoModel.id = '0a14aa4e-75e7-405f-8301-81f60646c93d';
produtoModel.nome = 'Produto X';
produtoModel.descricao = 'Teste produto x';
produtoModel.valorUnitario = 5.0;
produtoModel.imagemUrl = 'http://';
produtoModel.categoria = categoriaModel;
produtoModel.criadoEm = new Date().toISOString();
produtoModel.atualizadoEm = new Date().toISOString();
produtoModel.excluidoEm = new Date().toISOString();

export { produtoEntity, produtoModel };
