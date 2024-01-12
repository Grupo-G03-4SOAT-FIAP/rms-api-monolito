import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, NotFoundException } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { IPedidoUseCase } from 'src/domain/ports/pedido/pedido.use_case.port';
import { atualizaPedidoDTOMock, criaPedidoDTOMock, pedidoDTOMock } from 'src/mocks/pedido.mock';

describe('PedidoController (e2e)', () => {
  let app: INestApplication;
  let pedidoUseCase: IPedidoUseCase;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    pedidoUseCase = moduleFixture.get<IPedidoUseCase>(IPedidoUseCase);
  });

  it('/pedido (POST)', async () => {
    const HTTPResponse = {
      mensagem: 'Pedido criado com sucesso',
      body: pedidoDTOMock,
    };

    jest
      .spyOn(pedidoUseCase, 'criarPedido')
      .mockResolvedValueOnce(HTTPResponse);

    await request(app.getHttpServer())
      .post('/pedido')
      .send(criaPedidoDTOMock)
      .expect(201)
      .expect(HTTPResponse);
  });

  it('/pedido (POST) NotFoundException', async () => {
    jest
      .spyOn(pedidoUseCase, 'criarPedido')
      .mockRejectedValueOnce(
        new NotFoundException('Cliente informado não existe'),
      );

    await request(app.getHttpServer())
      .post('/pedido')
      .send(criaPedidoDTOMock)
      .expect(404)
      .expect('Cliente informado não existe');
  });

  it('/pedido/fila (GET)', async () => {
    jest
      .spyOn(pedidoUseCase, 'listarPedidosRecebido')
      .mockResolvedValueOnce([pedidoDTOMock]);

    await request(app.getHttpServer())
      .get('/pedido/fila')
      .expect(200)
      .expect([pedidoDTOMock]);
  });

  it('/pedido/:id (PUT)', async () => {
    const HTTPResponse = {
      mensagem: 'Pedido atualizado com sucesso',
      body: pedidoDTOMock,
    };

    jest
      .spyOn(pedidoUseCase, 'editarPedido')
      .mockResolvedValueOnce(HTTPResponse);

    await request(app.getHttpServer())
      .put('/pedido/0a14aa4e-75e7-405f-8301-81f60646c93d')
      .send(atualizaPedidoDTOMock)
      .expect(200)
      .expect(HTTPResponse);
  });

  it('/pedido/:id (PUT) NotFoundException', async () => {
    jest
      .spyOn(pedidoUseCase, 'editarPedido')
      .mockRejectedValueOnce(
        new NotFoundException('Pedido informado não existe'),
      );
    await request(app.getHttpServer())
      .put('/pedido/0a14aa4e-75e7-405f-8301-81f60646c93d')
      .send(atualizaPedidoDTOMock)
      .expect(404)
      .expect('Pedido informado não existe');
  });
});
