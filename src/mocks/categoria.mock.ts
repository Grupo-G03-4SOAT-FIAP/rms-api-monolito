import { Repository } from 'typeorm';
import {
  CategoriaDTO,
  CriaCategoriaDTO,
} from 'src/adapters/inbound/rest/v1/presenters/categoria.dto';
import { CategoriaModel } from 'src/adapters/outbound/models/categoria.model';
import { produtoModelMock } from './produto.mock';
import { CategoriaEntity } from 'src/domain/entities/categoria/categoria.entity';

export const categoriaModelMock = new CategoriaModel();
categoriaModelMock.id = '0a14aa4e-75e7-405f-8301-81f60646c93d';
categoriaModelMock.nome = 'Lanche';
categoriaModelMock.descricao = 'Lanche x tudo';
categoriaModelMock.produtos = [produtoModelMock];
categoriaModelMock.criadoEm = new Date().toISOString();
categoriaModelMock.atualizadoEm = new Date().toISOString();
categoriaModelMock.excluidoEm = new Date().toISOString();

export const makeCategoriaModel = (
  id: string,
  nome: string,
  descricao: string,
  produtos = null,
  criadoEm = new Date().toISOString(),
  atualizadoEm = new Date().toISOString(),
): CategoriaModel => {
  const categoriaModel = new CategoriaModel();
  categoriaModel.id = id;
  categoriaModel.nome = nome;
  categoriaModel.descricao = descricao;
  categoriaModel.produtos = produtos;
  categoriaModel.criadoEm = criadoEm;
  categoriaModel.atualizadoEm = atualizadoEm;
  return categoriaModel;
};

export const makeCriaCategoriaDTO = (
  nome: string,
  descricao: string,
): CriaCategoriaDTO => {
  const criaCategoriaDTO = new CriaCategoriaDTO();
  criaCategoriaDTO.nome = nome;
  criaCategoriaDTO.descricao = descricao;
  return criaCategoriaDTO;
};

export const makeCategoriaDTO = (
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

export const categoriaEntityMock = new CategoriaEntity(
  'Lanche',
  'Lanche x tudo',
  '0a14aa4e-75e7-405f-8301-81f60646c93d',
);

export const categoriaDTOMock = makeCategoriaDTO(
  categoriaModelMock.id,
  categoriaModelMock.nome,
  categoriaModelMock.descricao,
);

export const categoriaTypeORMMock: jest.Mocked<Repository<CategoriaModel>> = {
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
} as Partial<jest.Mocked<Repository<CategoriaModel>>> as jest.Mocked<
  Repository<CategoriaModel>
>;

export const categoriaRepositoryMock = {
  criarCategoria: jest.fn(),
  editarCategoria: jest.fn(),
  excluirCategoria: jest.fn(),
  buscarCategoriaPorId: jest.fn(),
  buscarCategoriaPorNome: jest.fn(),
  listarCategorias: jest.fn(),
};

export const categoriaDTOFactoryMock = {
  criarCategoriaDTO: jest.fn(),
  criarListaCategoriaDTO: jest.fn(),
};

export const novaCategoriaModelMock = makeCategoriaModel(
  '0a14aa4e-75e7-405f-8301-81f60646c93c',
  'Nova Categoria',
  'Nova Descrição',
);

export const categoriaAtualizadaModelMock = makeCategoriaModel(
  '0a14aa4e-75e7-405f-8301-81f60646c93c',
  'Novo Nome',
  'Nova Descrição',
);

export const listaCategoriasModel: CategoriaModel[] = [];
listaCategoriasModel.push(categoriaAtualizadaModelMock);
listaCategoriasModel.push(novaCategoriaModelMock);
listaCategoriasModel.push(categoriaModelMock);

export const novaCategoriaDTO = makeCategoriaDTO(
  novaCategoriaModelMock.id,
  novaCategoriaModelMock.nome,
  novaCategoriaModelMock.descricao,
);

export class SoftDeleteMock {
  softDelete: jest.Mock = jest.fn();
}

export const categoriaSoftDeleteMock = new SoftDeleteMock();
