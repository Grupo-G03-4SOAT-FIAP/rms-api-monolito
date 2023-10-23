import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
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

@Controller('categoria')
export class CategoriaController {
  constructor(
    @Inject(ICategoriaUseCase)
    private readonly categoriaUseCase: ICategoriaUseCase,
  ) {}

  @Post()
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
  async listar() {
    return await this.categoriaUseCase.listarCategorias();
  }
}
