import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { ClienteEntity } from 'src/domain/entities/cliente.entity';
import { ClienteModel } from '../../models/cliente.model';
import { ClienteRepository } from './cliente.repository';

const clienteEntity = new ClienteEntity(
  'Jhon',
  'jhon@teste.com.br',
  '83904665030',
  '0a14aa4e-75e7-405f-8301-81f60646c93d',
);

const clienteModel = new ClienteModel();
clienteModel.id = '0a14aa4e-75e7-405f-8301-81f60646c93d';
clienteModel.nome = 'Cliente A';
clienteModel.email = 'clientea@teste.com.br';
clienteModel.cpf = '83904665030';
clienteModel.criadoEm = new Date().toISOString();
clienteModel.atualizadoEm = new Date().toISOString();
clienteModel.excluidoEm = new Date().toISOString();

class ClienteRepositoryMock {
  softDelete: jest.Mock = jest.fn();
}

const clienteRepositoryMock = new ClienteRepositoryMock();

describe('ClienteRepository', () => {
  let clienteRepository: ClienteRepository;
  let mockClienteModel: jest.Mocked<Repository<ClienteModel>>;

  beforeEach(async () => {
    mockClienteModel = {
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
    } as Partial<Repository<ClienteModel>> as jest.Mocked<
      Repository<ClienteModel>
    >;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClienteRepository,
        {
          provide: getRepositoryToken(ClienteModel),
          useValue: mockClienteModel,
        },
      ],
    }).compile();

    clienteRepository = module.get<ClienteRepository>(ClienteRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve criar um cliente', async () => {
    mockClienteModel.create.mockReturnValue(clienteModel);
    mockClienteModel.save.mockResolvedValue(Promise.resolve(clienteModel));

    const resultado = await clienteRepository.criarCliente(clienteEntity);

    expect(mockClienteModel.create).toHaveBeenCalledWith(clienteEntity);
    expect(mockClienteModel.save).toHaveBeenCalledWith(clienteModel);
    expect(resultado).toBe(clienteModel);
  });

  it('deve editar um cliente', async () => {
    mockClienteModel.findOne.mockResolvedValue(Promise.resolve(clienteModel));

    const clienteId = '0a14aa4e-75e7-405f-8301-81f60646c93d';
    const resultado = await clienteRepository.editarCliente(
      clienteId,
      clienteEntity,
    );

    expect(mockClienteModel.update).toHaveBeenCalledWith(
      clienteId,
      clienteEntity,
    );
    expect(mockClienteModel.findOne).toHaveBeenCalledWith({
      where: { id: clienteId },
    });
    expect(resultado).toBe(clienteModel);
  });

  it('deve excluir um cliente no formato softdelete', async () => {
    const clienteId = '0a14aa4e-75e7-405f-8301-81f60646c93d';

    // Configurar o mock da função softDelete
    clienteRepositoryMock.softDelete.mockResolvedValue({ affected: 1 });

    const clienteService = new ClienteRepository(clienteRepositoryMock as any); // Usar "any" para evitar problemas de tipo

    await clienteService.excluirCliente(clienteId);

    expect(clienteRepositoryMock.softDelete).toHaveBeenCalledWith({
      id: clienteId,
    });
  });

  it('deve buscar um cliente por id', async () => {
    mockClienteModel.findOne.mockResolvedValue(Promise.resolve(clienteModel));

    const clienteId = '0a14aa4e-75e7-405f-8301-81f60646c93d';
    const resultado = await clienteRepository.buscarClientePorId(clienteId);

    expect(mockClienteModel.findOne).toHaveBeenCalledWith({
      where: { id: clienteId },
    });
    expect(resultado).toBe(clienteModel);
  });

  it('deve buscar um cliente por cpf', async () => {
    mockClienteModel.findOne.mockResolvedValue(Promise.resolve(clienteModel));

    const cpfCliente = '83904665030';
    const resultado = await clienteRepository.buscarClientePorCPF(cpfCliente);

    expect(mockClienteModel.findOne).toHaveBeenCalledWith({
      where: { cpf: cpfCliente },
    });
    expect(resultado).toBe(clienteModel);
  });

  it('deve listar todos clientes', async () => {
    const listaClientes = [clienteModel, clienteModel, clienteModel];
    mockClienteModel.find.mockResolvedValue(Promise.resolve(listaClientes));

    const resultado = await clienteRepository.listarClientes();

    expect(mockClienteModel.find).toHaveBeenCalledWith({});
    expect(resultado).toBe(listaClientes);
  });
});
