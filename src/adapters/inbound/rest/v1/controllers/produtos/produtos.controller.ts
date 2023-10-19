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

import { AtualizaProdutoDTO } from '../../presenters/produto/AtualizaProduto.dto';
import { CriaProdutoDTO } from '../../presenters/produto/CriaProduto.dto';
import { IProdutoUseCase } from 'src/domain/ports/produto/IProdutoUseCase';

@Controller('produto')
export class ProdutoController {
  constructor(
    @Inject(IProdutoUseCase)
    private readonly produtoUseCase: IProdutoUseCase,
  ) {}

  @Post()
  async criaNovo(@Body() dadosProduto: CriaProdutoDTO) {
    const produtoCriado = this.produtoUseCase.criaNovo(dadosProduto);
    return {
      mensagem: 'produto criado com sucesso',
      produto: produtoCriado,
    };
  }

  @Get()
  async listaTodos() {
    return this.produtoUseCase.listaTodos();
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
