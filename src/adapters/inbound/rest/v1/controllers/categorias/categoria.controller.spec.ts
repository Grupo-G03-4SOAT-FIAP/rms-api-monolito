import { Test, TestingModule } from '@nestjs/testing';
import { CategoriaController } from './categorias.controller';
import { AtualizaCategoriaDTO } from '../../presenters/dto/categoria/AtualizaCategoria.dto';
import { CriaCategoriaDTO } from '../../presenters/dto/categoria/CriaCategoria.dto';
import { Categoria } from '../../../../../../domain/entities/Categoria';
import { ICategoriaUseCase } from 'src/domain/ports/categoria/ICategoriaUseCase';

// Listagem de categorias como retorna do banco
const todasAsCategorias: Categoria[] = [
  {
    id: '1',
    ativo: true,
    descricao: 'Lanches de todos os tipos',
    nome: 'Lanche',
    updatedAt: '',
    createdAt: '',
    deletedAt: '',
    produtos: [],
  },
  {
    id: '2',
    ativo: true,
    descricao: 'Bebidas de todos os tipos',
    nome: 'Bebidas',
    updatedAt: '',
    createdAt: '',
    deletedAt: '',
    produtos: [],
  },
  {
    id: '3',
    ativo: true,
    descricao: 'Acompanhamento de todos os tipos',
    nome: 'Acompanhamento',
    updatedAt: '',
    createdAt: '',
    deletedAt: '',
    produtos: [],
  },
];

// Categoria baseado no DTO
const categoriaTest = {
  descricao: 'Lanches para todos os tipos',
  nome: 'Lanche',
};

// Implementação da categoria (Entidade)
const novaCategoriaEntidade = new CriaCategoriaDTO(categoriaTest);

// Criação de uma categoria para teste de atualização
const categoriaTestAtualizada = {
  descricao: 'Lanches para todos os tipos - Atualizado',
  nome: 'Lanche Atualizado ',
};
const categoriaEntidadeAtualizada = new AtualizaCategoriaDTO(
  categoriaTestAtualizada,
);

describe('CategoriaController', () => {
  let categoriaController: CategoriaController;
  let categoriaUseCase: ICategoriaUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriaController],
      providers: [
        {
          // Mock dos métodos do service
          provide: ICategoriaUseCase,
          useValue: {
            criaNova: jest.fn().mockResolvedValue(novaCategoriaEntidade),
            listaTodas: jest.fn().mockResolvedValue(todasAsCategorias),
            listaUma: jest.fn().mockResolvedValue(todasAsCategorias[1]),
            atualiza: jest.fn().mockResolvedValue(categoriaEntidadeAtualizada),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    // instânciando controller e service
    categoriaController = module.get<CategoriaController>(CategoriaController);
    categoriaUseCase = module.get<ICategoriaUseCase>(ICategoriaUseCase);
  });

  it('Deve ser definido', () => {
    expect(categoriaController).toBeDefined();
    expect(categoriaUseCase).toBeDefined();
  });

  describe('create', () => {
    it('Deve ser retornado sucesso ao cadastrar uma categoria', async () => {
      const categoria = await categoriaController.criaNovo(
        novaCategoriaEntidade,
      );
      expect(categoria).toEqual(novaCategoriaEntidade);
      expect(categoriaUseCase.criaNova).toHaveBeenCalledTimes(1);
    });

    it('Deve ser lançada uma exceção em caso de erro', () => {
      // usamos o SpyOn para forçar um retorno de erro do método create.
      jest
        .spyOn(categoriaUseCase, 'criaNova')
        .mockRejectedValueOnce(new Error());
      expect(
        categoriaController.criaNovo(novaCategoriaEntidade),
      ).rejects.toThrowError();
    });
  });

  describe('findAll', () => {
    it('Deve ser retornada todas as categorias', async () => {
      const categorias = await categoriaController.listaTodos();
      expect(categorias).toEqual(todasAsCategorias);
      expect(categoriaUseCase.listaTodas).toHaveBeenCalledTimes(1);
    });

    it('Deve ser lançada uma exceção em caso de erro ao buscar todas as categorias', async () => {
      jest
        .spyOn(categoriaUseCase, 'listaTodas')
        .mockRejectedValueOnce(new Error());
      expect(categoriaController.listaTodos()).rejects.toThrowError();
      expect(categoriaUseCase.listaTodas).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOneOrFail', () => {
    it('Deve ser retornada uma categoria', async () => {
      const categorias = await categoriaController.listaUma('1');
      expect(categorias).toEqual(todasAsCategorias[1]);
      expect(categoriaUseCase.listaUma).toHaveBeenCalledTimes(1);
    });

    it('Deve ser lançada uma exceção em caso de erro ao buscar uma categoria', async () => {
      jest
        .spyOn(categoriaUseCase, 'listaUma')
        .mockRejectedValueOnce(new Error());
      expect(categoriaController.listaUma('1')).rejects.toThrowError();
      expect(categoriaUseCase.listaUma).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('Deve ser possível atualizar uma categoria com sucesso', async () => {
      const atualizacaoCategoria = {
        descricao: 'Lanches para todos os tipos - Atualizado',
        nome: 'Lanche Atualizado ',
      };
      const categoriaAtualizar = new AtualizaCategoriaDTO(atualizacaoCategoria);
      const categoriaAtualizada = await categoriaController.atualiza(
        '1',
        categoriaAtualizar,
      );
      expect(categoriaAtualizada).toEqual(categoriaEntidadeAtualizada);
      expect(categoriaUseCase.atualiza).toHaveBeenCalledTimes(1);
      expect(categoriaUseCase.atualiza).toHaveBeenCalledWith(
        '1',
        categoriaAtualizar,
      );
    });

    it('Deve ser lançada uma exceção em caso de erro ao atualizar uma categoria', async () => {
      const body: AtualizaCategoriaDTO = {
        descricao: 'Lanches para todos os tipos - Atualizado',
        nome: 'Lanche Atualizado ',
        ativo: false,
      };
      jest
        .spyOn(categoriaUseCase, 'atualiza')
        .mockRejectedValueOnce(new Error());
      expect(categoriaController.atualiza('1', body)).rejects.toThrowError();
      expect(categoriaUseCase.atualiza).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    it('Deve ser possível remover uma categoria com sucesso', async () => {
      const result = await categoriaController.remove('1');
      expect(result).toBeUndefined();
    });

    it('Deve ser retornada uma exceção em caso de erros ao remover uma categoria', async () => {
      jest.spyOn(categoriaUseCase, 'remove').mockRejectedValueOnce(new Error());
      expect(categoriaController.remove('1')).rejects.toThrowError();
    });
  });
});
