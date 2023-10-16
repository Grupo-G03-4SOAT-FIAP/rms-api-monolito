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

import { AtualizaProdutoDTO } from '../../presenters/dto/produto/AtualizaProduto.dto';
import { CriaProdutoDTO } from '../../presenters/dto/produto/CriaProduto.dto';
import { IProdutoUseCase } from '../../../../../../domain/ports/produto/IProdutoUseCase';

@Controller('produtos')
export class ProdutoController {
  constructor(
    @Inject(IProdutoUseCase)
    private readonly produtoUseCase: IProdutoUseCase,
  ) {}

  @Post()
  async criaNovo(@Body() dadosProduto: CriaProdutoDTO) {
    return this.produtoUseCase.criaNovo(dadosProduto);
  }

  @Get()
  async listaTodos() {
    return this.produtoUseCase.listaTodos();
  }

  @Get('categorias/:id')
  async listaPorCategoria(@Param('categoriaId') categoriaId: string) {
    return await this.produtoUseCase.listaPorCategoria(categoriaId);
  }

  @Put('/:id')
  async atualiza(
    @Param('id') id: string,
    @Body() dadosProduto: AtualizaProdutoDTO,
  ) {
    const produtoAlterado = await this.produtoUseCase.atualiza(
      id,
      dadosProduto,
    );

    return {
      mensagem: 'produto atualizado com sucesso',
      produto: produtoAlterado,
    };
  }

  @Delete('/:id')
  async remove(@Param('id') id: string) {
    const produtoRemovido = await this.produtoUseCase.remove(id);

    return {
      mensagem: 'produto removido com sucesso',
      produto: produtoRemovido,
    };
  }
}
