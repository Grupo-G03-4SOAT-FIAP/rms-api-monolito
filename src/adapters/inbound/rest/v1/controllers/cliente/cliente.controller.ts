import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { IClienteUseCase } from 'src/domain/ports/cliente/cliente.use_case.port';
import {
  AtualizaClienteDTO,
  ClienteDTO,
  CriaClienteDTO,
} from '../../presenters/cliente.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BadRequestError } from '../../../helpers/swagger/status-codes/bad_requests.swagger';
import { NotFoundError } from '../../../helpers/swagger/status-codes/not_found.swagger';
import { ConflictError } from '../../../helpers/swagger/status-codes/conflict.swagger';

@Controller('cliente')
@ApiTags('Cliente')
export class ClienteController {
  constructor(
    @Inject(IClienteUseCase)
    private readonly clienteUseCase: IClienteUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Adicionar um novo cliente' })
  @ApiResponse({
    status: 201,
    description: 'Cliente criado com sucesso',
    type: ClienteDTO,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
    type: BadRequestError,
  })
  @ApiResponse({
    status: 409,
    description: 'Existe um cliente com esse dado',
    type: ConflictError,
  })
  async criar(@Body() cliente: CriaClienteDTO) {
    try {
      return await this.clienteUseCase.criarCliente(cliente);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException(error.message);
      }
      throw error;
    }
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Atualizar um cliente' })
  @ApiResponse({
    status: 200,
    description: 'Cliente atualizado com sucesso',
    type: ClienteDTO,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
    type: BadRequestError,
  })
  @ApiResponse({
    status: 404,
    description: 'Cliente informado não existe',
    type: NotFoundError,
  })
  @ApiResponse({
    status: 409,
    description: 'Existe um cliente com esse dado',
    type: ConflictError,
  })
  async atualizar(
    @Param('id') id: string,
    @Body() cliente: AtualizaClienteDTO,
  ) {
    try {
      return await this.clienteUseCase.editarCliente(id, cliente);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException(error.message);
      }
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Remover um cliente' })
  @ApiResponse({
    status: 200,
    description: 'Cliente excluído com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Cliente informado não existe',
    type: NotFoundError,
  })
  async remover(@Param('id') id: string) {
    try {
      return await this.clienteUseCase.excluirCliente(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Buscar um cliente pelo id' })
  @ApiResponse({
    status: 200,
    description: 'Cliente retornado com sucesso',
    type: ClienteDTO,
  })
  @ApiResponse({
    status: 404,
    description: 'Cliente informado não existe',
    type: NotFoundError,
  })
  async buscar(@Param('id') id: string) {
    try {
      return await this.clienteUseCase.buscarClientePorId(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Get('/cpf/:cpf')
  @ApiOperation({ summary: 'Buscar um cliente pelo CPF' })
  @ApiResponse({
    status: 200,
    description: 'Cliente retornado com sucesso',
    type: ClienteDTO,
  })
  @ApiResponse({
    status: 404,
    description: 'Cliente informado não existe',
    type: NotFoundError,
  })
  async buscarCPF(@Param('cpf') cpf: string) {
    try {
      return await this.clienteUseCase.buscarClientePorCPF(cpf);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os clientes' })
  @ApiResponse({
    status: 200,
    description: 'Lista de clientes retornada com sucesso',
    type: ClienteDTO,
    isArray: true,
  })
  async listar() {
    return await this.clienteUseCase.listarClientes();
  }
}
