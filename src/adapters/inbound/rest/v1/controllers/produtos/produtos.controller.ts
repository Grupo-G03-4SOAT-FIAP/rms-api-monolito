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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateProdutosSwagger } from '../../swagger/produtos/create-produtos-swagger';
import { ShowProdutosSwagger } from '../../swagger/produtos/show-produtos-swagger';
import { UpdateProdutosSwagger } from '../../swagger/produtos/update-produtos-swagger';
import { BadRequestSwagger } from '../../swagger/status-codes/bad-request.swagger';
import { NotFoundSwagger } from '../../swagger/status-codes/not-found.swagger';

@Controller('produtos')
@ApiTags('produtos')
export class ProdutoController {
  constructor(
    @Inject(IProdutoUseCase)
    private readonly produtoUseCase: IProdutoUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Adicionar um produto' })
  @ApiResponse({
    status: 201,
    description: 'Produto criado com sucesso',
    type: CreateProdutosSwagger,
  })
  @ApiResponse({
    status: 400,
    description: 'Parâmetros inválidos',
    type: BadRequestSwagger,
  })
  async criaNovo(@Body() dadosProduto: CriaProdutoDTO) {
    return this.produtoUseCase.criaNovo(dadosProduto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os produtos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de produtos retornada com sucesso',
    type: ShowProdutosSwagger,
    isArray: true,
  })
  async listaTodos() {
    return await this.produtoUseCase.listaTodos();
  }

  @Get('/categoria/:id')
  @ApiOperation({ summary: 'Listas todos os produtos de uma categoria' })
  @ApiResponse({
    status: 200,
    description: 'Lista de produtos de uma categoria retornado com sucesso',
    type: ShowProdutosSwagger,
    isArray: true,
  })
  async listaTodosPorCategoria(@Param('id') id_categoria: number) {
    return await this.produtoUseCase.listaPorCategoria(id_categoria);
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Atualizar um produto' })
  @ApiResponse({
    status: 200,
    description: 'Produto atualizado com sucesso',
    type: UpdateProdutosSwagger,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
    type: BadRequestSwagger,
  })
  @ApiResponse({
    status: 404,
    description: 'Produto não foi encontrado',
    type: NotFoundSwagger,
  })
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
  @ApiOperation({ summary: 'Remover um produto' })
  @ApiResponse({
    status: 204,
    description: 'Produto removido com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Produto não foi encontrado',
    type: NotFoundSwagger,
  })
  async remove(@Param('id') id: string) {
    const produtoRemovido = await this.produtoUseCase.remove(id);

    return {
      mensagem: 'produto removido com sucesso',
      produto: produtoRemovido,
    };
  }
}
