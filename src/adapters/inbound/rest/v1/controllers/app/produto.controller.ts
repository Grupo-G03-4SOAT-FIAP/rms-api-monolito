import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { AtualizaProdutoDTO } from '../../presenters/dto/AtualizaProduto.dto';
import { CriaProdutoDTO } from '../../presenters/dto/CriaProduto.dto';
import { ProdutoUseCase } from 'src/domain/use_cases/app/produto.use_case';

@Controller('produtos')
export class ProdutoController {
  constructor(private readonly produtoUseCase: ProdutoUseCase) {}

  @Post()
  async criaNovo(@Body() dadosProduto: CriaProdutoDTO) {
    return this.produtoUseCase.criaNovo(dadosProduto);
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
