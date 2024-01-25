import { Test, TestingModule } from '@nestjs/testing';
import { ClienteUseCase } from './cliente.use_case';
import { IClienteRepository } from 'src/domain/cliente/interfaces/cliente.repository.port';
import { IClienteDTOFactory } from 'src/domain/cliente/interfaces/cliente.dto.factory.port';
import {
  atualizaClienteDTOMock,
  atualizaClienteDTONomeNullMock,
  clienteDTOFactoryMock,
  clienteDTOMock,
  clienteEntityFactoryMock,
  clienteEntityMock,
  clienteEntityNotCpfMock,
  clienteEntityNotIdMock,
  clienteRepositoryMock,
  criaClienteDTOMock,
} from 'src/mocks/cliente.mock';
import { IClienteEntityFactory } from 'src/domain/cliente/interfaces/cliente.entity.factory.port';

describe('ClienteUseCase', () => {
  let clienteUseCase: ClienteUseCase;
  let clienteId: string;
  let cpfCliente: string;
  let emailCliente: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClienteUseCase,
        {
          provide: IClienteRepository,
          useValue: clienteRepositoryMock,
        },
        {
          provide: IClienteEntityFactory,
          useValue: clienteEntityFactoryMock,
        },
        {
          provide: IClienteDTOFactory,
          useValue: clienteDTOFactoryMock,
        },
      ],
    }).compile();

    clienteUseCase = module.get<ClienteUseCase>(ClienteUseCase);
    clienteId = '0a14aa4e-75e7-405f-8301-81f60646c93d';
    cpfCliente = '83904665030';
    emailCliente = 'jhon@email.com.br';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve criar um cliente com sucesso', async () => {
    clienteRepositoryMock.buscarClientePorEmail.mockReturnValue(null);
    clienteRepositoryMock.buscarClientePorCPF.mockReturnValue(null);
    clienteEntityFactoryMock.criarEntidadeCliente.mockReturnValue(
      clienteEntityNotIdMock,
    );
    clienteRepositoryMock.criarCliente.mockReturnValue(clienteEntityMock);
    clienteDTOFactoryMock.criarClienteDTO.mockReturnValue(clienteDTOMock);
    
    const result = await clienteUseCase.criarCliente(criaClienteDTOMock);

    expect(clienteRepositoryMock.buscarClientePorEmail).toHaveBeenCalledWith(
      criaClienteDTOMock.email,
    );
    expect(clienteRepositoryMock.buscarClientePorCPF).toHaveBeenCalledWith(
      criaClienteDTOMock.cpf,
    );
    expect(clienteEntityFactoryMock.criarEntidadeCliente).toHaveBeenCalledWith(
      criaClienteDTOMock.nome,
      criaClienteDTOMock.email,
      criaClienteDTOMock.cpf,
    );
    expect(clienteRepositoryMock.criarCliente).toHaveBeenCalledWith(
      clienteEntityNotIdMock,
    );
    expect(clienteDTOFactoryMock.criarClienteDTO).toHaveBeenCalledWith(
      clienteEntityMock,
    );
    
    expect(result).toStrictEqual({
      mensagem: 'Cliente criado com sucesso',
      body: clienteDTOMock,
    });
  });

  it('deve retornar erro ao criar um cliente com email que ja existe', async () => {
    clienteRepositoryMock.buscarClientePorEmail.mockReturnValue(
      clienteEntityMock,
    );

    await expect(clienteUseCase.criarCliente(criaClienteDTOMock)).rejects.toThrow(
      'Existe um cliente com esse email',
    );
    expect(clienteRepositoryMock.buscarClientePorEmail).toHaveBeenCalledWith(
      criaClienteDTOMock.email,
    );
  });

  it('deve retornar erro ao criar um cliente com cpf que ja existe', async () => {
    clienteRepositoryMock.buscarClientePorEmail.mockReturnValue(null);
    clienteRepositoryMock.buscarClientePorCPF.mockReturnValue(clienteEntityMock);

    await expect(clienteUseCase.criarCliente(criaClienteDTOMock)).rejects.toThrow(
      'Existe um cliente com esse cpf',
    );
    expect(clienteRepositoryMock.buscarClientePorEmail).toHaveBeenCalledWith(
      criaClienteDTOMock.email,
    );
    expect(clienteRepositoryMock.buscarClientePorCPF).toHaveBeenCalledWith(
      criaClienteDTOMock.cpf,
    );
  });

  it('deve editar um cliente com sucesso', async () => {
    clienteRepositoryMock.buscarClientePorId.mockReturnValue(clienteEntityMock);
    clienteRepositoryMock.buscarClientePorEmail.mockReturnValue(null);
    clienteEntityFactoryMock.criarEntidadeCliente.mockReturnValue(
      clienteEntityNotCpfMock,
    );
    clienteRepositoryMock.editarCliente.mockReturnValue(clienteEntityMock);
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
    expect(clienteEntityFactoryMock.criarEntidadeCliente).toHaveBeenCalledWith(
      atualizaClienteDTOMock.nome,
      atualizaClienteDTOMock.email,
    );
    expect(clienteRepositoryMock.editarCliente).toHaveBeenCalledWith(
      clienteId,
      clienteEntityNotCpfMock,
    );
    expect(clienteDTOFactoryMock.criarClienteDTO).toHaveBeenCalledWith(
      clienteEntityMock,
    );
    expect(result).toStrictEqual({
      mensagem: 'Cliente atualizado com sucesso',
      body: clienteDTOMock,
    });
  });

  it('deve retornar erro ao editar um cliente com nome nulo', async () => {
    await expect(
      clienteUseCase.editarCliente(clienteId, atualizaClienteDTONomeNullMock),
    ).rejects.toThrow('Nome não pode ser nulo');
  });

  it('deve retornar erro ao editar um cliente que não existe', async () => {
    clienteRepositoryMock.buscarClientePorId.mockReturnValue(null);

    await expect(
      clienteUseCase.editarCliente(clienteId, atualizaClienteDTOMock),
    ).rejects.toThrow('Cliente informado não existe');
    expect(clienteRepositoryMock.buscarClientePorId).toHaveBeenCalledWith(
      clienteId,
    );
  });

  it('deve retornar erro ao editar um cliente com email que ja existe', async () => {
    clienteRepositoryMock.buscarClientePorId.mockReturnValue(clienteEntityMock);
    clienteRepositoryMock.buscarClientePorEmail.mockReturnValue(
      clienteEntityMock,
    );

    await expect(
      clienteUseCase.editarCliente(clienteId, atualizaClienteDTOMock),
    ).rejects.toThrow('Existe um cliente com esse email');
    expect(clienteRepositoryMock.buscarClientePorId).toHaveBeenCalledWith(
      clienteId,
    );
    expect(clienteRepositoryMock.buscarClientePorEmail).toHaveBeenCalledWith(
      atualizaClienteDTOMock.email,
    );
  });

  it('deve excluir um cliente com sucesso', async () => {
    clienteRepositoryMock.buscarClientePorId.mockReturnValue(clienteEntityMock);
    clienteRepositoryMock.excluirCliente.mockReturnValue(null);

    const result = await clienteUseCase.excluirCliente(clienteId);

    expect(clienteRepositoryMock.buscarClientePorId).toHaveBeenCalledWith(
      clienteId,
    );
    expect(clienteRepositoryMock.excluirCliente).toHaveBeenCalledWith(
      clienteId,
    );
    expect(result).toStrictEqual({
      mensagem: 'Cliente excluído com sucesso',
    });
  });

  it('deve retornar erro ao excluir um cliente que não existe', async () => {
    clienteRepositoryMock.buscarClientePorId.mockReturnValue(null);

    await expect(clienteUseCase.excluirCliente(clienteId)).rejects.toThrow(
      'Cliente informado não existe',
    );
    expect(clienteRepositoryMock.buscarClientePorId).toHaveBeenCalledWith(
      clienteId,
    );
  });

  it('deve buscar um cliente por id', async () => {
    clienteRepositoryMock.buscarClientePorId.mockReturnValue(clienteEntityMock);
    clienteDTOFactoryMock.criarClienteDTO.mockReturnValue(clienteDTOMock);

    const result = await clienteUseCase.buscarClientePorId(clienteId);

    expect(clienteRepositoryMock.buscarClientePorId).toHaveBeenCalledWith(
      clienteId,
    );
    expect(clienteDTOFactoryMock.criarClienteDTO).toHaveBeenCalledWith(
      clienteEntityMock,
    );
    expect(result).toStrictEqual(clienteDTOMock);
  });

  it('deve retornar erro ao buscar um cliente por id que não existe', async () => {
    clienteRepositoryMock.buscarClientePorId.mockReturnValue(null);

    await expect(
      clienteUseCase.buscarClientePorId(clienteId),
    ).rejects.toThrow('Cliente informado não existe');
    expect(clienteRepositoryMock.buscarClientePorId).toHaveBeenCalledWith(
      clienteId,
    );
  });

  it('deve buscar um cliente por cpf', async () => {
    clienteRepositoryMock.buscarClientePorCPF.mockReturnValue(clienteEntityMock);
    clienteDTOFactoryMock.criarClienteDTO.mockReturnValue(clienteDTOMock);

    const result = await clienteUseCase.buscarClientePorCPF(cpfCliente);

    expect(clienteRepositoryMock.buscarClientePorCPF).toHaveBeenCalledWith(
      cpfCliente,
    );
    expect(clienteDTOFactoryMock.criarClienteDTO).toHaveBeenCalledWith(
      clienteEntityMock,
    );
    expect(result).toStrictEqual(clienteDTOMock);
  });

  it('deve retornar erro ao buscar um cliente por cpf que não existe', async () => {
    clienteRepositoryMock.buscarClientePorCPF.mockReturnValue(null);

    await expect(
      clienteUseCase.buscarClientePorCPF(cpfCliente),
    ).rejects.toThrow('Cliente informado não existe');
    expect(clienteRepositoryMock.buscarClientePorCPF).toHaveBeenCalledWith(
      cpfCliente,
    );
  });

  it('deve listar todos os clientes', async () => {
    clienteRepositoryMock.listarClientes.mockReturnValue([clienteEntityMock]);
    clienteDTOFactoryMock.criarListaClienteDTO.mockReturnValue([clienteDTOMock]);

    const result = await clienteUseCase.listarClientes();

    expect(clienteRepositoryMock.listarClientes).toHaveBeenCalledWith();
    expect(clienteDTOFactoryMock.criarListaClienteDTO).toHaveBeenCalledWith([
      clienteEntityMock,
    ]);
    expect(result).toStrictEqual([clienteDTOMock]);
  });

  it('deve retornar uma lista vazia de clientes', async () => {
    clienteRepositoryMock.listarClientes.mockReturnValue([]);
    clienteDTOFactoryMock.criarListaClienteDTO.mockReturnValue([]);

    const result = await clienteUseCase.listarClientes();

    expect(clienteRepositoryMock.listarClientes).toHaveBeenCalledWith();
    expect(clienteDTOFactoryMock.criarListaClienteDTO).toHaveBeenCalledWith([]);
    expect(result).toStrictEqual([]);
  });
});
