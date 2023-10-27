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
import { ICategoriaUseCase } from 'src/domain/ports/categoria/categoria.use_case.port';
import {
  AtualizaCategoriaDTO,
  CriaCategoriaDTO,
} from '../../presenters/categoria.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CategoriasSwagger } from '../helpers/swagger/categoria/categoria.swagger';
import { BadRequestSwagger } from '../helpers/swagger/status-codes/bad_requests.swagger';
import { NotFoundSwagger } from '../helpers/swagger/status-codes/not_found.swagger';
import { ConflictSwagger } from '../helpers/swagger/status-codes/conflict.swagger';

@Controller('categoria')
@ApiTags('Categoria')
export class CategoriaController {
  constructor(
    @Inject(ICategoriaUseCase)
    private readonly categoriaUseCase: ICategoriaUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Adicionar uma nova categoria' })
  @ApiResponse({
    status: 201,
    description: 'Categoria criada com sucesso',
    type: CategoriasSwagger,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
    type: BadRequestSwagger,
  })
  async criar(@Body() categoria: CriaCategoriaDTO) {
    try {
      return await this.categoriaUseCase.criarCategoria(categoria);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException(error.message);
      }
      throw error;
    }
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Atualizar uma categoria' })
  @ApiResponse({
    status: 200,
    description: 'Categoria atualizada com sucesso',
    type: CategoriasSwagger,
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
    description: 'Existe uma categoria com esse dado',
    type: ConflictSwagger,
  })
  async atualizar(
    @Param('id') id: string,
    @Body() categoria: AtualizaCategoriaDTO,
  ) {
    try {
      return await this.categoriaUseCase.editarCategoria(id, categoria);
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
  @ApiOperation({ summary: 'Remover uma categoria' })
  @ApiResponse({
    status: 204,
    description: 'Categoria excluida com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Categoria informada não existe',
    type: NotFoundSwagger,
  })
  async remover(@Param('id') id: string) {
    try {
      return await this.categoriaUseCase.excluirCategoria(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Listar uma categoria' })
  @ApiResponse({
    status: 200,
    description: 'Categoria retornada com sucesso',
    type: CategoriasSwagger,
  })
  @ApiResponse({
    status: 404,
    description: 'Categoria informada não existe',
    type: NotFoundSwagger,
  })
  async buscar(@Param('id') id: string) {
    try {
      return await this.categoriaUseCase.buscarCategoria(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as categorias' })
  @ApiResponse({
    status: 200,
    description: 'Lista de categorias retornada com sucesso',
    type: CategoriasSwagger,
    isArray: true,
  })
  async listar() {
    return await this.categoriaUseCase.listarCategorias();
  }
}
