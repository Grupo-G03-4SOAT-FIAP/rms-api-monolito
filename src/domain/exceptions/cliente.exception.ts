import { HttpException, HttpStatus } from '@nestjs/common';

export class ClienteNaoLocalizadoErro extends HttpException {
  constructor(message: string) {
    const errorResponse = {
      message: message,
      error: 'Not found',
      statusCode: HttpStatus.NOT_FOUND,
    };
    super(errorResponse, HttpStatus.NOT_FOUND);
  }
}

export class ClienteDuplicadoErro extends HttpException {
  constructor(message: string) {
    const errorResponse = {
      message: message,
      error: 'Conflict',
      statusCode: HttpStatus.CONFLICT,
    };
    super(errorResponse, HttpStatus.CONFLICT);
  }
}

export class CPFInvalidoErro extends HttpException {
  constructor(message: string) {
    const errorResponse = {
      message: message,
      error: 'Bad request',
      statusCode: HttpStatus.BAD_REQUEST,
    };
    super(errorResponse, HttpStatus.BAD_REQUEST);
  }
}
