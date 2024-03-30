import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { HTTPResponse } from '../../src/application/common/HTTPResponse';
import { CategoriaController } from '../../src/presentation/rest/v1/controllers/categoria/categoria.controller';
// import { ClienteController } from '../../src/presentation/rest/v1/controllers/cliente/cliente.controller';
import { ProdutoController } from '../../src/presentation/rest/v1/controllers/produto/produto.controller';
import { PedidoController } from '../../src/presentation/rest/v1/controllers/pedido/pedido.controller';
import { ProdutoDTO } from '../../src/presentation/rest/v1/presenters/produto/produto.dto';
// import { ClienteDTO } from '../../src/presentation/rest/v1/presenters/cliente/cliente.dto';
import { CategoriaDTO } from '../../src/presentation/rest/v1/presenters/categoria/categoria.dto';
import { criarFakeCategoriaDTO } from '../../src/mocks/categoria.mock';
import { criarFakeProdutoDTO } from '../../src/mocks/produto.mock';
import { criarFakeClienteDTO } from '../../src/mocks/cliente.mock';
import { ItemPedidoDTOFactory } from '../../src/domain/pedido/factories/item_pedido.dto.factory';
import { PedidoDTOFactory } from '../../src/domain/pedido/factories/pedido.dto.factory';
import { IProdutoDTOFactory } from '../../src/domain/produto/interfaces/produto.dto.factory.port';
import { IClienteDTOFactory } from '../../src/domain/cliente/interfaces/cliente.dto.factory.port';
import { PedidoModel } from '../../src/infrastructure/sql/models/pedido.model';
import { CognitoAuth } from './cognito';

describe('Pedido (e2e)', () => {
  let app: INestApplication;
  let categoriaController: CategoriaController;
  let produtoController: ProdutoController;
  // let clienteController: ClienteController;
  let categoriaDTO: HTTPResponse<CategoriaDTO>;
  let produtoDTO: HTTPResponse<ProdutoDTO>;
  // let clientDTO: HTTPResponse<ClienteDTO>;
  let itemPedidoFactory: ItemPedidoDTOFactory;
  let pedidoDTOFactory: PedidoDTOFactory;
  let pedidoController: PedidoController;
  let userBearerToken = '';

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
    // clienteController = moduleFixture.get<ClienteController>(ClienteController);
    itemPedidoFactory =
      moduleFixture.get<ItemPedidoDTOFactory>(ItemPedidoDTOFactory);
    pedidoDTOFactory = moduleFixture.get<PedidoDTOFactory>(PedidoDTOFactory);
    pedidoController = moduleFixture.get<PedidoController>(PedidoController);

    await app.init();

    // Criar categoria
    categoriaDTO = await categoriaController.criar(criarFakeCategoriaDTO());
    // Criar produto
    produtoDTO = await produtoController.criar(
      criarFakeProdutoDTO(categoriaDTO.body.id),
    );
    // Criar cliente
    // clientDTO = await clienteController.criar(criarFakeClienteDTO());

    // Autenticar o user
    const cognitoAuth = new CognitoAuth();
    const initiateAuth = await cognitoAuth.initiateAuth();
    const responseToAuth = await cognitoAuth.respondToAuthChallenge(
      initiateAuth.Session,
    );
    userBearerToken = responseToAuth.AuthenticationResult.IdToken;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /pedido', () => {
    it('Deve ser possível realizar o checkout de um pedido para usuário anônimo', async () => {
      const item = itemPedidoFactory.criarItemPedidoDTO(produtoDTO.body.id, 1);
      const pedido = pedidoDTOFactory.criarCriaPedidoDTO([item]);

      const pedidoRegistrado = await request(app.getHttpServer())
        .post('/pedido')
        .auth(userBearerToken, { type: 'bearer' })
        .send(pedido)
        .expect(HttpStatus.CREATED)
        .then((response) => {
          return response.body;
        });

      // validar retorno da request
      const pedidoModel: PedidoModel = pedidoRegistrado.body;
      expect(pedidoRegistrado.mensagem).toBe('Pedido criado com sucesso');
      expect(pedidoModel.pago).toBeFalsy();
      expect(pedidoModel.statusPedido).toBe('recebido');
      expect(pedidoModel.statusPedido).toBe('recebido');
      expect(pedidoModel.itensPedido).toHaveLength(1);
      expect(pedidoModel.itensPedido[0].produto.id).toBe(produtoDTO.body.id);

      // Validar dado registrado no banco
      const result = await pedidoController.buscar(pedidoModel.id);
      expect(pedidoModel.numeroPedido).toEqual(result.numeroPedido);
      expect(pedidoModel.itensPedido).toEqual(result.itensPedido);
    });
  });
});
