import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { CategoriaController } from '../../src/presentation/rest/v1/controllers/categoria/categoria.controller';
import { ClienteController } from '../../src/presentation/rest/v1/controllers/cliente/cliente.controller';
import { ProdutoController } from '../../src/presentation/rest/v1/controllers/produto/produto.controller';
import { criarFakeCategoriaDTO } from '../../src/mocks/categoria.mock';
import { criarFakeProdutoDTO } from '../../src/mocks/produto.mock';
import { criarFakeClienteDTO } from '../../src/mocks/cliente.mock';
import { HTTPResponse } from '../../src/application/common/HTTPResponse';
import { ProdutoDTO } from '../../src/presentation/rest/v1/presenters/produto/produto.dto';
import { ClienteDTO } from '../../src/presentation/rest/v1/presenters/cliente/cliente.dto';
import { ItemPedidoDTOFactory } from '../../src/domain/pedido/factories/item_pedido.dto.factory';
import { PedidoDTOFactory } from '../../src/domain/pedido/factories/pedido.dto.factory';
import { IProdutoDTOFactory } from '../../src/domain/produto/interfaces/produto.dto.factory.port';
import { IClienteDTOFactory } from '../../src/domain/cliente/interfaces/cliente.dto.factory.port';
import { CategoriaDTO } from '../../src/presentation/rest/v1/presenters/categoria/categoria.dto';
import { PedidoModel } from '../../src/infrastructure/sql/models/pedido.model';

describe('Pedido (e2e)', () => {
  let app: INestApplication;
  let categoriaController: CategoriaController;
  let produtoController: ProdutoController;
  let clienteController: ClienteController;
  let categoriaDTO: HTTPResponse<CategoriaDTO>;
  let produtoDTO: HTTPResponse<ProdutoDTO>;
  let clientDTO: HTTPResponse<ClienteDTO>;
  let itemPedidoFactory: ItemPedidoDTOFactory;
  let pedidoDTOFactory: PedidoDTOFactory;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        ItemPedidoDTOFactory,
        PedidoDTOFactory,
        {
          provide: IProdutoDTOFactory,
          useValue: criarFakeProdutoDTO,
        },
        {
          provide: IClienteDTOFactory,
          useValue: criarFakeClienteDTO,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    categoriaController =
      moduleFixture.get<CategoriaController>(CategoriaController);
    produtoController = moduleFixture.get<ProdutoController>(ProdutoController);
    clienteController = moduleFixture.get<ClienteController>(ClienteController);
    itemPedidoFactory =
      moduleFixture.get<ItemPedidoDTOFactory>(ItemPedidoDTOFactory);
    pedidoDTOFactory = moduleFixture.get<PedidoDTOFactory>(PedidoDTOFactory);
    await app.init();

    categoriaDTO = await categoriaController.criar(criarFakeCategoriaDTO());
    produtoDTO = await produtoController.criar(
      criarFakeProdutoDTO(categoriaDTO.body.id),
    );
    clientDTO = await clienteController.criar(criarFakeClienteDTO());
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /pedido', () => {
    it('Deve ser possível realizar o checkout de um pedido', async () => {
      const item = itemPedidoFactory.criarItemPedidoDTO(produtoDTO.body.id, 1);
      const pedido = pedidoDTOFactory.criarCriaPedidoDTO(clientDTO.body.cpf, [
        item,
      ]);

      const pedidoRegistrado = await request(app.getHttpServer())
        .post('/pedido')
        .send(pedido)
        .expect(HttpStatus.CREATED)
        .then((response) => {
          return response.body;
        });

      const pedidoModel: PedidoModel = pedidoRegistrado.body;
      expect(pedidoRegistrado.mensagem).toBe('Pedido criado com sucesso');
      expect(pedidoModel.pago).toBeFalsy();
      expect(pedidoModel.statusPedido).toBe('recebido');

      expect(pedidoModel.cliente).toEqual(clientDTO.body);

      expect(pedidoModel.itensPedido).toHaveLength(1);
      expect(pedidoModel.itensPedido[0].produto.id).toBe(produtoDTO.body.id);
      console.log(pedidoModel.itensPedido[0]);
    });
  });
});
