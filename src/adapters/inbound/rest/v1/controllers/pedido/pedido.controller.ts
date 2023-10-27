import {
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { IPedidoUseCase } from 'src/domain/ports/pedido/pedito.use_case.port';
import { AtualizaPedidoDTO, CriaPedidoDTO } from '../../presenters/pedido.dto';

@Controller('pedido')
export class PedidoController {
  constructor(
    @Inject(IPedidoUseCase)
    private readonly pedidoUseCase: IPedidoUseCase,
  ) {}

  @Post()
  @HttpCode(201)
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
  async fila() {
    return await this.pedidoUseCase.listarPedidosRecebido();
  }

  @Put('/:id')
  async atualizar(@Param('id') id: string, @Body() pedido: AtualizaPedidoDTO) {
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
  async buscar(@Param('id') id: string) {
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
  async listar() {
    return await this.pedidoUseCase.listarPedidos();
  }
}
