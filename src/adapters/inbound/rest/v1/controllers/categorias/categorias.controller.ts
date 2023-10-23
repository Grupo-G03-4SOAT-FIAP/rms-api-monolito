import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
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
    return await this.categoriaUseCase.criarCategoria(categoria);
  }

  @Put('/:id')
  async atualizar(
    @Param('id') id: string,
    @Body() categoria: AtualizaCategoriaDTO,
  ) {
    return await this.categoriaUseCase.editarCategoria(id, categoria);
  }

  @Delete('/:id')
  async remover(@Param('id') id: string) {
    return await this.categoriaUseCase.excluirCategoria(id);
  }

  @Get('/:id')
  async buscar(@Param('id') id: string) {
    return await this.categoriaUseCase.buscarCategoria(id);
  }

  @Get()
  async listar() {
    return await this.categoriaUseCase.listarCategorias();
  }
}
