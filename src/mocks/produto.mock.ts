import { ProdutoModel } from 'src/adapters/outbound/models/produto.model';
import { ProdutoEntity } from 'src/domain/entities/produto.entity';
import {
  categoriaEntity,
  categoriaModel,
  categoriaDTO,
} from './categoria.mock';
import { ProdutoDTO } from 'src/adapters/inbound/rest/v1/presenters/produto.dto';
import { CategoriaDTO } from 'src/adapters/inbound/rest/v1/presenters/categoria.dto';

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

const produtoEntity = new ProdutoEntity(
  'Produto X',
  categoriaEntity,
  5.0,
  'http://',
  'Teste produto x',
  '0a14aa4e-75e7-405f-8301-81f60646c93d',
);

const makeProdutoDTO = (
  id: string,
  nome: string,
  descricao: string,
  valorUnitario: number,
  imagemUrl: string,
  categoria: CategoriaDTO,
): ProdutoDTO => {
  const produtoDTO = new ProdutoDTO();
  produtoDTO.id = id;
  produtoDTO.nome = nome;
  produtoDTO.descricao = descricao;
  produtoDTO.valorUnitario = valorUnitario;
  produtoDTO.imagemUrl = imagemUrl;
  produtoDTO.categoria = categoria;
  return produtoDTO;
};

const produtoDTO = makeProdutoDTO(
  '0a14aa4e-75e7-405f-8301-81f60646c93d',
  'Produto X',
  'Teste produto x',
  5.0,
  'http://',
  categoriaDTO,
);

export { produtoModel, produtoEntity, produtoDTO };
