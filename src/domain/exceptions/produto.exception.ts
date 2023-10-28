import { HttpException, HttpStatus } from '@nestjs/common';

export class ProdutoNaoLocalizadoErro extends HttpException {
  constructor(message: string) {
    const errorResponse = {
      message: message,
      error: 'Not found',
      statusCode: HttpStatus.NOT_FOUND,
    };
    super(errorResponse, HttpStatus.NOT_FOUND);
  }
}

export class ProdutoDuplicadoErro extends HttpException {
  constructor(message: string) {
    const errorResponse = {
      message: message,
      error: 'Conflict',
      statusCode: HttpStatus.CONFLICT,
    };
    super(errorResponse, HttpStatus.CONFLICT);
  }
}
