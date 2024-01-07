import { CategoriaDTO } from 'src/adapters/inbound/rest/v1/presenters/categoria.dto';
import { CategoriaModel } from 'src/adapters/outbound/models/categoria.model';
import { produtoModel } from './produto.mock';
import { CategoriaEntity } from 'src/domain/entities/categoria/categoria.entity';

const categoriaModel = new CategoriaModel();
categoriaModel.id = '0a14aa4e-75e7-405f-8301-81f60646c93d';
categoriaModel.nome = 'Lanche';
categoriaModel.descricao = 'Lanche x tudo';
categoriaModel.produtos = [produtoModel];
categoriaModel.criadoEm = new Date().toISOString();
categoriaModel.atualizadoEm = new Date().toISOString();
categoriaModel.excluidoEm = new Date().toISOString();

const categoriaEntity = new CategoriaEntity(
  'Lanche',
  'Lanche x tudo',
  '0a14aa4e-75e7-405f-8301-81f60646c93d',
);

const makeCategoriaDTO = (
  id: string,
  nome: string,
  descricao: string,
): CategoriaDTO => {
  const categoriaDTO = new CategoriaDTO();
  categoriaDTO.id = id;
  categoriaDTO.nome = nome;
  categoriaDTO.descricao = descricao;
  return categoriaDTO;
};

const categoriaDTO = makeCategoriaDTO(
  categoriaModel.id,
  categoriaModel.nome,
  categoriaModel.descricao,
);

export { categoriaModel, categoriaEntity, categoriaDTO };
