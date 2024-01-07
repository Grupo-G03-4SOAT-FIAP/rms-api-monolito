import { Repository } from 'typeorm';
import { CategoriaDTO } from 'src/adapters/inbound/rest/v1/presenters/categoria.dto';
import { CategoriaModel } from 'src/adapters/outbound/models/categoria.model';
import { produtoModelMock } from './produto.mock';
import { CategoriaEntity } from 'src/domain/entities/categoria/categoria.entity';

const categoriaModelMock = new CategoriaModel();
categoriaModelMock.id = '0a14aa4e-75e7-405f-8301-81f60646c93d';
categoriaModelMock.nome = 'Lanche';
categoriaModelMock.descricao = 'Lanche x tudo';
categoriaModelMock.produtos = [produtoModelMock];
categoriaModelMock.criadoEm = new Date().toISOString();
categoriaModelMock.atualizadoEm = new Date().toISOString();
categoriaModelMock.excluidoEm = new Date().toISOString();

const categoriaEntityMock = new CategoriaEntity(
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

const categoriaDTOMock = makeCategoriaDTO(
  categoriaModelMock.id,
  categoriaModelMock.nome,
  categoriaModelMock.descricao,
);

const categoriaTypeORMMock: jest.Mocked<Repository<CategoriaModel>> = {
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
} as Partial<jest.Mocked<Repository<CategoriaModel>>> as jest.Mocked<
  Repository<CategoriaModel>
>;

export {
  categoriaModelMock,
  categoriaEntityMock,
  categoriaDTOMock,
  categoriaTypeORMMock,
};
