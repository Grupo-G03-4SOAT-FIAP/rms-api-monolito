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
  CriaClienteDTO,
} from '../../presenters/cliente.dto';

@Controller('cliente')
export class ClienteController {
  constructor(
    @Inject(IClienteUseCase)
    private readonly clienteUseCase: IClienteUseCase,
  ) {}

  @Post()
  @HttpCode(201)
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
  async buscar(@Param('id') id: string) {
    try {
      return await this.clienteUseCase.buscarCliente(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Get()
  async listar() {
    return await this.clienteUseCase.listarClientes();
  }
}
