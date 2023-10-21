import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CategoriaModel } from '../../models/categoria.model';
import { CategoriaRepository } from '../categoria/categoria.repository';
import { AtualizaCategoriaDTO } from '../../../inbound/rest/v1/presenters/dto/categoria/AtualizaCategoria.dto';
import { ListaCategoriaDTO } from 'src/adapters/inbound/rest/v1/presenters/dto/categoria/ListaCategoria.dto';

const ListaCategoriaEntidade: CategoriaModel[] = [
  new CategoriaModel({
    id: 1,
    ativo: true,
    descricao: 'Lanches de todos os tipos',
    nome: 'Lanche',
    updatedAt: '',
    createdAt: '',
    deletedAt: '',
  }),
  new CategoriaModel({
    id: 2,
    ativo: true,
    descricao: 'Bebidas de todos os tipos',
    nome: 'Bebidas',
    updatedAt: '',
    createdAt: '',
    deletedAt: '',
  }),
  new CategoriaModel({
    id: 2,
    ativo: true,
    descricao: 'Acompanhamento de todos os tipos',
    nome: 'Acompanhamento',
    updatedAt: '',
    createdAt: '',
    deletedAt: '',
  }),
];

const updateCategoriaEntidadeItem = new CategoriaModel({
  descricao: 'Lanches para todos os tipos - Atualizado',
  nome: 'Lanche Atualizado ',
});

