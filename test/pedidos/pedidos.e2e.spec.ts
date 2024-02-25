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
import { CriaItemPedidoDTO } from '../../src/presentation/rest/v1/presenters/pedido/item_pedido.dto';
import { HTTPResponse } from '../../src/application/common/HTTPResponse';
import { ProdutoDTO } from '../../src/presentation/rest/v1/presenters/produto/produto.dto';
import { ClienteDTO } from '../../src/presentation/rest/v1/presenters/cliente/cliente.dto';
import { IPedidoDTOFactory } from 'src/domain/pedido/interfaces/pedido.dto.factory.port';

describe('Pedido (e2e)', () => {
  let app: INestApplication;
  let categoriaController: CategoriaController;
  let produtoController: ProdutoController;
  let clienteController: ClienteController;
  let pedidoDTOFactory: IPedidoDTOFactory;
  let produtoTest: HTTPResponse<ProdutoDTO>;
  let clientTest: HTTPResponse<ClienteDTO>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    categoriaController =
      moduleFixture.get<CategoriaController>(CategoriaController);
    produtoController = moduleFixture.get<ProdutoController>(ProdutoController);
    clienteController = moduleFixture.get<ClienteController>(ClienteController);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /pedido', () => {
    it('Deve ser possível realizar o checkout de um pedido', async () => {
      // Criar categoria
      const categoriaTest = await categoriaController.criar(
        criarFakeCategoriaDTO(),
      );

      // Criar produto
      produtoTest = await produtoController.criar(
        criarFakeProdutoDTO(categoriaTest.body.id),
      );

      // Criar cliente
      clientTest = await clienteController.criar(criarFakeClienteDTO());

      // Itens do pedido
      // const item = pedidoDTOFactory.criarItemPedidoDTO(produtoTest.body.id, 1);
      const item = new CriaItemPedidoDTO();
      item.produto = produtoTest.body.id;
      item.quantidade = 1;
      const itensPedido: CriaItemPedidoDTO[] = [];
      itensPedido.push(item);

      // pedido
      // const pedidoTest = pedidoDTOFactory.criarPedidoDTOFromData(
      //   clientTest.body.cpf,
      //   itensPedido,
      // );
      const pedidoTest = {
        cpfCliente: clientTest.body.cpf,
        itensPedido: itensPedido,
      };

      request(app.getHttpServer())
        .post('/pedido')
        .send(pedidoTest)
        .expect(HttpStatus.CREATED)
        .then((response) => {
          console.log(response.body.data);
        });
    });
  });
});
