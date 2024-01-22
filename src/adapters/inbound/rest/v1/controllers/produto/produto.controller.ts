import {
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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IProdutoUseCase } from 'src/domain/ports/produto/produto.use_case.port';
import { BadRequestError } from '../../../helpers/swagger/status-codes/bad_requests.swagger';
import { NotFoundError } from '../../../helpers/swagger/status-codes/not_found.swagger';
import { ConflictError } from '../../../helpers/swagger/status-codes/conflict.swagger';
import {
  AtualizaProdutoDTO,
  CriaProdutoDTO,
  ProdutoDTO,
} from '../../presenters/produto.dto';

@Controller('produto')
@ApiTags('Produto')
export class ProdutoController {
  constructor(
    @Inject(IProdutoUseCase)
    private readonly produtoUseCase: IProdutoUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Adicionar um novo produto ' })
  @ApiResponse({
    status: 201,
    description: 'Produto criado com sucesso',
    type: ProdutoDTO,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
    type: BadRequestError,
  })
  @ApiResponse({
    status: 404,
    description: 'Categoria informada não existe',
    type: NotFoundError,
  })
  @ApiResponse({
    status: 409,
    description: 'Existe um produto com esse nome',
    type: ConflictError,
  })
  async criar(@Body() produto: CriaProdutoDTO) {
    try {
      return await this.produtoUseCase.criarProduto(produto);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException(error.message);
      }
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Atualizar um produto' })
  @ApiResponse({
    status: 200,
    description: 'Produto atualizado com sucesso',
    type: ProdutoDTO,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
    type: BadRequestError,
  })
  @ApiResponse({
    status: 404,
    description: 'Produto informado não existe',
    type: NotFoundError,
  })
  @ApiResponse({
    status: 404,
    description: 'Categoria informada não existe',
    type: NotFoundError,
  })
  @ApiResponse({
    status: 409,
    description: 'Existe um produto com esse nome',
    type: ConflictError,
  })
  async atualizar(
    @Param('id') id: string,
    @Body() produto: AtualizaProdutoDTO,
  ) {
    try {
      return await this.produtoUseCase.editarProduto(id, produto);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException(error.message);
      }
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Remover um produto' })
  @ApiResponse({
    status: 200,
    description: 'Produto excluído com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Produto informado não existe',
    type: NotFoundError,
  })
  async remover(@Param('id') id: string) {
    try {
      return await this.produtoUseCase.excluirProduto(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Buscar um produto pelo id' })
  @ApiResponse({
    status: 200,
    description: 'Produto retornado com sucesso',
    type: ProdutoDTO,
  })
  @ApiResponse({
    status: 404,
    description: 'Produto informado não existe',
    type: NotFoundError,
  })
  async buscar(@Param('id') id: string) {
    try {
      return await this.produtoUseCase.buscarProduto(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os produtos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de produtos retornada com sucesso',
    type: ProdutoDTO,
    isArray: true,
  })
  async listar() {
    return await this.produtoUseCase.listarProdutos();
  }

  @Get('/categoria/:id')
  @ApiOperation({ summary: 'Listar produtos de uma categoria' })
  @ApiResponse({
    status: 200,
    description: 'Produtos retornados com sucesso',
    type: ProdutoDTO,
  })
  @ApiResponse({
    status: 404,
    description: 'Categoria informada não existe',
    type: NotFoundError,
  })
  async listarPorCategoria(@Param('id') id: string) {
    try {
      return await this.produtoUseCase.listarProdutosPorCategoria(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
}
