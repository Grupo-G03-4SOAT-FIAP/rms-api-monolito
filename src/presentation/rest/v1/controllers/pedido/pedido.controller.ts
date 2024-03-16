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
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IPedidoUseCase } from 'src/domain/pedido/interfaces/pedido.use_case.port';
import {
  AtualizaPedidoDTO,
  CriaPedidoDTO,
  PedidoDTO,
} from '../../presenters/pedido/pedido.dto';
import { BadRequestError } from '../../helpers/swagger/status-codes/bad_requests.swagger';
import { NotFoundError } from '../../helpers/swagger/status-codes/not_found.swagger';
import { MensagemMercadoPagoDTO } from '../../presenters/pedido/gatewaypag.dto';
import { Authentication, CognitoUser } from '@nestjs-cognito/auth';
import { ConfigService } from '@nestjs/config';
import { CriaClienteDTO } from '../../presenters/cliente/cliente.dto';

@Controller('pedido')
@ApiTags('Pedido')
export class PedidoController {
  constructor(
    @Inject(IPedidoUseCase)
    private readonly pedidoUseCase: IPedidoUseCase,
    private configService: ConfigService,
  ) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Checkout de pedido' })
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
  @ApiResponse({
    status: 404,
    description: 'Pedido informado não existe',
    type: NotFoundError,
  })
  @Authentication()
  async checkout(
    // Olá! Eu sou um comentário que não serve para nada😞 por favor me apagueee!!!
    @CognitoUser('username') username: string,
    @CognitoUser('name') name: string,
    @CognitoUser('email') email: string,
    @Body() criaPedidoDTO: CriaPedidoDTO,
  ) {
    const criaClienteDTO = new CriaClienteDTO();
    if (this.amazonCognitoIsEnabled()) {
      criaPedidoDTO.cpfCliente = username;
      criaClienteDTO.nome = name;
      criaClienteDTO.email = email;
      criaClienteDTO.cpf = username;
    }
    try {
      return await this.pedidoUseCase.criarPedido(
        criaClienteDTO,
        criaPedidoDTO,
      );
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

  @Post('/webhook')
  @HttpCode(201)
  @ApiOperation({ summary: 'Consumir uma mensagem' })
  @ApiResponse({
    status: 201,
    description: 'Mensagem consumida com sucesso',
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
  async consumirMensagem(
    @Query('id') id: string,
    @Query('topic') topic: string,
    @Body() mensagem: MensagemMercadoPagoDTO,
  ) {
    try {
      return await this.pedidoUseCase.webhookPagamento(id, topic, mensagem);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  private amazonCognitoIsEnabled(): boolean {
    return (
      this.configService
        .get<string>('ENABLE_AMZ_COGNITO_CIAM')
        ?.toLowerCase() === 'true'
    );
  }
}
