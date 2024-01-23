import { Test, TestingModule } from '@nestjs/testing';
import { ClienteUseCase } from './cliente.use_case';
import { IClienteRepository } from 'src/domain/ports/cliente/cliente.repository.port';
import {
  atualizaClienteDTOMock,
  clienteDTOFactoryMock,
  clienteDTOMock,
  clienteEntityAtualizaMock,
  clienteEntityMock,
  clienteModelMock,
  clienteRepositoryMock,
  criaClienteDTOMock,
} from 'src/mocks/cliente.mock';
import { IClienteDTOFactory } from 'src/domain/ports/cliente/cliente.dto.factory.port';

describe('ClienteUseCase', () => {
  let clienteUseCase: ClienteUseCase;
  let clienteId: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClienteUseCase,
        {
          provide: IClienteRepository,
          useValue: clienteRepositoryMock,
        },
        {
          provide: IClienteDTOFactory,
          useValue: clienteDTOFactoryMock,
        },
      ],
    }).compile();

    clienteUseCase = module.get<ClienteUseCase>(ClienteUseCase);
    clienteId = '0a14aa4e-75e7-405f-8301-81f60646c93d'; // id do Mock
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Deve Criar um Cliente com sucesso', async () => {
    clienteRepositoryMock.criarCliente.mockReturnValue(clienteModelMock);
    clienteDTOFactoryMock.criarClienteDTO.mockReturnValue(clienteDTOMock);
    clienteRepositoryMock.buscarClientePorEmail.mockReturnValue(null);
    clienteRepositoryMock.buscarClientePorCPF.mockReturnValue(null);

    const result = await clienteUseCase.criarCliente(criaClienteDTOMock);

    expect(clienteRepositoryMock.buscarClientePorEmail).toHaveBeenCalledWith(
      criaClienteDTOMock.email,
    );
    expect(clienteRepositoryMock.buscarClientePorCPF).toHaveBeenCalledWith(
      criaClienteDTOMock.cpf,
    );
    expect(clienteRepositoryMock.criarCliente).toHaveBeenCalledWith(
      clienteEntityMock,
    );
    expect(clienteDTOFactoryMock.criarClienteDTO).toHaveBeenCalledWith(
      clienteModelMock,
    );

    expect(result).toStrictEqual({
      mensagem: 'Cliente criado com sucesso',
      body: clienteDTOMock,
    });
  });

  it('Deve Editar um Cliente com sucesso', async () => {
    clienteRepositoryMock.buscarClientePorId.mockReturnValue(clienteModelMock);
    clienteRepositoryMock.buscarClientePorEmail.mockReturnValue(null);

    clienteRepositoryMock.editarCliente.mockReturnValue(clienteModelMock);

    clienteDTOFactoryMock.criarClienteDTO.mockReturnValue(clienteDTOMock);

    const result = await clienteUseCase.editarCliente(
      clienteId,
      atualizaClienteDTOMock,
    );

    expect(clienteRepositoryMock.buscarClientePorId).toHaveBeenCalledWith(
      clienteId,
    );
    expect(clienteRepositoryMock.buscarClientePorEmail).toHaveBeenCalledWith(
      atualizaClienteDTOMock.email,
    );
    expect(clienteRepositoryMock.editarCliente).toHaveBeenCalledWith(
      clienteId,
      clienteEntityAtualizaMock,
    );
    expect(clienteDTOFactoryMock.criarClienteDTO).toHaveBeenCalledWith(
      clienteModelMock,
    );
    expect(result).toStrictEqual({
      mensagem: 'Cliente atualizado com sucesso',
      body: clienteDTOMock,
    });
  });

  it('Deve dar o erro ClienteNomeUndefinedErro ao Editar nome do Cliente com null', async () => {
    atualizaClienteDTOMock.nome = null;

    await expect(
      clienteUseCase.editarCliente(clienteId, atualizaClienteDTOMock),
    ).rejects.toThrow('Informações não preenchidas');
  });

  it('Deve dar o erro ClienteNaoLocalizadoErro ao Editar um ID que não existe', async () => {
    atualizaClienteDTOMock.nome = 'Jhon';
    clienteRepositoryMock.buscarClientePorId.mockReturnValue(null);

    await expect(
      clienteUseCase.editarCliente(clienteId, atualizaClienteDTOMock),
    ).rejects.toThrow('Cliente informado não existe');
  });

  it('Deve dar o erro ClienteDuplicadoErro ao Editar um email que já existe', async () => {
    atualizaClienteDTOMock.nome = 'Jhon';
    clienteRepositoryMock.buscarClientePorId.mockReturnValue(clienteModelMock);
    clienteRepositoryMock.buscarClientePorEmail.mockReturnValue(
      clienteModelMock,
    );

    await expect(
      clienteUseCase.editarCliente(clienteId, atualizaClienteDTOMock),
    ).rejects.toThrow('Existe um cliente com esse email');
  });

  it('Deve Excluir o cliente com sucesso', async () => {
    clienteRepositoryMock.buscarClientePorId.mockReturnValue(clienteModelMock);

    const result = await clienteUseCase.excluirCliente(clienteId);

    expect(clienteRepositoryMock.excluirCliente).toHaveBeenCalledWith(
      clienteId,
    );
    expect(result).toStrictEqual({
      mensagem: 'Cliente excluído com sucesso',
    });
  });
  it('Deve dar o erro ClienteNaoLocalizadoErro ao Excluir o cliente com um ID que não existe', async () => {
    clienteRepositoryMock.buscarClientePorId.mockReturnValue(null);

    await expect(clienteUseCase.excluirCliente(clienteId)).rejects.toThrow(
      'Cliente informado não existe',
    );
  });
});
