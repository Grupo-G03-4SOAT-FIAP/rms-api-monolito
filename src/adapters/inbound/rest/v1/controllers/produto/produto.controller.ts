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
import { IProdutoUseCase } from 'src/domain/ports/produto/produto.use_case.port';
import {
  AtualizaProdutoDTO,
  CriaProdutoDTO,
} from '../../presenters/produto.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProdutoSwagger } from '../helpers/swagger/produto/produto.swagger';
import { BadRequestSwagger } from '../helpers/swagger/status-codes/bad_requests.swagger';
import { NotFoundSwagger } from '../helpers/swagger/status-codes/not_found.swagger';
import { ConflictSwagger } from '../helpers/swagger/status-codes/conflict.swagger';

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
    type: ProdutoSwagger,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
    type: BadRequestSwagger,
  })
  @ApiResponse({
    status: 404,
    description: 'Categoria informada não existe',
    type: NotFoundSwagger,
  })
  @ApiResponse({
    status: 409,
    description: 'Existe um produto com esse nome',
    type: ConflictSwagger,
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
  @ApiOperation({ summary: 'Atualizar produto' })
  @ApiResponse({
    status: 200,
    description: 'Produto atualizado com sucesso',
    type: ProdutoSwagger,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
    type: BadRequestSwagger,
  })
  @ApiResponse({
    status: 404,
    description:
      'Produto informado não existe <br/>' + 'Categoria informada não existe',
    type: NotFoundSwagger,
  })
  @ApiResponse({
    status: 409,
    description: 'Existe um produto com esse nome',
    type: ConflictSwagger,
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
    status: 204,
    description: 'Produto excluído com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Produto informado não existe',
    type: NotFoundSwagger,
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
    type: ProdutoSwagger,
  })
  @ApiResponse({
    status: 404,
    description: 'Produto informado não existe',
    type: NotFoundSwagger,
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
    type: ProdutoSwagger,
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
    type: ProdutoSwagger,
  })
  @ApiResponse({
    status: 404,
    description: 'Categoria informada não existe',
    type: NotFoundSwagger,
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
