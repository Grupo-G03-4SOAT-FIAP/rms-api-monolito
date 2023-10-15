import { Test, TestingModule } from '@nestjs/testing';
import { CategoriaModel } from '../../../adapters/outbound/models/categoria.model';
import { NotFoundException } from '@nestjs/common';
import { CriaCategoriaDTO } from '../../../adapters/inbound/rest/v1/presenters/dto/categoria/CriaCategoria.dto';
import { AtualizaCategoriaDTO } from '../../../adapters/inbound/rest/v1/presenters/dto/categoria/AtualizaCategoria.dto';
import { CategoriaUseCase } from './categorias.use_case';
import { ICategoriaRepository } from 'src/domain/ports/categoria/ICategoriaRepository';

const ListaCategoriaEntidade: CategoriaModel[] = [
  new CategoriaModel({
    id: '1',
    ativo: true,
    descricao: 'Lanches de todos os tipos',
    nome: 'Lanche',
    updatedAt: '',
    createdAt: '',
    deletedAt: '',
  }),
  new CategoriaModel({
    id: '2',
    ativo: true,
    descricao: 'Bebidas de todos os tipos',
    nome: 'Bebidas',
    updatedAt: '',
    createdAt: '',
    deletedAt: '',
  }),
  new CategoriaModel({
    id: '3',
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

describe('CategoriaUseCase', () => {
  let categoriaUseCase: CategoriaUseCase;
  let categoryRepository: ICategoriaRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriaUseCase,
        {
          provide: ICategoriaRepository,
          useValue: {
            listaCategorias: jest
              .fn()
              .mockResolvedValue(ListaCategoriaEntidade),
            listaCategoria: jest
              .fn()
              .mockResolvedValue(ListaCategoriaEntidade[0]),
            criaCategoria: jest.fn().mockReturnValue(ListaCategoriaEntidade[0]),
            atualizaCategoria: jest
              .fn()
              .mockResolvedValue(updateCategoriaEntidadeItem),
            deletaCategoria: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    categoriaUseCase = module.get<CategoriaUseCase>(CategoriaUseCase);
    categoryRepository = module.get<ICategoriaRepository>(ICategoriaRepository);
  });

  it('should be defined', () => {
    expect(categoriaUseCase).toBeDefined();
    expect(categoryRepository).toBeDefined();
  });

  describe('listaTodas', () => {
    it('Deve ser retornada uma lista de entidades de todas as categorias', async () => {
      const result = await categoriaUseCase.listaTodas();
      expect(result).toEqual(ListaCategoriaEntidade);
      expect(categoryRepository.listaCategorias).toHaveBeenCalledTimes(1);
    });

    it('Deve ser retornada uma exceção em caso de erro', () => {
      jest
        .spyOn(categoryRepository, 'listaCategorias')
        .mockRejectedValueOnce(new Error());
      expect(categoriaUseCase.listaTodas()).rejects.toThrowError();
    });
  });

  describe('listaUma', () => {
    it('Deve ser retornado um item da entidade categoria', async () => {
      const result = await categoriaUseCase.listaUma('1');
      expect(result).toEqual(ListaCategoriaEntidade[0]);
      expect(categoryRepository.listaCategoria).toHaveBeenCalledTimes(1);
    });

    it('Deve ser lançada uma exceção (not found exception) em caso de erro', () => {
      jest
        .spyOn(categoryRepository, 'listaCategoria')
        .mockRejectedValueOnce(new NotFoundException());
      expect(categoriaUseCase.listaUma('1')).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('criaNova', () => {
    it('Deve criar uma categoria com sucesso', async () => {
      const data: CriaCategoriaDTO = {
        ativo: true,
        descricao: 'Lanches para todos os tipos - Atualizado',
        nome: 'Lanche Atualizado ',
      };
      const result = await categoriaUseCase.criaNova(data);
      expect(result).toEqual({
        categoria: ListaCategoriaEntidade[0],
        mensagem: 'categoria criada com sucesso',
      });
      expect(categoryRepository.criaCategoria).toHaveBeenCalledTimes(1);
    });

    it('Deve ser lançada uma exceção em caso de erro', () => {
      const data: CriaCategoriaDTO = {
        ativo: true,
        descricao: 'Lanches para todos os tipos - Atualizado',
        nome: 'Lanche Atualizado ',
      };
      jest
        .spyOn(categoryRepository, 'criaCategoria')
        .mockRejectedValueOnce(new Error());
      expect(categoriaUseCase.criaNova(data)).rejects.toThrowError();
    });
  });

  describe('atualiza', () => {
    it('Deve ser atualiza uma categoria com sucesso', async () => {
      const dados = {
        descricao: 'Lanches para todos os tipos - Atualizado',
        nome: 'Lanche Atualizado ',
      };
      const categoriaAtualizar = new AtualizaCategoriaDTO(dados);
      const result = await categoriaUseCase.atualiza('1', categoriaAtualizar);
      expect(result).toEqual({
        categoria: updateCategoriaEntidadeItem,
        mensagem: 'categoria atualizada com sucesso',
      });
      expect(categoryRepository.listaCategoria).toHaveBeenCalledTimes(1);
    });

    it('Deve lançar uma not found exception se a categoria não existir', async () => {
      const dados = {
        descricao: 'Lanches para todos os tipos - Atualizado',
        nome: 'Lanche Atualizado ',
      };
      const categoriaAtualizar = new AtualizaCategoriaDTO(dados);
      jest
        .spyOn(categoryRepository, 'listaCategoria')
        .mockRejectedValueOnce(new NotFoundException());
      expect(
        categoriaUseCase.atualiza('1', categoriaAtualizar),
      ).rejects.toThrowError(NotFoundException);
    });

    it('Deve lançar uma exceção quando não conseguir salvar', () => {
      const dados = {
        descricao: 'Lanches para todos os tipos - Atualizado',
        nome: 'Lanche Atualizado ',
      };
      const categoriaAtualizar = new AtualizaCategoriaDTO(dados);
      jest
        .spyOn(categoryRepository, 'atualizaCategoria')
        .mockRejectedValueOnce(new Error());
      expect(
        categoriaUseCase.atualiza('1', categoriaAtualizar),
      ).rejects.toThrowError();
    });
  });

  describe('remove', () => {
    it('Deve ser removida a entidade da categoria com sucesso', async () => {
      const result = await categoriaUseCase.remove('1');
      expect(result).toEqual({ mensagem: 'categoria removida com sucesso' });
      expect(categoryRepository.listaCategoria).toHaveBeenCalledTimes(1);
    });

    it('Deve lançar uma not found exception se a categoria não existir', async () => {
      jest
        .spyOn(categoryRepository, 'listaCategoria')
        .mockRejectedValueOnce(new NotFoundException());
      expect(categoriaUseCase.remove('1')).rejects.toThrowError(
        NotFoundException,
      );
    });

    it('Deve lançar uma exception se retornar um erro ao tentar remover a categoria', async () => {
      jest
        .spyOn(categoryRepository, 'deletaCategoria')
        .mockRejectedValueOnce(new NotFoundException());
      expect(categoriaUseCase.remove('1')).rejects.toThrowError();
    });
  });
});
