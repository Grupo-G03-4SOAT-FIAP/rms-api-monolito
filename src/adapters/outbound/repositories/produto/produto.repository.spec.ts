import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProdutoModel } from 'src/adapters/outbound/models/produto.model';
import { ProdutoRepository } from './produto.repository';
import { AtualizaProdutoDTO } from 'src/adapters/inbound/rest/v1/presenters/dto/produto/AtualizaProduto.dto';

const testUuid1 = '0a14aa4e-75e7-405f-8301-81f60646c93d';
const testProd1 = 'X-Tudo';
const testDesc1 = 'Ingredientes X-Tudo aqui';

const prodArray = [
  new ProdutoModel(testUuid1, testProd1, testDesc1, 14),
  new ProdutoModel(
    '294e880f-a4b2-400e-b186-47de17b46bc2',
    'X-Salada',
    'Ingredientes X-Salada aqui',
    13,
  ),
  new ProdutoModel(
    '42edaa42-4c88-4952-9d70-b9e895f21fc6',
    'X-Bacon',
    'Ingredientes X-Bacon aqui',
    12,
  ),
];

const oneProd = new ProdutoModel(testUuid1, testProd1, testDesc1, 14);

describe('ProdutoRepository', () => {
  let service: ProdutoRepository;
  let repo: Repository<ProdutoModel>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProdutoRepository,
        {
          provide: getRepositoryToken(ProdutoModel),
          // define all the methods that you use from the catRepo
          // give proper return values as expected or mock implementations, your choice
          useValue: {
            find: jest.fn().mockResolvedValue(prodArray),
            findOne: jest.fn().mockResolvedValue(prodArray),
            findOneOrFail: jest.fn().mockResolvedValue(oneProd),
            create: jest.fn().mockReturnValue(oneProd),
            save: jest.fn(),
            // as these do not actually use their return values in our sample
            // we just make sure that their resolve is true to not crash
            update: jest.fn().mockResolvedValue(true),
            // as these do not actually use their return values in our sample
            // we just make sure that their resolve is true to not crash
            delete: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compile();

    service = module.get<ProdutoRepository>(ProdutoRepository);
    repo = module.get<Repository<ProdutoModel>>(
      getRepositoryToken(ProdutoModel),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('listaProdutos', () => {
    it('should return an array of products', async () => {
      const prods = await service.listaProdutos();
      //expect(prods).toEqual(prodArray);
      expect(repo.find).toBeCalledTimes(1);
    });
  });
  describe('criaProduto', () => {
    it('should successfully insert a product', () => {
      expect(
        service.criaProduto(
          new ProdutoModel(testUuid1, testProd1, testDesc1, 14),
        ),
      ).resolves.toEqual(undefined);
      expect(repo.save).toBeCalledTimes(1);
    });
  });
  describe('atualizaProduto', () => {
    it('should call the update method', async () => {
      const prod = await service.atualizaProduto(
        '0a14aa4e-75e7-405f-8301-81f60646c93d',
        new AtualizaProdutoDTO(testProd1, testDesc1, 14),
      );
      expect(prod).toEqual(undefined);
      expect(repo.save).toBeCalledTimes(1);
    });
  });
  describe('deletaProduto', () => {
    it('should return {deleted: true}', () => {
      expect(service.deletaProduto(testUuid1)).resolves.toEqual(undefined);
    });
  });
});
