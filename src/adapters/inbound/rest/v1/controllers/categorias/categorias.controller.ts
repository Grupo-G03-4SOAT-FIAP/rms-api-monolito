import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';

import { AtualizaCategoriaDTO } from '../../presenters/dto/categoria/AtualizaCategoria.dto';
import { CriaCategoriaDTO } from '../../presenters/dto/categoria/CriaCategoria.dto';
import { ICategoriaUseCase } from 'src/domain/ports/categoria/ICategoriaUseCase';

@Controller('categorias')
export class CategoriaController {
  constructor(
    @Inject(ICategoriaUseCase)
    private readonly CategoriaUseCase: ICategoriaUseCase,
  ) {}

  @Post()
  async criaNovo(@Body() dadosCategoria: CriaCategoriaDTO) {
    return await this.CategoriaUseCase.criaNova(dadosCategoria);
  }

  @Get()
  async listaTodos() {
    return await this.CategoriaUseCase.listaTodas();
  }

  @Get(':id')
  async listaUma(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.CategoriaUseCase.listaUma(id);
  }

  @Put('/:id')
  async atualiza(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dadosCategoria: AtualizaCategoriaDTO,
  ) {
    return await this.CategoriaUseCase.atualiza(id, dadosCategoria);
  }

  @Delete('/:id')
  async remove(@Param('id') id: string) {
    return await this.CategoriaUseCase.remove(id);
  }
}
