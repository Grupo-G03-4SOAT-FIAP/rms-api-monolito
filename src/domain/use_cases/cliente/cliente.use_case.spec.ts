import { Test, TestingModule } from '@nestjs/testing';
import { ClienteUseCase } from './cliente.use_case';
import { IClienteRepository } from 'src/domain/ports/cliente/cliente.repository.port';
import {
  clienteDTOFactoryMock,
  clienteDTOMock,
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
        criaClienteDTOMock.email
    );
    expect(clienteRepositoryMock.buscarClientePorCPF).toHaveBeenCalledWith(
        criaClienteDTOMock.cpf
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
});
