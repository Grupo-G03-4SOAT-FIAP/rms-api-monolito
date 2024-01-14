import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { IPedidoUseCase } from 'src/domain/ports/pedido/pedido.use_case.port';
import { criaPedidoDTOMock, pedidoDTOMock } from 'src/mocks/pedido.mock';

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
});
