import { HttpException, HttpStatus } from '@nestjs/common';

export class ProdutoNaoLocalizadoErro extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.NOT_FOUND);
  }
}

export class NomeProdutoDuplicadoErro extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.CONFLICT);
  }
}
