import { HttpException, HttpStatus } from '@nestjs/common';

export class ProdutoNaoLocalizadoErro extends HttpException {
  constructor() {
    super('Produto não localizado', HttpStatus.NOT_FOUND);
  }
}
