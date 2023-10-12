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
import { ICategoriaUseCase } from 'src/domain/ports/categoria/ICategoriaUseCase';

@Controller('categorias')
export class CategoriaController {
  constructor(
    @Inject(ICategoriaUseCase)
    private readonly CategoriaUseCase: ICategoriaUseCase,
  ) {}

  @Post()
  async criaNovo(@Body() dadosCategoria: CriaCategoriaDTO) {
    return this.CategoriaUseCase.criaNova(dadosCategoria);
  }

  @Get()
  async listaTodos() {
    return this.CategoriaUseCase.listaTodas();
  }

  @Put('/:id')
  async atualiza(
    @Param('id') id: number,
    @Body() dadosCategoria: AtualizaCategoriaDTO,
  ) {
    const categoriaAlterada = await this.CategoriaUseCase.atualiza(
      id,
      dadosCategoria,
    );

    return {
      mensagem: 'categoria atualizada com sucesso',
      categoria: categoriaAlterada,
    };
  }

  @Delete('/:id')
  async remove(@Param('id') id: number) {
    const categoriaRemovida = await this.CategoriaUseCase.remove(id);

    return {
      mensagem: 'categoria removida com sucesso',
      categoria: categoriaRemovida,
    };
  }
}
