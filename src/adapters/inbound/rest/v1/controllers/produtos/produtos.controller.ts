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
import { IProdutoUseCase } from 'src/domain/ports/produto/produto.use_case.port';
import {
  AtualizaProdutoDTO,
  CriaProdutoDTO,
} from '../../presenters/produto.dto';

@Controller('produto')
export class ProdutoController {
  constructor(
    @Inject(IProdutoUseCase)
    private readonly produtoUseCase: IProdutoUseCase,
  ) {}

  @Post()
  async criar(@Body() produto: CriaProdutoDTO) {
    return await this.produtoUseCase.criarProduto(produto);
  }

  @Put('/:id')
  async atualizar(
    @Param('id') id: string,
    @Body() produto: AtualizaProdutoDTO,
  ) {
    return await this.produtoUseCase.editarProduto(id, produto);
  }

  @Delete('/:id')
  async remover(@Param('id') id: string) {
    return await this.produtoUseCase.excluirProduto(id);
  }

  @Get('/:id')
  async buscar(@Param('id') id: string) {
    return await this.produtoUseCase.buscarProduto(id);
  }

  @Get()
  async listar() {
    return await this.produtoUseCase.listarProdutos();
  }

  @Get('/categoria/:id')
  async listarPorCategoria(@Param('id') id: string) {
    return await this.produtoUseCase.listarProdutosPorCategoria(id);
  }
}
