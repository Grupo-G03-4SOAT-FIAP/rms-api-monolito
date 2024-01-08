import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { ClienteModel } from '../../models/cliente.model';
import { ClienteRepository } from './cliente.repository';
import {
  clienteTypeORMMock,
  clienteModelMock,
  clienteEntityMock,
} from 'src/mocks/cliente.mock';

class softDeleteMock {
  softDelete: jest.Mock = jest.fn();
}

const clienteSoftDeleteMock = new softDeleteMock();

describe('ClienteRepository', () => {
  let clienteRepository: ClienteRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClienteRepository,
        {
          provide: getRepositoryToken(ClienteModel),
          useValue: clienteTypeORMMock,
        },
      ],
    }).compile();

    clienteRepository = module.get<ClienteRepository>(ClienteRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve criar um cliente', async () => {
    clienteTypeORMMock.create.mockReturnValue(clienteModelMock);
    clienteTypeORMMock.save.mockResolvedValue(
      Promise.resolve(clienteModelMock),
    );

    const result = await clienteRepository.criarCliente(clienteEntityMock);

    expect(clienteTypeORMMock.create).toHaveBeenCalledWith(clienteEntityMock);
    expect(clienteTypeORMMock.save).toHaveBeenCalledWith(clienteModelMock);
    expect(result).toBe(clienteModelMock);
  });

  it('deve editar um cliente', async () => {
    clienteTypeORMMock.findOne.mockResolvedValue(
      Promise.resolve(clienteModelMock),
    );

    const clienteId = '0a14aa4e-75e7-405f-8301-81f60646c93d';

    const result = await clienteRepository.editarCliente(
      clienteId,
      clienteEntityMock,
    );

    expect(clienteTypeORMMock.update).toHaveBeenCalledWith(
      clienteId,
      clienteEntityMock,
    );
    expect(clienteTypeORMMock.findOne).toHaveBeenCalledWith({
      where: { id: clienteId },
    });
    expect(result).toBe(clienteModelMock);
  });

  it('deve excluir um cliente no formato softdelete', async () => {
    const clienteId = '0a14aa4e-75e7-405f-8301-81f60646c93d';
    clienteSoftDeleteMock.softDelete.mockResolvedValue({ affected: 1 });

    const clienteService = new ClienteRepository(clienteSoftDeleteMock as any); // Usar "any" para evitar problemas de tipo

    await clienteService.excluirCliente(clienteId);

    expect(clienteSoftDeleteMock.softDelete).toHaveBeenCalledWith({
      id: clienteId,
    });
  });

  it('deve buscar um cliente por id', async () => {
    clienteTypeORMMock.findOne.mockResolvedValue(
      Promise.resolve(clienteModelMock),
    );
    const clienteId = '0a14aa4e-75e7-405f-8301-81f60646c93d';
    const result = await clienteRepository.buscarClientePorId(clienteId);

    expect(clienteTypeORMMock.findOne).toHaveBeenCalledWith({
      where: { id: clienteId },
    });
    expect(result).toBe(clienteModelMock);
  });

  it('deve buscar um cliente por id e retornar nulo', async () => {
    clienteTypeORMMock.findOne.mockResolvedValue(null);

    const clienteId = '0a14aa4e-75e7-405f-8301-81f60646c93d';
    const result = await clienteRepository.buscarClientePorId(clienteId);

    expect(clienteTypeORMMock.findOne).toHaveBeenCalledWith({
      where: { id: clienteId },
    });
    expect(result).toBe(null);
  });

  it('deve buscar um cliente por cpf', async () => {
    clienteTypeORMMock.findOne.mockResolvedValue(
      Promise.resolve(clienteModelMock),
    );

    const cpfCliente = '83904665030';
    const result = await clienteRepository.buscarClientePorCPF(cpfCliente);

    expect(clienteTypeORMMock.findOne).toHaveBeenCalledWith({
      where: { cpf: cpfCliente },
    });
    expect(result).toBe(clienteModelMock);
  });

  it('deve buscar um cliente por cpf e retornar nulo', async () => {
    clienteTypeORMMock.findOne.mockResolvedValue(null);

    const cpfCliente = '83904665030';
    const result = await clienteRepository.buscarClientePorCPF(cpfCliente);

    expect(clienteTypeORMMock.findOne).toHaveBeenCalledWith({
      where: { cpf: cpfCliente },
    });
    expect(result).toBe(null);
  });

  it('deve listar todos clientes', async () => {
    const listaClientes = [
      clienteModelMock,
      clienteModelMock,
      clienteModelMock,
    ];
    clienteTypeORMMock.find.mockResolvedValue(Promise.resolve(listaClientes));

    const result = await clienteRepository.listarClientes();

    expect(clienteTypeORMMock.find).toHaveBeenCalledWith({});
    expect(result).toBe(listaClientes);
  });

  it('deve retornar uma lista vazia de clientes', async () => {
    const listaClientes = [];
    clienteTypeORMMock.find.mockResolvedValue(Promise.resolve(listaClientes));

    const result = await clienteRepository.listarClientes();

    expect(clienteTypeORMMock.find).toHaveBeenCalledWith({});
    expect(result).toEqual(listaClientes);
  });
});
