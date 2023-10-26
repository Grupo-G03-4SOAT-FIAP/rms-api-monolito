import { HttpException, HttpStatus } from '@nestjs/common';

export class ProdutoNaoLocalizadoErro extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.NOT_FOUND);
  }
}

export class ProdutoDuplicadoErro extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.CONFLICT);
  }
}