describe('CategoriaRepository', () => {
  let categoriaRepository: CategoriaRepository;
  let categoryModel: Repository<CategoriaModel>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriaRepository,
        {
          provide: getRepositoryToken(CategoriaModel),
          useValue: {
            find: jest.fn().mockResolvedValue(ListaCategoriaEntidade),
            findOneOrFail: jest
              .fn()
              .mockResolvedValue(ListaCategoriaEntidade[0]),
            create: jest.fn().mockReturnValue(ListaCategoriaEntidade[0]),
            save: jest.fn().mockResolvedValue(ListaCategoriaEntidade[0]),
            merge: jest.fn().mockResolvedValue(updateCategoriaEntidadeItem),
            softDelete: jest.fn().mockReturnValue(undefined),
          },
        },
      ],
    }).compile();

    categoriaRepository = module.get<CategoriaRepository>(CategoriaRepository);
    categoryModel = module.get<Repository<CategoriaModel>>(
      getRepositoryToken(CategoriaModel),
    );
  });

  it('should be defined', () => {
    expect(categoriaRepository).toBeDefined();
    expect(categoryModel).toBeDefined();
  });

  describe('listaCategorias', () => {
    it('Deve ser retornada uma lista de entidades de todas as categorias', async () => {
      const result = await categoriaRepository.listaCategorias();
      const listaCategoriasEsperadas = result.map(
        (item) => new ListaCategoriaDTO(item),
      );
      expect(result).toEqual(listaCategoriasEsperadas);
      expect(categoryModel.find).toHaveBeenCalledTimes(1);
    });

    it('Deve ser retornada uma exceção em caso de erro', () => {
      jest.spyOn(categoryModel, 'find').mockRejectedValueOnce(new Error());
      expect(categoriaRepository.listaCategorias()).rejects.toThrowError();
    });
  });

  describe('listaCategoria', () => {
    it('Deve ser retornado um item da entidade categoria', async () => {
      const result = await categoriaRepository.listaCategoria(1);
      const categoriaEsperada = new ListaCategoriaDTO(
        ListaCategoriaEntidade[0],
      );
      expect(result).toEqual(categoriaEsperada);
      expect(categoryModel.findOneOrFail).toHaveBeenCalledTimes(1);
    });

    it('Deve ser lançada uma exceção (not found exception) em caso de erro', () => {
      jest
        .spyOn(categoryModel, 'findOneOrFail')
        .mockRejectedValueOnce(new Error());
      expect(categoriaRepository.listaCategoria(1)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('criaCategoria', () => {
    it('Deve criar uma categoria com sucesso', async () => {
      const categoria: CategoriaModel = {
        ativo: true,
        descricao: 'Lanches para todos os tipos - Atualizado',
        nome: 'Lanche Atualizado ',
        id: 0,
        createdAt: '',
        updatedAt: '',
        deletedAt: '',
        produtos: [],
      };
      const result = await categoriaRepository.criaCategoria(categoria);
      expect(result).toEqual(ListaCategoriaEntidade[0]);
      expect(categoryModel.create).toHaveBeenCalledTimes(1);
      expect(categoryModel.save).toHaveBeenCalledTimes(1);
    });

    it('Deve ser lançada uma exceção em caso de erro', () => {
      const categoria: CategoriaModel = {
        ativo: true,
        descricao: 'Lanches para todos os tipos - Atualizado',
        nome: 'Lanche Atualizado ',
        id: 0,
        createdAt: '',
        updatedAt: '',
        deletedAt: '',
        produtos: [],
      };
      jest.spyOn(categoryModel, 'save').mockRejectedValueOnce(new Error());
      expect(
        categoriaRepository.criaCategoria(categoria),
      ).rejects.toThrowError();
    });
  });

  describe('atualizaCategoria', () => {
    it('Deve ser atualiza uma categoria com sucesso', async () => {
      const data = {
        descricao: 'Lanches para todos os tipos - Atualizado',
        nome: 'Lanche Atualizado ',
      };
      const atualizaCategoria = new AtualizaCategoriaDTO(data);
      jest
        .spyOn(categoryModel, 'save')
        .mockResolvedValueOnce(updateCategoriaEntidadeItem);
      const result = await categoriaRepository.atualizaCategoria(
        1,
        atualizaCategoria,
      );
      expect(result).toEqual(updateCategoriaEntidadeItem);
    });

    it('Deve lançar uma not found exception se a categoria não existir', async () => {
      const data = {
        descricao: 'Lanches para todos os tipos - Atualizado',
        nome: 'Lanche Atualizado ',
      };
      const atualizaCategoria = new AtualizaCategoriaDTO(data);
      jest
        .spyOn(categoryModel, 'findOneOrFail')
        .mockRejectedValueOnce(new NotFoundException());
      expect(
        categoriaRepository.atualizaCategoria(1, atualizaCategoria),
      ).rejects.toThrowError(NotFoundException);
    });

    it('Deve lançar uma exceção quando não conseguir salvar', () => {
      const data = {
        descricao: 'Lanches para todos os tipos - Atualizado',
        nome: 'Lanche Atualizado ',
      };
      const atualizaCategoria = new AtualizaCategoriaDTO(data);
      jest.spyOn(categoryModel, 'save').mockRejectedValueOnce(new Error());
      expect(
        categoriaRepository.atualizaCategoria(1, atualizaCategoria),
      ).rejects.toThrowError();
    });
  });

  describe('deletaCategoria', () => {
    it('Deve ser removida a entidade da categoria com sucesso', async () => {
      const result = await categoriaRepository.deletaCategoria(1);
      expect(result).toBeUndefined();
      expect(categoryModel.findOneOrFail).toHaveBeenCalledTimes(1);
      expect(categoryModel.softDelete).toHaveBeenCalledTimes(1);
    });

    it('Deve lançar uma not found exception se a categoria não existir', async () => {
      jest
        .spyOn(categoryModel, 'findOneOrFail')
        .mockRejectedValueOnce(new NotFoundException());
      expect(categoriaRepository.deletaCategoria(1)).rejects.toThrowError(
        NotFoundException,
      );
    });

    it('Deve lançar uma exception se retornar um erro ao tentar remover a categoria', async () => {
      jest
        .spyOn(categoryModel, 'softDelete')
        .mockRejectedValueOnce(new Error());
      expect(categoriaRepository.deletaCategoria(1)).rejects.toThrowError();
    });
  });
});
