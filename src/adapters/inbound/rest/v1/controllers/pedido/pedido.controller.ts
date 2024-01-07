import {
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { IPedidoUseCase } from 'src/domain/ports/pedido/pedido.use_case.port';
import {
  AtualizaPedidoDTO,
  CriaPedidoDTO,
  PedidoDTO,
} from '../../presenters/pedido.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BadRequestError } from '../../../helpers/swagger/status-codes/bad_requests.swagger';
import { NotFoundError } from '../../../helpers/swagger/status-codes/not_found.swagger';

@Controller('pedido')
@ApiTags('Pedido')
export class PedidoController {
  constructor(
    @Inject(IPedidoUseCase)
    private readonly pedidoUseCase: IPedidoUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Adicionar um novo pedido ' })
  @ApiResponse({
    status: 201,
    description: 'Pedido criado com sucesso',
    type: PedidoDTO,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
    type: BadRequestError,
  })
  async checkout(@Body() pedido: CriaPedidoDTO) {
    try {
      return await this.pedidoUseCase.criarPedido(pedido);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Get('/fila')
  @ApiOperation({ summary: 'Listar todos os pedidos recebidos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de pedidos retornada com sucesso',
    type: PedidoDTO,
    isArray: true,
  })
  async fila() {
    return await this.pedidoUseCase.listarPedidosRecebido();
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Atualizar um pedido' })
  @ApiResponse({
    status: 200,
    description: 'Pedido atualizado com sucesso',
    type: PedidoDTO,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
    type: BadRequestError,
  })
  @ApiResponse({
    status: 404,
    description: 'Pedido informado não existe',
    type: NotFoundError,
  })
  async atualizar(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() pedido: AtualizaPedidoDTO,
  ) {
    try {
      return await this.pedidoUseCase.editarPedido(id, pedido);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Buscar um pedido pelo id' })
  @ApiResponse({
    status: 200,
    description: 'Pedido retornado com sucesso',
    type: PedidoDTO,
  })
  @ApiResponse({
    status: 404,
    description: 'Pedido informado não existe',
    type: NotFoundError,
  })
  async buscar(@Param('id', ParseUUIDPipe) id: string) {
    try {
      return await this.pedidoUseCase.buscarPedido(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: 'Listar pedidos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de pedidos retornada com sucesso',
    type: PedidoDTO,
    isArray: true,
  })
  async listar() {
    return await this.pedidoUseCase.listarPedidos();
  }
}
