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

import { AtualizaCategoriaDTO } from '../../presenters/dto/categoria/AtualizaCategoria.dto';
import { CriaCategoriaDTO } from '../../presenters/dto/categoria/CriaCategoria.dto';
import { ICategoriaUseCase } from '../../../../../../domain/ports/categoria/ICategoriaUseCase';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateCategoriasSwagger } from '../../swagger/categorias/create-categorias-swagger';
import { ShowCategoriasSwagger } from '../../swagger/categorias/show-categorias-swagger';
import { UpdateCategoriasSwagger } from '../../swagger/categorias/update-categorias-swagger';
import { BadRequestSwagger } from '../../swagger/status-codes/bad-request.swagger';
import { NotFoundSwagger } from '../../swagger/status-codes/not-found.swagger';

@Controller('categorias')
@ApiTags('categorias')
export class CategoriaController {
  constructor(
    @Inject(ICategoriaUseCase)
    private readonly CategoriaUseCase: ICategoriaUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Adicionar uma nova categoria' })
  @ApiResponse({
    status: 201,
    description: 'Categoria criada com sucesso',
    type: CreateCategoriasSwagger,
  })
  @ApiResponse({
    status: 400,
    description: 'Parâmetros inválidos',
    type: BadRequestSwagger,
  })
  async criaNovo(@Body() dadosCategoria: CriaCategoriaDTO) {
    return await this.CategoriaUseCase.criaNova(dadosCategoria);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as categorias' })
  @ApiResponse({
    status: 200,
    description: 'Lista de categorias retornada com sucesso',
    type: ShowCategoriasSwagger,
    isArray: true,
  })
  async listaTodos() {
    return await this.CategoriaUseCase.listaTodas();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Listar uma categoria' })
  @ApiResponse({
    status: 200,
    description: 'Dados de uma categoria retornado com sucesso',
    type: ShowCategoriasSwagger,
  })
  @ApiResponse({
    status: 404,
    description: 'Categoria não foi encontrada',
    type: NotFoundSwagger,
  })
  async listaUma(@Param('id') id: number) {
    return await this.CategoriaUseCase.listaUma(id);
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Atualizar uma categorias' })
  @ApiResponse({
    status: 200,
    description: 'Categoria atualizada com sucesso',
    type: UpdateCategoriasSwagger,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
    type: BadRequestSwagger,
  })
  @ApiResponse({
    status: 404,
    description: 'Categoria não foi encontrada',
    type: NotFoundSwagger,
  })
  async atualiza(
    @Param('id') id: number,
    @Body() dadosCategoria: AtualizaCategoriaDTO,
  ) {
    return await this.CategoriaUseCase.atualiza(id, dadosCategoria);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Remover uma categoria' })
  @ApiResponse({
    status: 204,
    description: 'Categoria removida com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Categoria não foi encontrada',
    type: NotFoundSwagger,
  })
  async remove(@Param('id') id: number) {
    return await this.CategoriaUseCase.remove(id);
  }
}
