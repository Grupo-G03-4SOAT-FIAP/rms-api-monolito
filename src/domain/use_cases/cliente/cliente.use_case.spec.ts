import { Test, TestingModule } from '@nestjs/testing';
import { ClienteUseCase } from './cliente.use_case';
import { IClienteRepository } from 'src/domain/ports/cliente/cliente.repository.port';
import {
  atualizaClienteDTOMock,
  clienteDTOFactoryMock,
  clienteDTOMock,
  clienteEntityMock,
  clienteModelMock,
  clienteRepositoryMock,
  criaClienteDTOMock,
} from 'src/mocks/cliente.mock';
import { IClienteDTOFactory } from 'src/domain/ports/cliente/cliente.dto.factory.port';
import { ClienteNomeUndefinedErro } from 'src/domain/exceptions/cliente.exception';

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

  /* it('Deve Editar um Cliente com sucesso', async () => {
    clienteRepositoryMock.buscarClientePorId.mockReturnValue(clienteModelMock);
    clienteRepositoryMock.buscarClientePorEmail.mockReturnValue(
      clienteModelMock,
    );

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
      atualizaClienteDTOMock
    )
    expect(clienteDTOFactoryMock.criarClienteDTO).toHaveBeenCalledWith(
      clienteModelMock
    )
    expect(result).toStrictEqual({
      mensagem: "Cliente atualizado com sucesso",
      body: clienteDTOMock
    })
  }); */

  it('Deve dar erro ao Editar nome do Cliente com undefiend', async () => {
    const cliente = atualizaClienteDTOMock;
    cliente.nome = undefined;
    try {
      await clienteUseCase.editarCliente(clienteId, cliente);
      fail('A exceção ClienteNomeUndefinedErro deveria aparecer');
    } catch (error) {
      expect(error).toBeInstanceOf(ClienteNomeUndefinedErro);
      expect(error.message).toBe('Informações não preenchidas');
    }
  });
});
