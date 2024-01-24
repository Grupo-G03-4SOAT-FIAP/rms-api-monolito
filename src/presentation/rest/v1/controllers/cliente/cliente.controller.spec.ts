import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ClienteController } from './cliente.controller';
import { IClienteUseCase } from 'src/domain/cliente/interfaces/cliente.use_case.port';
import {
  ClienteDuplicadoErro,
  ClienteNaoLocalizadoErro,
} from 'src/domain/cliente/exceptions/cliente.exception';
import {
  atualizaClienteDTOMock,
  clienteDTOMock,
  clienteUseCaseMock,
  criaClienteDTOMock,
} from 'src/mocks/cliente.mock';

describe('Cliente Controller', () => {
  let clienteController: ClienteController;
  let clienteId: string;
  let clienteCPF: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClienteController,
        {
          provide: IClienteUseCase,
          useValue: clienteUseCaseMock,
        },
      ],
    }).compile();

    clienteController = module.get<ClienteController>(ClienteController);
    clienteId = '0a14aa4e-75e7-405f-8301-81f60646c93d';
    clienteCPF = '83904665030';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Deve criar o Cliente com sucesso', async () => {
    const HTTPResponse = {
      mensagem: 'Cliente criado com sucesso',
      body: clienteDTOMock,
    };

    clienteUseCaseMock.criarCliente.mockReturnValue(HTTPResponse);

    const result = await clienteController.criar(criaClienteDTOMock);

    expect(clienteUseCaseMock.criarCliente).toHaveBeenCalledWith(
      criaClienteDTOMock,
    );

    expect(result).toStrictEqual(HTTPResponse);
  });

  it('Deve retornar o erro de Email duplicado ao criar o Cliente', async () => {
    clienteUseCaseMock.criarCliente.mockRejectedValue(
      new ClienteDuplicadoErro('Existe um cliente com esse email'),
    );

    await expect(clienteController.criar(criaClienteDTOMock)).rejects.toThrow(
      new ConflictException('Existe um cliente com esse email'),
    );

    expect(clienteUseCaseMock.criarCliente).toHaveBeenCalledWith(
      criaClienteDTOMock,
    );
  });

  it('Deve retornar o erro de CPF duplicado ao criar o Cliente', async () => {
    clienteUseCaseMock.criarCliente.mockRejectedValue(
      new ClienteDuplicadoErro('Existe um cliente com esse cpf'),
    );

    await expect(clienteController.criar(criaClienteDTOMock)).rejects.toThrow(
      new ConflictException('Existe um cliente com esse cpf'),
    );

    expect(clienteUseCaseMock.criarCliente).toHaveBeenCalledWith(
      criaClienteDTOMock,
    );
  });

  it('Deve editar o Cliente com sucesso', async () => {
    const HTTPResponse = {
      mensagem: 'Cliente atualizado com sucesso',
      body: clienteDTOMock,
    };

    clienteUseCaseMock.editarCliente.mockReturnValue(HTTPResponse);

    const result = await clienteController.atualizar(
      clienteId,
      atualizaClienteDTOMock,
    );

    expect(clienteUseCaseMock.editarCliente).toHaveBeenCalledWith(
      clienteId,
      atualizaClienteDTOMock,
    );

    expect(result).toStrictEqual(HTTPResponse);
  });

  it('Deve retornar o erro de email duplicado ao editar o Cliente', async () => {
    clienteUseCaseMock.editarCliente.mockRejectedValue(
      new ClienteDuplicadoErro('Existe um cliente com esse email'),
    );

    await expect(
      clienteController.atualizar(clienteId, atualizaClienteDTOMock),
    ).rejects.toThrow(
      new ConflictException('Existe um cliente com esse email'),
    );

    expect(clienteUseCaseMock.editarCliente).toHaveBeenCalledWith(
      clienteId,
      atualizaClienteDTOMock,
    );
  });

  it('Deve retornar o erro de CPF duplicado ao editar o Cliente', async () => {
    clienteUseCaseMock.editarCliente.mockRejectedValue(
      new ClienteDuplicadoErro('Existe um cliente com esse cpf'),
    );

    await expect(
      clienteController.atualizar(clienteId, atualizaClienteDTOMock),
    ).rejects.toThrow(new ConflictException('Existe um cliente com esse cpf'));

    expect(clienteUseCaseMock.editarCliente).toHaveBeenCalledWith(
      clienteId,
      atualizaClienteDTOMock,
    );
  });

  it('Deve excluir o Cliente com sucesso', async () => {
    const HTTPResponse = {
      mensagem: 'Cliente excluído com sucesso',
      body: clienteDTOMock,
    };

    clienteUseCaseMock.excluirCliente.mockReturnValue(HTTPResponse);

    const result = await clienteController.remover(clienteId);

    expect(clienteUseCaseMock.excluirCliente).toHaveBeenCalledWith(clienteId);

    expect(result).toStrictEqual(HTTPResponse);
  });
  it('Deve retornar o erro de email duplicado ao excluir o Cliente', async () => {
    clienteUseCaseMock.excluirCliente.mockRejectedValue(
      new ClienteDuplicadoErro('Existe um cliente com esse email'),
    );

    await expect(clienteController.remover(clienteId)).rejects.toThrow(
      new ConflictException('Existe um cliente com esse email'),
    );

    expect(clienteUseCaseMock.excluirCliente).toHaveBeenCalledWith(clienteId);
  });

  it('Deve retornar o erro de CPF duplicado ao excluir o Cliente', async () => {
    clienteUseCaseMock.excluirCliente.mockRejectedValue(
      new ClienteDuplicadoErro('Existe um cliente com esse cpf'),
    );

    await expect(clienteController.remover(clienteId)).rejects.toThrow(
      new ConflictException('Existe um cliente com esse cpf'),
    );

    expect(clienteUseCaseMock.excluirCliente).toHaveBeenCalledWith(clienteId);
  });

  it('Deve buscar o Cliente por ID com sucesso', async () => {
    clienteUseCaseMock.buscarClientePorId.mockReturnValue(clienteDTOMock);

    const result = await clienteController.buscar(clienteId);

    expect(clienteUseCaseMock.buscarClientePorId).toHaveBeenCalledWith(
      clienteId,
    );

    expect(result).toStrictEqual(clienteDTOMock);
  });

  it('Deve retornar o erro de Id não ao encontrado', async () => {
    clienteUseCaseMock.buscarClientePorId.mockRejectedValue(
      new ClienteNaoLocalizadoErro('Cliente informado não existe'),
    );

    await expect(clienteController.buscar(clienteId)).rejects.toThrow(
      new NotFoundException('Cliente informado não existe'),
    );

    expect(clienteUseCaseMock.buscarClientePorId).toHaveBeenCalledWith(
      clienteId,
    );
  });

  it('Deve buscar o Cliente por CPF com sucesso', async () => {
    clienteUseCaseMock.buscarClientePorCPF.mockReturnValue(clienteDTOMock);

    const result = await clienteController.buscarCPF(clienteCPF);

    expect(clienteUseCaseMock.buscarClientePorCPF).toHaveBeenCalledWith(
      clienteCPF,
    );

    expect(result).toStrictEqual(clienteDTOMock);
  });

  it('Deve retornar o erro de CPF não encontrado', async () => {
    clienteUseCaseMock.buscarClientePorCPF.mockRejectedValue(
      new ClienteNaoLocalizadoErro('Existe um cliente com esse cpf'),
    );

    await expect(clienteController.buscarCPF(clienteCPF)).rejects.toThrow(
      new NotFoundException('Existe um cliente com esse cpf'),
    );

    expect(clienteUseCaseMock.buscarClientePorCPF).toHaveBeenCalledWith(
      clienteCPF,
    );
  });

  it('Deve buscar todos os Clientes com sucesso', async () => {
    clienteUseCaseMock.listarClientes.mockReturnValue([clienteDTOMock]);

    const result = await clienteController.listar();

    expect(clienteUseCaseMock.listarClientes).toHaveBeenCalledWith();

    expect(result).toStrictEqual([clienteDTOMock]);
  });
});
