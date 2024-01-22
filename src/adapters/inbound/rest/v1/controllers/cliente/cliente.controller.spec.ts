import { Test, TestingModule } from '@nestjs/testing';
import { ClienteController } from './cliente.controller';
import { IClienteUseCase } from 'src/domain/ports/cliente/cliente.use_case.port';
import { 
    AtualizaClienteDTO,
    CriaClienteDTO,
    ClienteDTO
} from '../../presenters/cliente.dto';

import { 
    ClienteNaoLocalizadoErro,
    ClienteDuplicadoErro,
    CPFInvalidoErro,
    UUIDInvalidoErro,
    ClienteNomeUndefinedErro
} from 'src/domain/exceptions/cliente.exception'; 
import { ClienteUseCase } from 'src/domain/use_cases/cliente/cliente.use_case';

const novoClienteDTO = new CriaClienteDTO()
novoClienteDTO.cpf = "04389520571" // CPF Válido
novoClienteDTO.email = "email@hotmail.com" 
novoClienteDTO.nome = "Jose"

describe("Cliente", () => {
    let clienteController: ClienteController;
    let clienteUseCase: IClienteUseCase;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ClienteController],
            providers: [
                {
                    provide: IClienteUseCase,
                    useValue: {
                        criarCliente: jest.fn(),
                        editarCliente: jest.fn(),
                        excluirCliente: jest.fn(),
                        buscarClientePorId: jest.fn(),
                        buscarClientePorCPF: jest.fn(),
                        listarClientes: jest.fn(),
                    },
                },
            ],
        }).compile();
        clienteController = module.get<ClienteController>(ClienteController),
        clienteUseCase = module.get<IClienteUseCase>(IClienteUseCase)
    });

    afterEach(() => {
        jest.clearAllMocks()
    })

    test("Deve ter a definição para Cliente Controller e Cliente Use Case",async () => {
        expect(clienteController).toBeDefined()
        expect(clienteUseCase).toBeDefined()
    });

    describe("Cria Cliente", () => {
        it("Deve ser retornado um exception se ocorrer um erro para criar um Cliente",async () => {
            //Arrange

            jest
                .spyOn(clienteUseCase, "criarCliente")
                .mockRejectedValue(new Error())
            
            expect(clienteController.criar(novoClienteDTO)).rejects.toThrow()

        })
    })

})

